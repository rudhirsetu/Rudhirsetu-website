import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Local images and fonts for the share images.
 *
 * Each file is read straight from `public/` with a literal `path.join(process.cwd(), ...)`
 * (so Vercel's file tracing bundles it with the function). If the read fails, the same file
 * is fetched over HTTP from the site's own origin, and if that fails too the caller simply
 * renders the image without it, so the route never errors because of a missing asset.
 */

export type IllustrationName = 'drop' | 'calendar' | 'camera' | 'social' | 'donate' | 'contact';

export interface LoadedImage {
  /** `data:` URL, ready for an <img src>. */
  src: string;
  width: number;
  height: number;
}

type Reader = () => Promise<Buffer>;

// Literal paths on purpose: file tracing cannot follow computed ones.
const ILLUSTRATIONS: Record<IllustrationName, { publicPath: string; read: Reader }> = {
  drop: { publicPath: '/og/drop.png', read: () => readFile(path.join(process.cwd(), 'public', 'og', 'drop.png')) },
  calendar: { publicPath: '/og/calendar.png', read: () => readFile(path.join(process.cwd(), 'public', 'og', 'calendar.png')) },
  camera: { publicPath: '/og/camera.png', read: () => readFile(path.join(process.cwd(), 'public', 'og', 'camera.png')) },
  social: { publicPath: '/og/social.png', read: () => readFile(path.join(process.cwd(), 'public', 'og', 'social.png')) },
  donate: { publicPath: '/og/donate.png', read: () => readFile(path.join(process.cwd(), 'public', 'og', 'donate.png')) },
  contact: { publicPath: '/og/contact.png', read: () => readFile(path.join(process.cwd(), 'public', 'og', 'contact.png')) },
};

const LOGO = {
  publicPath: '/images/logo-light.svg',
  read: () => readFile(path.join(process.cwd(), 'public', 'images', 'logo-light.svg')),
} satisfies { publicPath: string; read: Reader };

const FALLBACK_FONTS = {
  bold: {
    publicPath: '/font/Poppins-Bold.ttf',
    read: () => readFile(path.join(process.cwd(), 'public', 'font', 'Poppins-Bold.ttf')),
  },
  regular: {
    publicPath: '/font/Poppins-Regular.ttf',
    read: () => readFile(path.join(process.cwd(), 'public', 'font', 'Poppins-Regular.ttf')),
  },
} satisfies Record<string, { publicPath: string; read: Reader }>;

const FALLBACK_BANNER = {
  publicPath: '/og-thumbnail.png',
  read: () => readFile(path.join(process.cwd(), 'public', 'og-thumbnail.png')),
} satisfies { publicPath: string; read: Reader };

async function readPublicFile(file: { publicPath: string; read: Reader }, origin: string): Promise<Buffer | null> {
  try {
    return await file.read();
  } catch {
    // Not on disk (for example, `public/` is not part of the function bundle): ask the CDN instead.
  }
  try {
    const res = await fetch(new URL(file.publicPath, origin), { signal: AbortSignal.timeout(3000) });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
  } catch {
    // fall through
  }
  return null;
}

/** True while `next build` is prerendering; network fetches may then take longer, since no visitor is waiting. */
export function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

/** Per-request timeout for remote fetches: generous at build time, short when an ISR refresh or a cold request is waiting. */
export function remoteTimeoutMs(): number {
  return isBuildPhase() ? 10_000 : 1_500;
}

/** Memoises an async loader per key for the lifetime of the server process. */
function memoize<K extends string, V>(load: (key: K, origin: string) => Promise<V | null>) {
  const cache = new Map<K, Promise<V | null>>();
  return (key: K, origin: string) => {
    let hit = cache.get(key);
    if (!hit) {
      hit = load(key, origin);
      cache.set(key, hit);
      // Don't pin a failure: retry on the next request.
      void hit.then((value) => {
        if (value === null) cache.delete(key);
      });
    }
    return hit;
  };
}

/** Width and height from a PNG's IHDR chunk. */
function pngSize(png: Buffer): { width: number; height: number } {
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

const loadIllustrationCached = memoize<IllustrationName, LoadedImage>(async (name, origin) => {
  const png = await readPublicFile(ILLUSTRATIONS[name], origin);
  if (!png) return null;
  return { src: `data:image/png;base64,${png.toString('base64')}`, ...pngSize(png) };
});

const loadLogoCached = memoize<'logo', LoadedImage>(async (_key, origin) => {
  const svg = await readPublicFile(LOGO, origin);
  if (!svg) return null;
  // The light logo's intrinsic size is 320x331 (see its viewBox).
  return { src: `data:image/svg+xml;base64,${svg.toString('base64')}`, width: 320, height: 331 };
});

export function loadIllustration(name: IllustrationName, origin: string): Promise<LoadedImage | null> {
  return loadIllustrationCached(name, origin);
}

export function loadLogo(origin: string): Promise<LoadedImage | null> {
  return loadLogoCached('logo', origin);
}

/** Local Poppins files, used when Google Fonts can't be reached. */
export async function loadFallbackFontFiles(origin: string): Promise<{ bold: Buffer | null; regular: Buffer | null }> {
  const [bold, regular] = await Promise.all([
    readPublicFile(FALLBACK_FONTS.bold, origin),
    readPublicFile(FALLBACK_FONTS.regular, origin),
  ]);
  return { bold, regular };
}

/** The static banner, served when a dynamic image can't be rendered at all. */
export async function loadFallbackBanner(origin: string): Promise<Buffer | null> {
  return readPublicFile(FALLBACK_BANNER, origin);
}

/**
 * Fetches a remote JPEG/PNG (an event photo from the Sanity CDN) as a `data:` URL.
 * Satori cannot decode WebP/AVIF, so anything other than JPEG or PNG is rejected.
 */
export async function loadRemoteImage(url: string, timeoutMs = remoteTimeoutMs()): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (type !== 'image/jpeg' && type !== 'image/png') return null;
    const bytes = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${bytes.toString('base64')}`;
  } catch {
    return null;
  }
}
// r
// r
// r
