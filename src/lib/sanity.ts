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



// GROQ Queries
export const QUERIES = {
  allEvents: `*[_type == "event"] | order(date desc)`,
  upcomingEvents: `*[_type == "event" && isUpcoming == true] | order(date asc)`,
  pastEvents: `*[_type == "event" && isUpcoming == false] | order(date desc)`,
  featuredImages: `*[_type == "galleryImage" && isFeatured == true]`,
  galleryImages: `*[_type == "galleryImage" && !isFeatured]`,
  galleryImagesByCategory: (category: string) => `*[_type == "galleryImage" && !isFeatured && category == "${category}"]`,
  donationSettings: `*[_type == "donationSettings"][0]`,
  contactSettings: `*[_type == "contactSettings"][0]`,
}; 