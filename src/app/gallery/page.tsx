import { Metadata } from "next";
import GalleryClient from './GalleryClient';
import { client } from '../../lib/sanity';
import { QUERIES } from '../../lib/queries';
import { buildMetadata } from '../../lib/seo';
import { GalleryPageData } from '../../lib/structured-data';
import type { GalleryImage } from '../../types/sanity';

export const metadata: Metadata = {
  // The root layout title template appends " | Rudhirsetu Seva Sanstha". The share image comes from ./opengraph-image.tsx.
  ...buildMetadata({
    title: "Gallery",
    description: 'Photos from our blood donation camps, healthcare initiatives and community outreach programs across India. See our work in action.',
    path: '/gallery',
  }),
  keywords: ["gallery", "photos", "blood donation camps", "healthcare", "community impact", "rudhirsetu", "NGO"],
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'article:section': 'Gallery',
    'article:tag': 'Photo Gallery, Community Service, Blood Donation, Healthcare',
  },
};

// Fetched on the server so the page ships with its photos (no skeleton flash).
// Revalidated every 5 minutes, or on demand via the `galleryImage` tag.
const fetchOptions = { next: { revalidate: 300, tags: ['galleryImage'] } };

export default async function GalleryPage() {
  let initialImages: GalleryImage[] = [];
  let featuredImages: GalleryImage[] = [];
  let loadError = false;

  try {
    [initialImages, featuredImages] = await Promise.all([
      client.fetch<GalleryImage[]>(QUERIES.galleryImages, {}, fetchOptions),
      client.fetch<GalleryImage[]>(QUERIES.featuredImages, {}, fetchOptions),
    ]);
  } catch (error) {
    console.error('Error fetching gallery images on the server:', error);
    loadError = true;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(GalleryPageData).replace(/</g, '\\u003c') }}
      />
      <GalleryClient
        initialImages={initialImages ?? []}
        featuredImages={featuredImages ?? []}
        loadError={loadError}
      />
    </>
  );
}
