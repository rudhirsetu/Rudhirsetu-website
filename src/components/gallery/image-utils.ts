import { urlFor } from '../../lib/sanity';
import type { GalleryImage } from '../../types/sanity';

type SanityImageField = GalleryImage['image'] & {
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
};

const FALLBACK_RATIO = 4 / 3;

/**
 * Width / height of a Sanity image, read from the asset reference
 * (`image-<hash>-<width>x<height>-<format>`), with the editor crop applied.
 * No extra query needed, and it lets us reserve space before the image loads.
 */
export function getImageRatio(image: GalleryImage['image'] | undefined): number {
  const source = image as SanityImageField | undefined;
  const match = source?.asset?._ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/i);
  if (!match) return FALLBACK_RATIO;

  let width = Number(match[1]);
  let height = Number(match[2]);
  if (!width || !height) return FALLBACK_RATIO;

  const crop = source?.crop;
  if (crop) {
    width *= 1 - (crop.left ?? 0) - (crop.right ?? 0);
    height *= 1 - (crop.top ?? 0) - (crop.bottom ?? 0);
  }
  const ratio = width / height;
  return Number.isFinite(ratio) && ratio > 0 ? ratio : FALLBACK_RATIO;
}

/** Pixel size of the original upload (from the asset reference), or null if unknown. */
export function getImageSize(image: GalleryImage['image'] | undefined): { width: number; height: number } | null {
  const match = image?.asset?._ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/i);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width && height ? { width, height } : null;
}

/**
 * A tiny, already-blurred copy of the image for use as a backdrop behind a photo shown
 * with `object-contain`. The blur is done by Sanity's image API, not a CSS `filter`,
 * so it costs nothing while scrolling (see docs/DESIGN.md, performance rules).
 */
export function blurredBackdropSrc(image: GalleryImage['image']): string {
  return urlFor(image).width(96).blur(40).auto('format').url();
}

/** Sized, auto-format (WebP/AVIF where supported) Sanity image URL. */
export function imageSrc(image: GalleryImage['image'], width: number): string {
  return urlFor(image).width(width).fit('max').auto('format').url();
}

/** `srcSet` string for a list of widths. */
export function imageSrcSet(image: GalleryImage['image'], widths: number[]): string {
  return widths.map((w) => `${imageSrc(image, w)} ${w}w`).join(', ');
}

/** Best available alt text: Sanity alt, then title, then description. */
export function imageAlt(item: GalleryImage, fallback = 'Gallery photo'): string {
  return item.image?.alt || item.title || item.description || fallback;
}

/** `blood-donation` -> `Blood Donation` */
export function formatCategory(category: string): string {
  return category
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
