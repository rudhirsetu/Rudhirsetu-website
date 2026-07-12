import { Metadata } from "next";
import Impact from '../../views/Impact';
import { eventService } from '../../services/sanity-client';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

// Re-fetch the camp/events listing periodically (ISR).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Camps | Rudhirsetu Seva Sanstha",
  description: "Discover our impactful blood donation and healthcare camps across India. Join us in our mission to save lives through organized community health initiatives.",
  keywords: ["camps", "blood donation camps", "healthcare camps", "community health", "medical camps", "rudhirsetu", "NGO"],
  openGraph: {
    title: "Our Camps | Rudhirsetu Seva Sanstha",
    description: "Life-saving healthcare initiatives across India",
    url: `${baseUrl}/camp`,
    siteName: "Rudhirsetu Seva Sanstha",
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Our Camps')}&description=${encodeURIComponent('Life-saving healthcare initiatives across India')}&route=camp`,
        width: 1200,
        height: 630,
        alt: "Rudhirsetu Seva Sanstha - Our Camps",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Camps | Rudhirsetu Seva Sanstha",
    description: "Life-saving healthcare initiatives across India",
    images: [`${baseUrl}/api/og?title=${encodeURIComponent('Our Camps')}&description=${encodeURIComponent('Life-saving healthcare initiatives across India')}&route=camp`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/camp`,
  },
  other: {
    'article:section': 'Healthcare Camps',
    'article:tag': 'Health Camps, Medical Camps, Blood Donation, Healthcare Initiatives',
    'og:see_also': `${baseUrl}/gallery`,
  },
};

export default async function CampPage() {
  // Fetch the first page of events on the server so they're in the initial HTML.
  const [upcoming, past] = await Promise.all([
    eventService.fetchUpcoming(1),
    eventService.fetchPast(1),
  ]);

  return (
    <Impact
      initialUpcomingEvents={upcoming?.data ?? []}
      initialUpcomingPagination={upcoming?.meta.pagination ?? null}
      initialPastEvents={past?.data ?? []}
      initialPastPagination={past?.meta.pagination ?? null}
    />
  );
} 