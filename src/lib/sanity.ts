import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Initialize the Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: true,
});

// Initialize the image URL builder
const builder = imageUrlBuilder(client);

/**
 * Helper function to build image URLs from Sanity image references
 * @param source - The Sanity image source
 * @returns An image URL builder instance
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// GROQ queries live in ./queries.ts (single source of truth). 