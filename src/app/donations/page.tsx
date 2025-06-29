import type { Metadata } from 'next';
import DonationsClient from './DonationsClient';

export const metadata: Metadata = {
  title: 'Support Our Cause - Make a Donation',
  description: 'Support Rudhirsetu Seva Sanstha\'s blood donation drives, healthcare programs, and social initiatives. Your donation helps save lives and empower communities.',
  keywords: ['donation', 'blood donation', 'healthcare support', 'NGO donation', 'charity', 'community support'],
  openGraph: {
    title: 'Support Our Cause - Make a Donation | Rudhirsetu Seva Sanstha',
    description: 'Support our blood donation drives, healthcare programs, and social welfare initiatives. Your contribution makes a real difference in communities across India.',
    url: 'https://www.rudhirsetu.org/donations',
    images: [
      {
        url: 'https://www.rudhirsetu.org/og-thumbnail.png',
        width: 1200,
        height: 628,
        alt: 'Support Rudhirsetu Seva Sanstha - Make a Donation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support Our Cause - Make a Donation | Rudhirsetu Seva Sanstha',
    description: 'Support our blood donation drives, healthcare programs, and social welfare initiatives.',
    images: ['https://www.rudhirsetu.org/og-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/donations',
  },
};

export default function DonationsPage() {
  return <DonationsClient />;
} 