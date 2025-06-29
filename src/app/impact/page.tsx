import type { Metadata } from 'next';
import ImpactClient from './ImpactClient';

export const metadata: Metadata = {
  title: 'Our Impact - Transforming Communities',
  description: 'See the transformative impact of Rudhirsetu Seva Sanstha\'s blood donation drives, healthcare programs, and community initiatives across India.',
  keywords: ['impact', 'community impact', 'blood donation impact', 'healthcare results', 'social change', 'NGO achievements'],
  openGraph: {
    title: 'Our Impact - Transforming Communities | Rudhirsetu Seva Sanstha',
    description: 'Discover how our blood donation drives, healthcare programs, and social initiatives have transformed communities across India.',
    url: 'https://www.rudhirsetu.org/impact',
    images: [
      {
        url: 'https://www.rudhirsetu.org/og-thumbnail.png',
        width: 1200,
        height: 628,
        alt: 'Rudhirsetu Seva Sanstha Community Impact',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Impact - Transforming Communities | Rudhirsetu Seva Sanstha',
    description: 'Discover how our programs have transformed communities across India.',
    images: ['https://www.rudhirsetu.org/og-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/impact',
  },
};

export default function ImpactPage() {
  return <ImpactClient />;
} 