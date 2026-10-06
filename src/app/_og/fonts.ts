import type { ImageResponse } from 'next/og';
import { isBuildPhase, loadFallbackFontFiles, remoteTimeoutMs } from './assets';

/**
 * Fonts for the share images: the site's own faces, fetched from Google Fonts.
 *
 * Satori only reads TTF/OTF/WOFF, so each font is requested from the CSS2 API
 * with a legacy User-Agent (which makes Google answer with TrueType) and the `text=`
 * parameter, which returns a tiny static instance containing just the glyphs the image
 * uses (a few KB instead of a whole variable font). Results are cached per process.
 *
 * If Google Fonts can't be reached (or answers too slowly) the local Poppins files in
 * `public/font/` stand in under the same family names, so an image is still produced.
 * Only Latin text is drawn (see `toLatinText` in event-image.tsx), which the brand faces cover.
 */

export const DISPLAY_FONT = 'Bricolage Grotesque';
export const BODY_FONT = 'Plus Jakarta Sans';
export const SCRIPT_FONT = 'Pacifico';

export const DISPLAY_STACK = DISPLAY_FONT;
export const BODY_STACK = BODY_FONT;
export const SCRIPT_STACK = SCRIPT_FONT;

type OgOptions = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>;
export type OgFont = NonNullable<OgOptions['fonts']>[number];
type Weight = 400 | 500 | 600 | 700;

// Any modern UA gets WOFF2, which Satori can't read. An old Safari UA gets TrueType.
const TRUETYPE_USER_AGENT =
  'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1';
/** Extra attempts at build time, so one network blip doesn't bake fallback fonts into a static image. */
const BUILD_RETRIES = 2;
/** After a failed fetch, serve the fallback fonts for this long before trying Google again. */
const FAILURE_BACKOFF_MS = 60_000;
const MAX_CACHE_ENTRIES = 48;

/** Glyphs always requested, so every preset page shares one cached font file per face. */
const BASE_GLYPHS =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' +
  ' –—‘’“”…·•₹→';

/** The base glyphs plus any extra characters used by a dynamic string (an event title). */
function glyphSet(text: string): string {
  const all = new Set(BASE_GLYPHS);
  for (const char of text) {
    if (char >= ' ' && char !== '\u007F') all.add(char);
  }
  return [...all].sort().join('');
}

interface CacheEntry {
  promise: Promise<OgFont[] | null>;
  failedAt?: number;
}
const fontCache = new Map<string, CacheEntry>();

async function fetchGoogleFont(family: string, weights: Weight[], glyphs: string): Promise<OgFont[] | null> {
  try {
    const cssUrl =
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}` +
      `:wght@${weights.join(';')}&text=${encodeURIComponent(glyphs)}`;
    const cssRes = await fetch(cssUrl, {
      headers: { 'User-Agent': TRUETYPE_USER_AGENT },
      signal: AbortSignal.timeout(remoteTimeoutMs()),
    });
    if (!cssRes.ok) return null;
    const css = await cssRes.text();

    const faces = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
    const fonts = await Promise.all(
      faces.map(async (face): Promise<OgFont | null> => {
        const weight = Number(/font-weight:\s*(\d+)/.exec(face)?.[1]);
        const url = /src:\s*url\(([^)]+)\)/.exec(face)?.[1]?.replace(/['"]/g, '');
        if (!weight || !url) return null;
        const res = await fetch(url, { signal: AbortSignal.timeout(remoteTimeoutMs()) });
        if (!res.ok) return null;
        return { name: family, data: await res.arrayBuffer(), weight: weight as Weight, style: 'normal' };
      }),
    );

    const loaded = fonts.filter((font): font is OgFont => font !== null);
    return loaded.length === weights.length ? loaded : null;
  } catch {
    return null;
  }
}

async function fetchGoogleFontWithRetry(family: string, weights: Weight[], glyphs: string): Promise<OgFont[] | null> {
  const attempts = isBuildPhase() ? 1 + BUILD_RETRIES : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const fonts = await fetchGoogleFont(family, weights, glyphs);
    if (fonts) return fonts;
  }
  return null;
}

function loadGoogleFont(family: string, weights: Weight[], glyphs: string): Promise<OgFont[] | null> {
  const key = `${family}|${weights.join(',')}|${glyphs}`;
  const hit = fontCache.get(key);
  if (hit && (hit.failedAt === undefined || Date.now() - hit.failedAt < FAILURE_BACKOFF_MS)) {
    return hit.promise;
  }

  const entry: CacheEntry = { promise: fetchGoogleFontWithRetry(family, weights, glyphs) };
  void entry.promise.then((fonts) => {
    if (!fonts) entry.failedAt = Date.now();
  });
  fontCache.delete(key); // re-insert so the newest entry is last
  fontCache.set(key, entry);
  if (fontCache.size > MAX_CACHE_ENTRIES) {
    const oldest = fontCache.keys().next().value;
    if (oldest !== undefined) fontCache.delete(oldest);
  }
  return entry.promise;
}

export interface OgFonts {
  fonts: OgFont[];
  /** True when any brand face was replaced by the local fallback; callers should cache the image briefly. */
  degraded: boolean;
}

/**
 * Returns the fonts to hand to ImageResponse.
 * @param text every string the image will render, so the right glyphs are requested.
 * @param origin the site origin, for the HTTP fallback when Poppins can't be read from disk.
 */
export async function getOgFonts(text: string, origin: string): Promise<OgFonts> {
  const glyphs = glyphSet(text);
  const [display, body, script] = await Promise.all([
    loadGoogleFont(DISPLAY_FONT, [700], glyphs),
    loadGoogleFont(BODY_FONT, [500, 600], glyphs),
    loadGoogleFont(SCRIPT_FONT, [400], glyphs),
  ]);

  const fonts: OgFont[] = [...(display ?? []), ...(body ?? []), ...(script ?? [])];
  const degraded = !display || !body || !script;

  if (degraded) {
    const { bold, regular } = await loadFallbackFontFiles(origin);
    const add = (name: string, data: Buffer | null, weight: Weight) => {
      if (!data) return;
      const copy = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
      fonts.push({ name, data: copy, weight, style: 'normal' });
    };

    if (!display) add(DISPLAY_FONT, bold, 700);
    if (!script) add(SCRIPT_FONT, bold, 400);
    if (!body) {
      add(BODY_FONT, regular, 500);
      add(BODY_FONT, bold, 600);
    }
  }

  return { fonts, degraded };
}
