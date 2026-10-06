'use client';

import type { GalleryImage } from '../../types/sanity';
import { formatCategory, getImageRatio, imageAlt, imageSrc, imageSrcSet } from './image-utils';

const THUMB_WIDTHS = [400, 640, 960];
const THUMB_SIZES = '(min-width: 1280px) 296px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw';

const GalleryTile = ({
  item,
  eager,
  onOpen,
}: {
  item: GalleryImage;
  eager: boolean;
  onOpen: () => void;
}) => (
  <li className="mb-3 break-inside-avoid sm:mb-4">
    {/* The ratio box reserves the space before the image arrives (no layout shift). */}
    <div
      className="group relative isolate overflow-hidden rounded-2xl border border-red-900/10 bg-paper sm:rounded-3xl"
      style={{ aspectRatio: getImageRatio(item.image) }}
    >
      <img
        src={imageSrc(item.image, 640)}
        srcSet={imageSrcSet(item.image, THUMB_WIDTHS)}
        sizes={THUMB_SIZES}
        alt={imageAlt(item)}
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View photo${item.title ? `: ${item.title}` : ''}`}
        className="absolute inset-0 h-full w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-red-700"
      >
        {/* Caption is a hover/focus bonus; the lightbox carries the full caption on touch. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-end bg-gradient-to-t from-red-950/75 via-red-950/0 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
        >
          <span className="block w-full p-4 text-white">
            {item.category && (
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/60">
                {formatCategory(item.category)}
              </span>
            )}
            {item.title && (
              <span className="mt-0.5 line-clamp-2 block font-display text-base font-bold leading-snug tracking-tight">
                {item.title}
              </span>
            )}
          </span>
        </span>
      </button>
    </div>
  </li>
);

/** Masonry via CSS columns: cross-browser, and every tile has a reserved aspect ratio. */
export const GalleryGrid = ({
  images,
  onOpen,
  eagerCount = 0,
}: {
  images: GalleryImage[];
  /** Called with the tile's index inside `images`. */
  onOpen: (index: number) => void;
  /** Number of leading tiles to load eagerly (above-the-fold only). */
  eagerCount?: number;
}) => (
  <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
    {images.map((item, index) => (
      <GalleryTile key={item._id} item={item} eager={index < eagerCount} onOpen={() => onOpen(index)} />
    ))}
  </ul>
);

const SKELETON_RATIOS = [1.3, 0.8, 1, 0.75, 1.4, 1, 0.9, 1.2];

export const GalleryGridSkeleton = () => (
  <ul aria-hidden="true" className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
    {SKELETON_RATIOS.map((ratio, i) => (
      <li key={i} className="mb-3 break-inside-avoid sm:mb-4">
        <div
          className="animate-pulse rounded-2xl border border-red-900/5 bg-red-900/5 sm:rounded-3xl"
          style={{ aspectRatio: ratio }}
        />
      </li>
    ))}
  </ul>
);
