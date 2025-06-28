import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DevelopmentWarning from '../components/DevelopmentWarning';
import '../styles/globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    default: 'Rudhirsetu Seva Sanstha | Blood Donation, Healthcare Support & Social Initiatives',
    template: '%s | Rudhirsetu Seva Sanstha',
  },
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
  authors: [{ name: 'Rudhirsetu Seva Sanstha' }],
  creator: 'Rudhirsetu Seva Sanstha',
  publisher: 'Rudhirsetu Seva Sanstha',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.rudhirsetu.org/',
    siteName: 'Rudhirsetu Seva Sanstha',
    title: 'Rudhirsetu Seva Sanstha: Empowering Communities through Blood Donation, Healthcare, and Social Initiatives',
    description: 'Join Rudhirsetu Seva Sanstha in empowering communities through regular blood donation drives, comprehensive healthcare support, and innovative social initiatives since 2010.',
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.ico', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://www.rudhirsetu.org'),
  alternates: {
    canonical: 'https://www.rudhirsetu.org/',
  },
  other: {
    'theme-color': '#991B1B',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Rudhirsetu',
    'msapplication-TileColor': '#991B1B',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preload" href="/rudhirsetu-bg.webp" as="image" type="image/webp" />
        <link rel="preload" href="/images/logo-dark.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/images/logo-light.svg" as="image" type="image/svg+xml" />
      </head>
      <body className={`${poppins.className} font-sans antialiased`}>
        <DevelopmentWarning />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow mt-16">
            {children}
          </main>
          <Footer />
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
} 