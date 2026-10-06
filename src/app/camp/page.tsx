import { Metadata } from "next";
import CampClient from './CampClient';
import { client } from '../../lib/sanity';
import { QUERIES } from '../../lib/queries';
import { buildMetadata } from '../../lib/seo';
import { CampPageData } from '../../lib/structured-data';
import type { Event } from '../../types/sanity';
import type { EventsPage } from '../../views/Impact';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

export const metadata: Metadata = {
  // The root layout title template appends " | Rudhirsetu Seva Sanstha". The share image comes from ./opengraph-image.tsx.
  ...buildMetadata({
    title: "Our Camps",
    description: 'Discover our blood donation and healthcare camps across India. Join us in saving lives through organised community health initiatives.',
    path: '/camp',
  }),
  keywords: ["camps", "blood donation camps", "healthcare camps", "community health", "medical camps", "rudhirsetu", "NGO"],
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'article:section': 'Healthcare Camps',
    'article:tag': 'Health Camps, Medical Camps, Blood Donation, Healthcare Initiatives',
    'og:see_also': `${baseUrl}/gallery`,
  },
};

const PAGE_SIZE = 6;

// Matches the home page: cached for 5 minutes and revalidated by the `event` tag.
const fetchOptions = { next: { revalidate: 300, tags: ['event'] } };

/** Fetches the first page of events plus the total, mirroring eventService in src/services/sanity-client.ts. */
async function getFirstPage(kind: 'upcoming' | 'past'): Promise<EventsPage | null> {
  const isUpcoming = kind === 'upcoming';
  try {
    const [data, total] = await Promise.all([
      client.fetch<Event[]>(
        isUpcoming ? QUERIES.upcomingEvents(1, PAGE_SIZE) : QUERIES.pastEvents(1, PAGE_SIZE),
        {},
        fetchOptions
      ),
      client.fetch<number>(
        isUpcoming ? QUERIES.upcomingEventsCount : QUERIES.pastEventsCount,
        {},
        fetchOptions
      ),
    ]);

    return {
      data: data ?? [],
      pagination: {
        page: 1,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil((total ?? 0) / PAGE_SIZE),
        total: total ?? 0,
      },
    };
  } catch (error) {
    // The client view retries on mount when it receives null.
    console.error(`Error fetching ${kind} events:`, error);
    return null;
  }
}

export default async function CampPage() {
  const [initialUpcoming, initialPast] = await Promise.all([
    getFirstPage('upcoming'),
    getFirstPage('past'),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        id="camp-page-structured-data"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(CampPageData).replace(/</g, '\\u003c'),
        }}
      />
      <CampClient initialUpcoming={initialUpcoming} initialPast={initialPast} />
    </>
  );
}
