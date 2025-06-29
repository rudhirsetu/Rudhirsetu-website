import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - 404',
  description: 'The page you are looking for could not be found. Explore our blood donation drives, healthcare camps, and community initiatives instead.',
  openGraph: {
    title: 'Page Not Found | Rudhirsetu Seva Sanstha',
    description: 'This page could not be found. Discover our life-saving blood donation and healthcare initiatives instead.',
    url: 'https://www.rudhirsetu.org/404',
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: '/api/og?title=Page Not Found&description=Discover our life-saving initiatives instead&route=home',
        width: 1200,
        height: 628,
        alt: 'Rudhirsetu Seva Sanstha - Page Not Found',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rudhirsetu',
    title: 'Page Not Found | Rudhirsetu Seva Sanstha',
    description: 'This page could not be found. Discover our life-saving healthcare initiatives instead.',
    images: ['/api/og?title=Page Not Found&description=Discover our initiatives&route=home'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
} 