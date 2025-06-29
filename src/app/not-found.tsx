import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

export const metadata: Metadata = {
  title: 'Page Not Found - 404',
  description: 'The page you are looking for could not be found. Explore our blood donation drives, healthcare camps, and community initiatives instead.',
  openGraph: {
    title: 'Page Not Found | Rudhirsetu Seva Sanstha',
    description: 'This page could not be found. Discover our life-saving blood donation and healthcare initiatives instead.',
    url: `${baseUrl}/404`,
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Page Not Found')}&description=${encodeURIComponent('Discover our life-saving initiatives instead')}&route=home`,
        width: 1200,
        height: 630,
        alt: 'Rudhirsetu Seva Sanstha - Page Not Found',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rudhirsetu',
    title: 'Page Not Found | Rudhirsetu Seva Sanstha',
    description: 'This page could not be found. Discover our life-saving healthcare initiatives instead.',
    images: [`${baseUrl}/api/og?title=${encodeURIComponent('Page Not Found')}&description=${encodeURIComponent('Discover our initiatives')}&route=home`],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
} 