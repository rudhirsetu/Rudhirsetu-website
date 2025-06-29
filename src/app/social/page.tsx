import { Metadata } from "next";
import SocialClient from './SocialClient';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

export const metadata: Metadata = {
  title: "Connect With Us | Rudhirsetu Seva Sanstha",
  description: "Stay connected with our life-saving mission. Follow us on social media for updates on blood donation camps, healthcare initiatives, and community impact stories.",
  keywords: ["social media", "follow us", "community", "updates", "blood donation", "healthcare", "rudhirsetu", "NGO"],
  openGraph: {
    title: "Connect With Us | Rudhirsetu Seva Sanstha",
    description: "Stay updated on our community impact",
    url: `${baseUrl}/social`,
    siteName: "Rudhirsetu Seva Sanstha",
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Connect With Us')}&description=${encodeURIComponent('Stay updated on our community impact')}&route=social`,
        width: 1200,
        height: 630,
        alt: "Rudhirsetu Seva Sanstha - Connect With Us",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect With Us | Rudhirsetu Seva Sanstha",
    description: "Stay updated on our community impact",
    images: [`${baseUrl}/api/og?title=${encodeURIComponent('Connect With Us')}&description=${encodeURIComponent('Stay updated on our community impact')}&route=social`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/social`,
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

export default function SocialPage() {
  return <SocialClient />;
} 