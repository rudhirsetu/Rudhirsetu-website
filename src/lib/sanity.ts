import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  useCdn: true,
});

const builder = imageUrlBuilder(client);

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