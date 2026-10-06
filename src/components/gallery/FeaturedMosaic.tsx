'use client';

import type { GalleryImage } from '../../types/sanity';
import { formatCategory, getImageSize, imageAlt, imageSrc, imageSrcSet } from './image-utils';

const VISIBLE = 5;

/**
 * The large tile wants a sharp, landscape upload: those are almost always real photos,
 * while square and portrait uploads are often text posters. Falls back to the sharpest.
 */
const leadScore = (image: GalleryImage) => {
  const size = getImageSize(image.image);
  if (!size) return 0;
  const landscapePhoto = size.width >= 800 && size.width / size.height >= 1.2;
  return (landscapePhoto ? 1e9 : 0) + size.width * size.height;
};

/**
 * Home-page photo mosaic: one large tile plus four small ones.
 *
 * Featured photos are mostly small, mixed-shape uploads from social media (some only
 * 370px wide), which looked soft and badly cropped in a full-width 21:9 carousel. Here
 * the sharpest upload takes the large tile and the rest are shown near their native size.
 * Clicking any tile opens the lightbox, which pages through every featured photo.
 */
export default function FeaturedMosaic({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
}) {
  if (images.length === 0) return null;

  const indexed = images.map((image, index) => ({ image, index }));
  const lead = indexed.reduce((best, item) => (leadScore(item.image) > leadScore(best.image) ? item : best));
  const tiles = [lead, ...indexed.filter((item) => item !== lead)].slice(0, VISIBLE);
  const hidden = images.length - tiles.length;
  const mosaic = tiles.length === VISIBLE;

  return (
    <ul
      className={`grid gap-3 sm:gap-4 ${
        mosaic ? 'grid-cols-2 md:grid-cols-4' : `grid-cols-2 ${tiles.length > 2 ? 'md:grid-cols-4' : ''}`
      }`}
    >
      {tiles.map(({ image, index }, position) => {
        const isLead = mosaic && position === 0;
        const isLast = position === tiles.length - 1;
        const label = image.title || formatCategory(image.category);
        return (
          <li
            key={image._id}
            className={
              isLead
                ? 'col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto'
                : mosaic
                  ? 'aspect-square'
                  : 'aspect-[4/5]'
            }
          >
            <button
              type="button"
              onClick={() => onImageClick(image, index)}
              aria-label={`View photo: ${label}`}
              className="group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-2xl border border-red-900/10 bg-red-950/5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 sm:rounded-3xl"
            >
              <img
                src={imageSrc(image.image, isLead ? 1200 : 600)}
                srcSet={imageSrcSet(image.image, isLead ? [600, 900, 1200] : [300, 450, 600])}
                sizes={
                  isLead
                    ? '(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw'
                    : '(min-width: 1280px) 300px, (min-width: 768px) 25vw, 50vw'
                }
                alt={imageAlt(image, 'Featured photo')}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-red-950/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <span
                // Captions appear on hover/focus only: many uploads already carry their own text banner.
                className={`absolute inset-x-0 bottom-0 block p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-6 ${
                  isLead ? 'lg:p-8' : ''
                }`}
              >
                {image.category && image.category !== 'other' && (
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-red-200">
                    {formatCategory(image.category)}
                  </span>
                )}
                {isLead && image.title && (
                  <span className="mt-2 block max-w-xl font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                    {image.title}
                  </span>
                )}
              </span>
              {isLast && hidden > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/80 text-white transition-colors duration-300 group-hover:bg-red-950/85"
                >
                  <span className="font-display text-4xl font-bold tabular-nums sm:text-5xl">+{hidden}</span>
                  <span className="mt-1 text-sm text-white/75">more photos</span>
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
