import type { MetadataRoute } from 'next';
import { sanityFetch, SANITY_TAGS } from '../lib/data';
import { SITE_URL } from '../lib/seo';

/** Same 5-minute ISR + `event` tag as the pages, so new events appear without a redeploy. */
export const revalidate = 300;

const STATIC_ROUTES: { path: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/camp', changeFrequency: 'daily', priority: 0.9 },
  { path: '/donations', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/gallery', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/social', changeFrequency: 'monthly', priority: 0.5 },
];

/** Served at /sitemap.xml (replaces the old hand-maintained public/sitemap.xml). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events =
    (await sanityFetch<{ _id: string; _updatedAt?: string }[]>(
      `*[_type == "event" && defined(_id)] | order(date desc) { _id, _updatedAt }`,
      [SANITY_TAGS.event],
    )) ?? [];
  const latestEdit = events.reduce<string | undefined>(
    (latest, event) => (event._updatedAt && (!latest || event._updatedAt > latest) ? event._updatedAt : latest),
    undefined,
  );

  return [
    ...STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      // Home and the events list change whenever an event does.
      lastModified: path === '/' || path === '/camp' ? latestEdit : undefined,
      changeFrequency,
      priority,
    })),
    ...events.map((event) => ({
      url: `${SITE_URL}/event/${event._id}`,
      lastModified: event._updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
