import { Metadata } from "next";
import HomeClient from './HomeClient';
import {
  getContactSettings,
  getFeaturedImages,
  getPastEventCards,
  getUpcomingEventCards,
} from '../lib/data';
import { buildMetadata } from '../lib/seo';

/** The home page shows at most this many event cards (upcoming first, then past). */
const HOME_EVENT_COUNT = 3;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

export const metadata: Metadata = {
  ...buildMetadata({
    title: { absolute: 'Rudhirsetu Seva Sanstha | Transforming Lives Through Blood Donation & Healthcare' },
    description: 'Since 2010, Rudhirsetu Seva Sanstha has been empowering communities across India through life-saving blood donation drives, healthcare support and social initiatives.',
    path: '/',
  }),
  keywords: [
    'Rudhirsetu Seva Sanstha',
    'blood donation India',
    'healthcare support',
    'social initiatives',
    'community empowerment',
    'cancer awareness',
    'blood drives',
    'health camps',
    'NGO India',
    'nonprofit organization',
    'medical aid',
    'thalassemia support',
    'community health',
    'social service',
    'life saving',
    'healthcare NGO',
    'blood bank support'
  ],
  other: {
    'article:section': 'Homepage',
    'article:tag': 'Blood Donation, Healthcare, NGO, Community Service, Social Impact',
    'article:published_time': '2010-01-01T00:00:00.000Z',
    'og:see_also': [
      `${baseUrl}/camp`,
      `${baseUrl}/gallery`,
      `${baseUrl}/donations`
    ].join(','),
  },
};

export default async function HomePage() {
  // Fetched on the server (cached 5 min, purged by Sanity webhook tags), so the
  // events, gallery and contact details are in the initial HTML.
  const [upcomingEvents, pastEvents, featuredImages, contactSettings] = await Promise.all([
    getUpcomingEventCards(HOME_EVENT_COUNT),
    getPastEventCards(HOME_EVENT_COUNT),
    getFeaturedImages(),
    getContactSettings(),
  ]);

  return (
    <HomeClient
      upcomingEvents={upcomingEvents}
      // Past events only fill whatever space upcoming events leave over.
      pastEvents={pastEvents.slice(0, Math.max(0, HOME_EVENT_COUNT - upcomingEvents.length))}
      featuredImages={featuredImages}
      contactSettings={contactSettings}
    />
  );
} 