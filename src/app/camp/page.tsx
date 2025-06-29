import type { Metadata } from 'next';
import CampClient from './CampClient';

export const metadata: Metadata = {
  title: 'Our Camps - Life-Saving Healthcare & Blood Donation Initiatives',
  description: 'Explore our comprehensive healthcare camps and blood donation drives that have transformed communities across India. From rural health screenings to urban blood drives, we bring healthcare to those who need it most.',
  keywords: [
    'health camps', 
    'blood donation camps', 
    'healthcare initiatives', 
    'medical camps', 
    'community healthcare',
    'rural health programs',
    'health screenings',
    'medical outreach',
    'preventive healthcare',
    'community wellness'
  ],
  openGraph: {
    title: 'Our Camps: Life-Saving Healthcare Initiatives | Rudhirsetu Seva Sanstha',
    description: 'Discover our life-saving healthcare camps and blood donation drives. From rural communities to urban centers, we bring essential medical care and blood collection services where they are needed most.',
    url: 'https://www.rudhirsetu.org/camp',
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: '/api/og?title=Our Camps&description=Life-saving healthcare initiatives across India&route=camp',
        width: 1200,
        height: 628,
        alt: 'Rudhirsetu Seva Sanstha Healthcare Camps and Blood Donation Drives',
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
    title: 'Our Camps - Life-Saving Healthcare Initiatives | Rudhirsetu Seva Sanstha',
    description: 'Discover our healthcare camps and blood donation drives transforming communities across India.',
    images: ['/api/og?title=Our Camps&description=Life-saving healthcare initiatives&route=camp'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/camp',
  },
  other: {
    'article:section': 'Healthcare Camps',
    'article:tag': 'Health Camps, Medical Camps, Blood Donation, Healthcare Initiatives',
    'og:see_also': 'https://www.rudhirsetu.org/gallery',
  },
};

export default function CampPage() {
  return <CampClient />;
} 