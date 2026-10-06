import { Metadata } from "next";
import SocialClient from './SocialClient';
import { client } from '../../lib/sanity';
import { QUERIES } from '../../lib/queries';
import { buildMetadata } from '../../lib/seo';
import { SocialPageData } from '../../lib/structured-data';
import type { SocialMediaSettings } from '../../types/sanity';

export const metadata: Metadata = {
  // The root layout title template appends " | Rudhirsetu Seva Sanstha". The share image comes from ./opengraph-image.tsx.
  ...buildMetadata({
    title: "Connect With Us",
    description: 'Follow Rudhirsetu on social media for updates on blood donation camps, healthcare initiatives and community impact stories.',
    path: '/social',
  }),
  keywords: ["social media", "follow us", "community", "updates", "blood donation", "healthcare", "rudhirsetu", "NGO"],
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'article:section': 'Social Media',
    'article:tag': 'Social Media, Community, Updates, Follow Us',
    'og:see_also': [
      'https://www.facebook.com/rudhirsetu',
      'https://www.instagram.com/rudhirsetu',
      'https://twitter.com/rudhirsetu'
    ].join(','),
  },
};

// Fetched on the server so the links ship with the page (no skeleton flash).
// Revalidated every 5 minutes, or on demand via the `socialMediaSettings` tag.
export default async function SocialPage() {
  let settings: SocialMediaSettings | null = null;

  try {
    settings = await client.fetch<SocialMediaSettings | null>(
      QUERIES.socialMediaSettings,
      {},
      { next: { revalidate: 300, tags: ['socialMediaSettings'] } },
    );
  } catch (error) {
    console.error('Error fetching social media settings on the server:', error);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SocialPageData).replace(/</g, '\\u003c') }}
      />
      <SocialClient settings={settings ?? null} />
    </>
  );
}
