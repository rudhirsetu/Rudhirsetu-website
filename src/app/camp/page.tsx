import type { Metadata } from 'next';
import CampClient from './CampClient';

export const metadata: Metadata = {
  title: 'Our Camps - Healthcare & Blood Donation Initiatives',
  description: 'See our blood donation drives, healthcare camps, and community initiatives across India. Join Rudhirsetu Seva Sanstha in making a difference.',
  keywords: ['health camps', 'blood donation camps', 'healthcare initiatives', 'community camps', 'medical camps', 'NGO camps'],
  openGraph: {
    title: 'Our Camps - Healthcare & Blood Donation Initiatives | Rudhirsetu Seva Sanstha',
    description: 'Discover our blood donation drives, healthcare camps, and community initiatives that are transforming lives across India.',
    url: 'https://www.rudhirsetu.org/camp',
    images: [
      {
        url: 'https://www.rudhirsetu.org/og-thumbnail.png',
        width: 1200,
        height: 628,
        alt: 'Rudhirsetu Seva Sanstha Healthcare Camps',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Camps - Healthcare & Blood Donation Initiatives | Rudhirsetu Seva Sanstha',
    description: 'Discover our camps and initiatives transforming communities across India.',
    images: ['https://www.rudhirsetu.org/og-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/camp',
  },
};

export default function CampPage() {
  return <CampClient />;
} 