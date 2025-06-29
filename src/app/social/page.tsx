import type { Metadata } from 'next';
import SocialClient from './SocialClient';

export const metadata: Metadata = {
  title: 'Connect With Us - Stay Updated on Our Impact',
  description: 'Follow Rudhirsetu Seva Sanstha across social platforms for real-time updates on blood donation drives, healthcare camps, success stories, and opportunities to get involved in our mission.',
  keywords: [
    'social media', 
    'follow us', 
    'Facebook', 
    'Instagram', 
    'Twitter', 
    'YouTube',
    'LinkedIn',
    'community updates',
    'blood donation news',
    'healthcare updates',
    'NGO social presence'
  ],
  openGraph: {
    title: 'Connect With Us: Stay Updated on Our Impact | Rudhirsetu Seva Sanstha',
    description: 'Join our growing community across social platforms. Get real-time updates on life-saving blood donation drives, healthcare initiatives, inspiring success stories, and ways to contribute.',
    url: 'https://www.rudhirsetu.org/social',
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: '/api/og?title=Connect With Us&description=Stay updated on our community impact&route=social',
        width: 1200,
        height: 628,
        alt: 'Connect with Rudhirsetu Seva Sanstha on Social Media',
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
    title: 'Connect With Us - Stay Updated on Our Impact | Rudhirsetu Seva Sanstha',
    description: 'Join our community for real-time updates on blood donation drives and healthcare initiatives.',
    images: ['/api/og?title=Connect With Us&description=Stay updated on our impact&route=social'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/social',
  },
  other: {
    'article:section': 'Social Media',
    'article:tag': 'Social Media, Community, Updates, Follow Us',
    'og:see_also': [
      'https://www.facebook.com/rudhirsetu',
      'https://www.instagram.com/rudhirsetu',
      'https://twitter.com/rudhirsetu'
    ].join(','),
  },
};

export default function SocialPage() {
  return <SocialClient />;
} 