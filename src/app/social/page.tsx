import type { Metadata } from 'next';
import SocialClient from './SocialClient';

export const metadata: Metadata = {
  title: 'Connect With Us - Social Media',
  description: 'Follow Rudhirsetu Seva Sanstha on social media for latest updates, events, and community initiatives. Stay connected with our mission.',
  keywords: ['social media', 'follow us', 'Facebook', 'Instagram', 'Twitter', 'YouTube', 'updates', 'community'],
  openGraph: {
    title: 'Connect With Us - Social Media | Rudhirsetu Seva Sanstha',
    description: 'Follow us on social media for latest updates on blood donation drives, healthcare programs, and community events.',
    url: 'https://www.rudhirsetu.org/social',
    images: [
      {
        url: 'https://www.rudhirsetu.org/og-thumbnail.png',
        width: 1200,
        height: 628,
        alt: 'Connect with Rudhirsetu Seva Sanstha on Social Media',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connect With Us - Social Media | Rudhirsetu Seva Sanstha',
    description: 'Follow us on social media for latest updates on our community initiatives.',
    images: ['https://www.rudhirsetu.org/og-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/social',
  },
};

export default function SocialPage() {
  return <SocialClient />;
} 