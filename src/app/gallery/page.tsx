import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Photo Gallery - Our Impact in Pictures',
  description: 'Witness the power of community service through our visual journey. Browse inspiring photos from blood donation drives, healthcare camps, and life-changing events across India.',
  keywords: [
    'photo gallery', 
    'blood donation events', 
    'healthcare camps', 
    'community impact', 
    'NGO activities', 
    'social service photos',
    'volunteer moments',
    'life-saving events',
    'community empowerment'
  ],
  openGraph: {
    title: 'Gallery: Our Impact in Pictures | Rudhirsetu Seva Sanstha',
    description: 'Discover the faces behind the mission. Browse inspiring photos showcasing our blood donation drives, healthcare initiatives, and community transformation moments.',
    url: 'https://www.rudhirsetu.org/gallery',
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: '/api/og?title=Gallery&description=Witness our community impact through inspiring moments&route=gallery',
        width: 1200,
        height: 628,
        alt: 'Rudhirsetu Seva Sanstha Photo Gallery - Community Impact Stories',
        type: 'image/png',
      },
      {
        url: 'https://www.rudhirsetu.org/og-thumbnail.png',
        width: 1200,
        height: 628,
        alt: 'Rudhirsetu Seva Sanstha Fallback Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rudhirsetu',
    creator: '@rudhirsetu',
    title: 'Gallery: Our Impact in Pictures | Rudhirsetu Seva Sanstha',
    description: 'Discover inspiring moments from our blood donation drives, healthcare camps, and community transformation events.',
    images: ['/api/og?title=Gallery&description=Witness our community impact&route=gallery'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/gallery',
  },
  other: {
    'article:section': 'Gallery',
    'article:tag': 'Photo Gallery, Community Service, Blood Donation, Healthcare',
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
} 