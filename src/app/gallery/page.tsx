import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Photo Gallery - Our Events & Activities',
  description: 'View photos from Rudhirsetu Seva Sanstha\'s blood donation drives, healthcare camps, and community events across India. See our impact in action.',
  keywords: ['gallery', 'photos', 'blood donation events', 'healthcare camps', 'community events', 'NGO activities'],
  openGraph: {
    title: 'Photo Gallery - Our Events & Activities | Rudhirsetu Seva Sanstha',
    description: 'Browse photos from our blood donation drives, healthcare camps, and community events. Witness our impact in communities across India.',
    url: 'https://www.rudhirsetu.org/gallery',
    images: [
      {
        url: 'https://www.rudhirsetu.org/og-thumbnail.png',
        width: 1200,
        height: 628,
        alt: 'Rudhirsetu Seva Sanstha Photo Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo Gallery - Our Events & Activities | Rudhirsetu Seva Sanstha',
    description: 'Browse photos from our blood donation drives, healthcare camps, and community events.',
    images: ['https://www.rudhirsetu.org/og-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/gallery',
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
} 