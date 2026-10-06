import { ImageResponse } from 'next/og';
import type { ReactElement } from 'react';
import { loadFallbackBanner } from './assets';
import { OG_HEIGHT, OG_WIDTH } from './card';
import type { OgFont } from './fonts';

/**
 * Cache-Control values on the generated image responses. Once prerendered, Next serves the image
 * as a static file with its own headers; these apply to the first (build-time) response, to
 * on-demand renders (a new event, `next dev`) and to ISR refreshes. The default for
 * ImageResponse is a one-year immutable cache, which is wrong for images that change.
 */
export const CACHE_PRESET = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';
/** Event images change when an editor updates the event, so they are cached for less time. */
export const CACHE_EVENT = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';
/** Used when a brand font or the event photo could not be loaded: let the next request try again soon. */
export const CACHE_DEGRADED = 'public, max-age=60, s-maxage=300';

/** Background the JPEG is flattened onto (the card is opaque anyway). */
const BACKGROUND = '#450a0a';
/**
 * Target size for a share image. Link previews drop images that are too large (WhatsApp's
 * limit is about 600 KB) and slow ones can time out, while the lossless PNG that Satori
 * produces is 150-400 KB. So the image is re-encoded as JPEG (typically 60-140 KB), stepping
 * the quality down until it is under this target.
 */
const TARGET_BYTES = 150_000;
const JPEG_QUALITIES = [86, 80, 74, 68, 60];

/**
 * Re-encodes a PNG as a progressive 4:4:4 JPEG (no chroma subsampling, so red/white text edges
 * stay clean) with `sharp`, which ships with Next.js. Returns null when sharp can't be loaded.
 */
async function loadSharp() {
  try {
    return (await import('sharp')).default;
  } catch (error) {
    console.warn('sharp is unavailable; serving the PNG share image unchanged:', error);
    return null;
  }
}

async function pngToJpeg(png: Buffer): Promise<Buffer | null> {
  const sharp = await loadSharp();
  if (!sharp) return null;

  let jpeg = Buffer.alloc(0);
  for (const quality of JPEG_QUALITIES) {
    jpeg = await sharp(png)
      .flatten({ background: BACKGROUND })
      .jpeg({ quality, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4' })
      .toBuffer();
    if (jpeg.length <= TARGET_BYTES) break;
  }
  return jpeg;
}

/**
 * Renders the element to an image response (JPEG, or the original PNG if sharp is missing).
 *
 * ImageResponse streams its body, so a rendering error would only surface after the
 * response had been returned. Reading the whole image here makes failures throw inside
 * the caller's try/catch, where they can be turned into the fallback banner.
 */
export async function renderImage(element: ReactElement, fonts: OgFont[], cacheControl: string): Promise<Response> {
  const image = new ImageResponse(element, { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  const png = Buffer.from(await image.arrayBuffer());
  const jpeg = await pngToJpeg(png);
  const body = jpeg ?? png;
  return new Response(new Uint8Array(body), {
    headers: {
      'Content-Type': jpeg ? 'image/jpeg' : 'image/png',
      'Content-Length': String(body.byteLength),
      'Cache-Control': cacheControl,
    },
  });
}

/** Last resort when an image can't be rendered at all: serve the static banner instead of an error. */
export async function bannerResponse(origin: string): Promise<Response> {
  const banner = await loadFallbackBanner(origin);
  if (!banner) {
    return new Response('Failed to generate image', { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
  return new Response(new Uint8Array(banner), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': CACHE_DEGRADED },
  });
}
