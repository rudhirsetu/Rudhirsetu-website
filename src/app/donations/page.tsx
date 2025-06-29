import type { Metadata } from 'next';
import DonationsClient from './DonationsClient';

export const metadata: Metadata = {
  title: 'Support Our Mission - Make a Life-Saving Donation',
  description: 'Your contribution powers life-saving blood donation drives, essential healthcare programs, and transformative community initiatives. Join thousands who trust us to make a real difference.',
  keywords: [
    'donation', 
    'support cause', 
    'blood donation funding', 
    'healthcare support', 
    'NGO contribution', 
    'charity donation',
    'community support',
    'life-saving donation',
    'social impact funding',
    'medical aid support'
  ],
  openGraph: {
    title: 'Support Our Mission: Make a Life-Saving Donation | Rudhirsetu Seva Sanstha',
    description: 'Transform lives with your contribution. Fund blood donation drives, healthcare programs, and community initiatives that have saved thousands of lives across India.',
    url: 'https://www.rudhirsetu.org/donations',
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: '/api/og?title=Support Our Mission&description=Transform lives with your contribution&route=donations',
        width: 1200,
        height: 628,
        alt: 'Support Rudhirsetu Seva Sanstha - Make a Life-Saving Donation',
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
    title: 'Support Our Mission - Make a Life-Saving Donation | Rudhirsetu Seva Sanstha',
    description: 'Transform lives with your contribution. Fund life-saving healthcare programs and community initiatives.',
    images: ['/api/og?title=Support Our Mission&description=Transform lives with your contribution&route=donations'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/donations',
  },
  other: {
    'article:section': 'Donations',
    'article:tag': 'Donation, Charity, Healthcare Funding, Blood Donation Support',
    'og:see_also': 'https://www.rudhirsetu.org/camp',
  },
};

export default function DonationsPage() {
  return <DonationsClient />;
} 