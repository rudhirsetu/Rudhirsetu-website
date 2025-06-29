import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Rudhirsetu Seva Sanstha | Blood Donation, Healthcare Support & Social Initiatives',
  description: 'Rudhirsetu Seva Sanstha drives community empowerment through blood donation, healthcare support, and transformative social initiatives. Join us in making a difference.',
  keywords: [
    'Rudhirsetu',
    'blood donation',
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
  ],
  openGraph: {
    title: 'Rudhirsetu Seva Sanstha: Empowering Communities through Blood Donation, Healthcare, and Social Initiatives',
    description: 'Join Rudhirsetu Seva Sanstha in empowering communities through regular blood donation drives, comprehensive healthcare support, and innovative social initiatives since 2010.',
    url: 'https://www.rudhirsetu.org/',
    images: [
      {
        url: 'https://www.rudhirsetu.org/og-thumbnail.png',
        width: 1200,
        height: 628,
        alt: 'Rudhirsetu Seva Sanstha Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rudhirsetu Seva Sanstha | Blood Donation, Healthcare Support & Social Initiatives',
    description: 'Rudhirsetu Seva Sanstha drives community empowerment through blood donation, healthcare support, and transformative social initiatives.',
    images: ['https://www.rudhirsetu.org/og-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/',
  },
};

export default function HomePage() {
  return <HomeClient />;
} 