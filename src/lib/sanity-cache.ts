/**
 * Cache settings shared by server data helpers (`lib/data.ts`), the client
 * services (`services/sanity-client.ts`) and the revalidation webhook.
 * Dependency-free so it is safe to import from both server and client code.
 */

/** Seconds a cached Sanity response stays fresh before background revalidation. */
export const SANITY_REVALIDATE_SECONDS = 300;

/**
 * Cache tags. These are the Sanity document `_type` values, so the webhook can
 * simply call `revalidateTag(body._type)`.
 */
export const SANITY_TAGS = {
  event: 'event',
  galleryImage: 'galleryImage',
  contactSettings: 'contactSettings',
  socialMediaSettings: 'socialMediaSettings',
  donationSettings: 'donationSettings',
} as const;

export type SanityTag = (typeof SANITY_TAGS)[keyof typeof SANITY_TAGS];

/** Whether a string is one of the Sanity document types we cache by tag. */
export const isSanityTag = (value: unknown): value is SanityTag =>
  typeof value === 'string' && (Object.values(SANITY_TAGS) as string[]).includes(value);
