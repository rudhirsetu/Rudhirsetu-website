'use client';

import Gallery from '../../views/Gallery';
import type { GalleryImage } from '../../types/sanity';

export default function GalleryClient({
  initialImages,
  featuredImages,
  loadError,
}: {
  initialImages: GalleryImage[];
  featuredImages: GalleryImage[];
  loadError?: boolean;
}) {
  return <Gallery initialImages={initialImages} featuredImages={featuredImages} loadError={loadError} />;
}
