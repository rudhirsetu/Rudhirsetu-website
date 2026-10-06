import { client } from '../lib/sanity';
import { QUERIES } from '../lib/queries';
import { SANITY_REVALIDATE_SECONDS, SANITY_TAGS, type SanityTag } from '../lib/sanity-cache';
import type {
  Event,
  GalleryImage,
  DonationSettings,
  ContactSettings,
  SocialMediaSettings,
  Pagination
} from '../types/sanity';

/**
 * Fetch with Next's data cache options. When these services run on the server
 * (server components, route handlers) responses are cached for
 * SANITY_REVALIDATE_SECONDS and can be purged by tag from /api/revalidate.
 * In the browser the `next` option is simply ignored by fetch.
 */
const cachedFetch = <T = unknown>(query: string, tags: SanityTag[]): Promise<T> =>
  client.fetch<T>(query, {}, { next: { revalidate: SANITY_REVALIDATE_SECONDS, tags } });

/**
 * Helper function for retrying API calls
 */
const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.warn(`API call failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded');
};

/**
 * Event-related services
 */
export const eventService = {
  fetchUpcoming: async (page: number = 1, pageSize: number = 6): Promise<{ data: Event[], meta: { pagination: Pagination } } | null> => {
    try {
      const [events, totalCount] = await retryApiCall(() => 
        Promise.all([
          cachedFetch<Event[]>(QUERIES.upcomingEvents(page, pageSize), [SANITY_TAGS.event]),
          cachedFetch<number>(QUERIES.upcomingEventsCount, [SANITY_TAGS.event])
        ])
      );

      const pageCount = Math.ceil(totalCount / pageSize);

      return {
        data: events || [],
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount,
            total: totalCount
          }
        }
      };
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return null;
    }
  },

  fetchPast: async (page: number = 1, pageSize: number = 6): Promise<{ data: Event[], meta: { pagination: Pagination } } | null> => {
    try {
      const [events, totalCount] = await retryApiCall(() =>
        Promise.all([
          cachedFetch<Event[]>(QUERIES.pastEvents(page, pageSize), [SANITY_TAGS.event]),
          cachedFetch<number>(QUERIES.pastEventsCount, [SANITY_TAGS.event])
        ])
      );

      const pageCount = Math.ceil(totalCount / pageSize);

      return {
        data: events || [],
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount,
            total: totalCount
          }
        }
      };
    } catch (error) {
      console.error('Error fetching past events:', error);
      return null;
    }
  },
};

/**
 * Gallery-related services
 */
export const galleryService = {
  fetchAll: async (): Promise<GalleryImage[] | null> => {
    try {
      return await cachedFetch(QUERIES.galleryImages, [SANITY_TAGS.galleryImage]);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      return null;
    }
  },

  fetchByCategory: async (category: string): Promise<GalleryImage[] | null> => {
    try {
      return await cachedFetch(QUERIES.galleryImagesByCategory(category), [SANITY_TAGS.galleryImage]);
    } catch (error) {
      console.error('Error fetching gallery images by category:', error);
      return null;
    }
  },

  fetchFeatured: async (): Promise<GalleryImage[] | null> => {
    try {
      return await cachedFetch(QUERIES.featuredImages, [SANITY_TAGS.galleryImage]);
    } catch (error) {
      console.error('Error fetching featured images:', error);
      return null;
    }
  },
};

/**
 * Settings-related services
 */
export const settingsService = {
  fetchDonation: async (): Promise<DonationSettings | null> => {
    try {
      return await cachedFetch(QUERIES.donationSettings, [SANITY_TAGS.donationSettings]);
    } catch (error) {
      console.error('Error fetching donation settings:', error);
      return null;
    }
  },

  fetchContact: async (): Promise<ContactSettings | null> => {
    try {
      return await cachedFetch(QUERIES.contactSettings, [SANITY_TAGS.contactSettings]);
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      return null;
    }
  },

  fetchSocialMedia: async (): Promise<SocialMediaSettings | null> => {
    try {
      return await cachedFetch(QUERIES.socialMediaSettings, [SANITY_TAGS.socialMediaSettings]);
    } catch (error) {
      console.error('Error fetching social media settings:', error);
      return null;
    }
  },
}; 