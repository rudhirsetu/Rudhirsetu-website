import { Metadata } from "next";
import GalleryClient from './GalleryClient';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

export const metadata: Metadata = {
  title: "Gallery | Rudhirsetu Seva Sanstha",
  description: "Explore our journey through powerful images. Witness the impact of our blood donation camps, healthcare initiatives, and community outreach programs across India.",
  keywords: ["gallery", "photos", "blood donation camps", "healthcare", "community impact", "rudhirsetu", "NGO"],
  openGraph: {
    title: "Gallery | Rudhirsetu Seva Sanstha",
    description: "Witness our community impact through inspiring moments",
    url: `${baseUrl}/gallery`,
    siteName: "Rudhirsetu Seva Sanstha",
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Gallery')}&description=${encodeURIComponent('Witness our community impact through inspiring moments')}&route=gallery`,
        width: 1200,
        height: 630,
        alt: "Rudhirsetu Seva Sanstha - Gallery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Rudhirsetu Seva Sanstha",
    description: "Witness our community impact through inspiring moments",
    images: [`${baseUrl}/api/og?title=${encodeURIComponent('Gallery')}&description=${encodeURIComponent('Witness our community impact through inspiring moments')}&route=gallery`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/gallery`,
  },
  other: {
    'article:section': 'Gallery',
    'article:tag': 'Photo Gallery, Community Service, Blood Donation, Healthcare',
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
} 