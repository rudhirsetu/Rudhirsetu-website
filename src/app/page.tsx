import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Rudhirsetu Seva Sanstha | Transforming Lives Through Blood Donation & Healthcare',
  description: 'Since 2010, Rudhirsetu Seva Sanstha has been empowering communities across India through life-saving blood donation drives, comprehensive healthcare support, and innovative social initiatives. Join thousands who trust us to make a real difference.',
  keywords: [
    'Rudhirsetu Seva Sanstha',
    'blood donation India',
    'healthcare support',
    'social initiatives',
    'community empowerment',
    'cancer awareness',
    'blood drives',
    'health camps',
    'NGO India',
    'nonprofit organization',
    'medical aid',
    'thalassemia support',
    'community health',
    'social service',
    'life saving',
    'healthcare NGO',
    'blood bank support'
  ],
  openGraph: {
    title: 'Rudhirsetu Seva Sanstha: Transforming Lives Through Blood Donation & Healthcare',
    description: 'Discover how we\'ve been empowering communities across India since 2010. From life-saving blood donation drives to comprehensive healthcare support - join thousands who trust us to make a real difference.',
    url: 'https://www.rudhirsetu.org/',
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.rudhirsetu.org/og-thumbnail.png',
        width: 1200,
        height: 628,
        alt: 'Rudhirsetu Seva Sanstha Fallback Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rudhirsetu',
    creator: '@rudhirsetu',
    title: 'Rudhirsetu Seva Sanstha | Transforming Lives Through Blood Donation & Healthcare',
    description: 'Since 2010, empowering communities across India through life-saving healthcare initiatives and blood donation drives.',
    images: ['/api/og?title=Rudhirsetu Seva Sanstha&description=Transforming lives through healthcare&route=home'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/',
  },
  other: {
    'article:section': 'Homepage',
    'article:tag': 'Blood Donation, Healthcare, NGO, Community Service, Social Impact',
    'article:published_time': '2010-01-01T00:00:00.000Z',
    'og:see_also': [
      'https://www.rudhirsetu.org/camp',
      'https://www.rudhirsetu.org/gallery',
      'https://www.rudhirsetu.org/donations'
    ].join(','),
  },
};

export default function HomePage() {
  return <HomeClient />;
} 