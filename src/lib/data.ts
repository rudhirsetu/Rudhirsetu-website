/**
 * Server-side data helpers.
 *
 * Every helper here:
 *  - fetches through the Sanity client with Next's fetch cache options
 *    (`revalidate` + a tag per Sanity `_type`), so pages stay statically
 *    cached (ISR) and the `/api/revalidate` webhook can purge them by tag;
 *  - never throws: on failure it logs and returns `null` / `[]`;
 *  - is wrapped in React `cache()` so repeated calls in one render
 *    (e.g. layout + page) share a single request.
 *
 * Import these from server components only (`page.tsx`, `layout.tsx`, ...).
 */
import { cache } from 'react';
import { client } from './sanity';
import { QUERIES } from './queries';
import { SANITY_REVALIDATE_SECONDS, SANITY_TAGS, type SanityTag } from './sanity-cache';
import type {
  ContactSettings,
  DonationSettings,
  Event,
  GalleryImage,
  SocialMediaSettings,
} from '../types/sanity';

export { SANITY_REVALIDATE_SECONDS, SANITY_TAGS } from './sanity-cache';
export type { SanityTag } from './sanity-cache';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Cached GROQ fetch. Retries once on a transient failure, then returns `null`.
 */
export async function sanityFetch<T>(
  query: string,
  tags: SanityTag[],
  params: Record<string, unknown> = {},
): Promise<T | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await client.fetch<T>(query, params, {
        next: { revalidate: SANITY_REVALIDATE_SECONDS, tags },
      });
    } catch (error) {
      if (attempt === 1) {
        console.error(`Sanity fetch failed (${tags.join(',')}):`, error);
        return null;
      }
      await wait(400);
    }
  }
  return null;
}

/**
 * Lean projection for event cards. Skips `desc` and `gallery`, which can be
 * large and would otherwise be serialised into the page payload.
 */
const EVENT_CARD_FIELDS = `{
  _id,
  _type,
  title,
  date,
  location,
  expectedParticipants,
  isUpcoming,
  shortDesc,
  image
}`;

/** Next upcoming events (soonest first), card fields only. */
export const getUpcomingEventCards = cache(async (limit = 3): Promise<Event[]> => {
  const data = await sanityFetch<Event[]>(
    `*[_type == "event" && isUpcoming == true] | order(date asc) [0...${Math.max(1, Math.floor(limit))}] ${EVENT_CARD_FIELDS}`,
    [SANITY_TAGS.event],
  );
  return data ?? [];
});

/** Most recent past events, card fields only. */
export const getPastEventCards = cache(async (limit = 3): Promise<Event[]> => {
  const data = await sanityFetch<Event[]>(
    `*[_type == "event" && isUpcoming == false] | order(date desc) [0...${Math.max(1, Math.floor(limit))}] ${EVENT_CARD_FIELDS}`,
    [SANITY_TAGS.event],
  );
  return data ?? [];
});

/** Gallery images flagged as featured. */
export const getFeaturedImages = cache(async (): Promise<GalleryImage[]> => {
  const data = await sanityFetch<GalleryImage[]>(QUERIES.featuredImages, [SANITY_TAGS.galleryImage]);
  return data ?? [];
});

/** Organisation contact details (address, phone, email, map URL). */
export const getContactSettings = cache(async (): Promise<ContactSettings | null> =>
  sanityFetch<ContactSettings>(QUERIES.contactSettings, [SANITY_TAGS.contactSettings]),
);

/** Social media links + description. */
export const getSocialMediaSettings = cache(async (): Promise<SocialMediaSettings | null> =>
  sanityFetch<SocialMediaSettings>(QUERIES.socialMediaSettings, [SANITY_TAGS.socialMediaSettings]),
);

/** Donation / bank details. */
export const getDonationSettings = cache(async (): Promise<DonationSettings | null> =>
  sanityFetch<DonationSettings>(QUERIES.donationSettings, [SANITY_TAGS.donationSettings]),
);

/**
 * Contact + social settings needed by site chrome (the Footer). One cached
 * call per render, shared with any page that also asks for them.
 */
export const getSiteSettings = cache(async () => {
  const [contact, social] = await Promise.all([getContactSettings(), getSocialMediaSettings()]);
  return { contact, social };
});
