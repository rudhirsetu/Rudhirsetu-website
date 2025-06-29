import { Metadata } from "next";
import HomeClient from './HomeClient';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

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
    url: `${baseUrl}/`,
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Rudhirsetu Seva Sanstha')}&description=${encodeURIComponent('Transforming Lives Through Blood Donation & Healthcare')}&route=home`,
        width: 1200,
        height: 630,
        alt: 'Rudhirsetu Seva Sanstha - Transforming Lives',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rudhirsetu',
    creator: '@rudhirsetu',
    title: 'Rudhirsetu Seva Sanstha | Transforming Lives Through Blood Donation & Healthcare',
    description: 'Since 2010, empowering communities across India through life-saving healthcare initiatives and blood donation drives.',
    images: [`${baseUrl}/api/og?title=${encodeURIComponent('Rudhirsetu Seva Sanstha')}&description=${encodeURIComponent('Transforming Lives Through Blood Donation & Healthcare')}&route=home`],
  },
  alternates: {
    canonical: `${baseUrl}/`,
  },
  other: {
    'article:section': 'Homepage',
    'article:tag': 'Blood Donation, Healthcare, NGO, Community Service, Social Impact',
    'article:published_time': '2010-01-01T00:00:00.000Z',
    'og:see_also': [
      `${baseUrl}/camp`,
      `${baseUrl}/gallery`,
      `${baseUrl}/donations`
    ].join(','),
  },
};

export default function HomePage() {
  return <HomeClient />;
} 