import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Pacifico } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DevelopmentWarning from '../components/DevelopmentWarning';
import SmoothScrollProvider from '../components/SmoothScrollProvider';
import { PageTransitionProvider } from '../context/PageTransitionContext';
import { OG_LOCALE, SITE_NAME, SITE_URL } from '../lib/seo';
import { siteStructuredData } from '../lib/site-structured-data';
import '../styles/globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jakarta',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-bricolage',
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-pacifico',
});

// Serialised once at module load instead of on every render.
const siteJsonLd = JSON.stringify(siteStructuredData);

// Browser UI colour (Android Chrome toolbar, Safari iOS tab bar) and viewport.
// Zoom is deliberately not restricted. `viewport-fit=cover` is intentionally
// omitted: nothing in the layout uses env(safe-area-inset-*), so it would let
// content slide under the notch in landscape on iPhones.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#450a0a',
};

export const metadata: Metadata = {
  title: {
    default: 'Rudhirsetu Seva Sanstha | Transforming Lives Through Blood Donation & Healthcare',
    template: '%s | Rudhirsetu Seva Sanstha',
  },
  description: 'Since 2010, Rudhirsetu Seva Sanstha has been empowering communities across India through life-saving blood donation drives, healthcare support and social initiatives.',
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
    'blood bank support',
    'rural healthcare',
    'medical camps'
  ],
  authors: [{ name: 'Rudhirsetu Seva Sanstha', url: 'https://www.rudhirsetu.org' }],
  creator: 'Rudhirsetu Seva Sanstha',
  publisher: 'Rudhirsetu Seva Sanstha',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
  // Fallback for pages that don't set their own. The share image comes from app/opengraph-image.tsx
  // (each page folder has its own too); Next resolves its URL against `metadataBase` below.
  openGraph: {
    type: 'website',
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: 'Rudhirsetu Seva Sanstha | Transforming Lives Through Blood Donation & Healthcare',
    description: 'Since 2010, Rudhirsetu Seva Sanstha has been empowering communities across India through life-saving blood donation drives, healthcare support and social initiatives.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rudhirsetu Seva Sanstha | Transforming Lives Through Blood Donation & Healthcare',
    description: 'Since 2010, Rudhirsetu Seva Sanstha has been empowering communities across India through life-saving blood donation drives, healthcare support and social initiatives.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icons/favicon-32x32.png',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL(SITE_URL),
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Rudhirsetu',
    'msapplication-TileColor': '#450a0a',
    'msapplication-config': '/browserconfig.xml',
    // Geographic Information
    'geo.region': 'IN',
    'geo.placename': 'India',
    'ICBM': '20.5937, 78.9629',
    // Organization Information
    'organization': 'Rudhirsetu Seva Sanstha',
    'classification': 'Non-Profit Organization',
    'category': 'Healthcare, Social Service, Blood Donation',
    'contact': 'hello@rudhirsetu.org',
  },
};

// Runs in <head> before first paint. On the first landing on "/" in a session it adds
// `intro` to <html>, which shows the CSS curtain and delays the hero entrance (globals.css),
// and drives the curtain's 0-100 counter and progress bar (before hydration, in every browser).
const INTRO_SCRIPT = `(function(){var d=document.documentElement;try{if(location.pathname==='/'&&!sessionStorage.getItem('hasVisitedHome')){sessionStorage.setItem('hasVisitedHome','1');d.classList.add('intro');var t0=performance.now();var tick=function(n){var e=document.querySelector('.intro-count'),b=document.querySelector('.intro-bar'),p=Math.min((n-t0)/900,1),v=1-Math.pow(1-p,3);if(e)e.textContent=String(Math.round(v*100));if(b)b.style.transform='scaleX('+v+')';if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);setTimeout(function(){d.classList.remove('intro')},2400)}}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the intro script below may add a class to <html> before React hydrates.
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${bricolage.variable} ${pacifico.variable}`}>
      <head>
        {/* Decides the home intro before first paint (no flash, no JS wait). See globals.css "Home intro". */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        {/*
          Fonts are self-hosted by next/font, so no preconnect to Google Fonts is needed.
          Sanity images are plain <img> tags on cdn.sanity.io: warm that connection up
          (no crossorigin attribute, so it matches non-CORS image requests).
          Favicons and the manifest come from the `metadata` export above.
        */}
        <link rel="preconnect" href="https://cdn.sanity.io" />

        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Structured data for Google Search results & sitelinks (see lib/site-structured-data.ts) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: siteJsonLd }}
        />
      </head>
      <body className={`${jakarta.className} font-sans antialiased`}>
        <SmoothScrollProvider>
          <PageTransitionProvider>
            {/* Staging-only banner; NEXT_PUBLIC_ vars are inlined at build time, so this is dropped entirely when off. */}
            {process.env.NEXT_PUBLIC_SHOW_DEV_WARNING === 'true' && <DevelopmentWarning />}
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main id="main-content" tabIndex={-1} className="p-0 outline-none">
                {children}
              </main>
            </div>
            <Footer />
            <SpeedInsights />
            <Analytics />
          </PageTransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
} 