import type { Metadata } from 'next';
import { Poppins, Pacifico} from 'next/font/google';
// import localFont from 'next/font/local';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DevelopmentWarning from '../components/DevelopmentWarning';
import { PageTransitionProvider } from '../context/PageTransitionContext';
import '../styles/globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-pacifico',
});


// const league_script = localFont({
//   src: '../../public/font/PPPlayground-Medium.otf',
//   display: 'swap',
//   variable: '--font-league-script',
// });

export const metadata: Metadata = {
  title: {
    default: 'Rudhirsetu Seva Sanstha | Transforming Lives Through Blood Donation & Healthcare',
    template: '%s | Rudhirsetu Seva Sanstha',
  },
  description: 'Since 2010, Rudhirsetu Seva Sanstha has been empowering communities across India through life-saving blood donation drives, comprehensive healthcare support, and transformative social initiatives. Join thousands who trust us to make a real difference.',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.rudhirsetu.org/',
    siteName: 'Rudhirsetu Seva Sanstha',
    title: 'Rudhirsetu Seva Sanstha: Transforming Lives Through Blood Donation & Healthcare',
    description: 'Discover how we\'ve been empowering communities across India since 2010. From life-saving blood donation drives to comprehensive healthcare support - join thousands who trust us to make a real difference.',
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
    images: ['/api/og?title=Rudhirsetu Seva Sanstha&description=Empowering communities through healthcare&route=home'],
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
  metadataBase: new URL('https://www.rudhirsetu.org'),
  other: {
    'theme-color': '#991B1B',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Rudhirsetu',
    'msapplication-TileColor': '#991B1B',
    'msapplication-config': '/browserconfig.xml',
    // Enhanced SEO Meta Tags
    'language': 'English',
    'revisit-after': '1 days',
    'distribution': 'global',
    'rating': 'general',
    'coverage': 'India',
    'target': 'all',
    'HandheldFriendly': 'True',
    'MobileOptimized': '320',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`
      ${poppins.variable} 
      ${pacifico.variable} 
    `}
    >
      {/* ${league_script.variable} ADD THIS BS LATER*/}

      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Explicit favicon links for better browser compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
        <link rel="shortcut icon" href="/icons/favicon-32x32.png" />
        
        {/* Preload critical images */}
        <link rel="preload" href="/images/logo-dark.svg" as="image" type="image/svg+xml" fetchPriority="high" />
        <link rel="preload" href="/images/logo-light.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/rudhirsetu-bg.webp" as="image" type="image/webp" />
        
        {/* Comprehensive Structured Data for Google Search Results & Sitelinks */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "NGO",
                  "@id": "https://www.rudhirsetu.org/#organization",
                  "name": "Rudhirsetu Seva Sanstha",
                  "alternateName": ["Rudhirsetu", "Rudhir Setu", "Rudhirsetu NGO"],
                  "url": "https://www.rudhirsetu.org/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.rudhirsetu.org/images/logo-dark.svg",
                    "width": 300,
                    "height": 300,
                    "caption": "Rudhirsetu Seva Sanstha Logo"
                  },
                  "image": [
                    {
                      "@type": "ImageObject",
                      "url": "https://www.rudhirsetu.org/images/logo-dark.svg",
                      "width": 300,
                      "height": 300,
                      "caption": "Rudhirsetu Seva Sanstha Logo"
                    },
                    {
                      "@type": "ImageObject",
                      "url": "https://www.rudhirsetu.org/icons/favicon.ico",
                      "width": 48,
                      "height": 48,
                      "caption": "Rudhirsetu Favicon"
                    }
                  ],
                  "description": "Rudhirsetu Seva Sanstha is a leading NGO empowering communities through blood donation drives, comprehensive healthcare support, cancer awareness programs, and transformative social initiatives since 2010.",
                  "foundingDate": "2010",
                  "areaServed": {
                    "@type": "Country",
                    "name": "India"
                  },
                  "knowsAbout": [
                    "Blood Donation",
                    "Healthcare Support",
                    "Social Initiatives",
                    "Community Empowerment",
                    "Cancer Awareness",
                    "Health Camps",
                    "Medical Aid",
                    "Social Welfare"
                  ],
                  "keywords": "blood donation, healthcare, NGO, social service, community health, cancer awareness, medical support",
                  "slogan": "Empowering Communities Through Service",
                  "mission": "To drive community empowerment through blood donation, healthcare support, and transformative social initiatives",
                  "sameAs": [
                    "https://www.facebook.com/rudhirsetu",
                    "https://www.instagram.com/rudhirsetu",
                    "https://twitter.com/rudhirsetu",
                    "https://www.youtube.com/rudhirsetu",
                    "https://www.linkedin.com/company/rudhirsetu"
                  ],
                  "contactPoint": [
                    {
                      "@type": "ContactPoint",
                      "contactType": "customer service",
                      "url": "https://www.rudhirsetu.org/contact",
                      "availableLanguage": ["English", "Hindi"]
                    },
                    {
                      "@type": "ContactPoint",
                      "contactType": "donations",
                      "url": "https://www.rudhirsetu.org/donations",
                      "availableLanguage": ["English", "Hindi"]
                    }
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "IN",
                    "addressRegion": "India"
                  },
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Community Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Blood Donation Drives",
                          "description": "Regular blood donation camps and drives"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Healthcare Support",
                          "description": "Medical aid and healthcare assistance programs"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Cancer Awareness",
                          "description": "Cancer awareness and support programs"
                        }
                      }
                    ]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.rudhirsetu.org/#website",
                  "url": "https://www.rudhirsetu.org/",
                  "name": "Rudhirsetu Seva Sanstha - Official Website",
                  "alternateName": "Rudhirsetu Website",
                  "description": "Official website of Rudhirsetu Seva Sanstha - Leading NGO for Blood Donation, Healthcare Support & Social Initiatives in India",
                  "publisher": {
                    "@id": "https://www.rudhirsetu.org/#organization"
                  },
                  "potentialAction": [
                    {
                      "@type": "DonateAction",
                      "target": "https://www.rudhirsetu.org/donations",
                      "name": "Make a Donation"
                    }
                  ],
                  "mainEntity": {
                    "@id": "https://www.rudhirsetu.org/#organization"
                  }
                },
                {
                  "@type": "WebPage",
                  "@id": "https://www.rudhirsetu.org/#webpage",
                  "url": "https://www.rudhirsetu.org/",
                  "name": "Rudhirsetu Seva Sanstha | Blood Donation, Healthcare Support & Social Initiatives",
                  "isPartOf": {
                    "@id": "https://www.rudhirsetu.org/#website"
                  },
                  "about": {
                    "@id": "https://www.rudhirsetu.org/#organization"
                  },
                  "datePublished": "2010-01-01",
                  "dateModified": "2025-06-29",
                  "description": "Join Rudhirsetu Seva Sanstha in empowering communities through regular blood donation drives, comprehensive healthcare support, and innovative social initiatives.",
                  "inLanguage": "en-US",
                  "potentialAction": [
                    {
                      "@type": "ReadAction",
                      "target": "https://www.rudhirsetu.org/"
                    }
                  ]
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://www.rudhirsetu.org/#breadcrumb",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://www.rudhirsetu.org/",
                      "description": "Homepage - Learn about our mission and services"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Camps",
                      "item": "https://www.rudhirsetu.org/camp",
                      "description": "See our healthcare camps and blood donation drives"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": "Gallery",
                      "item": "https://www.rudhirsetu.org/gallery",
                      "description": "Photo gallery of our events and activities"
                    },
                    {
                      "@type": "ListItem",
                      "position": 4,
                      "name": "Donations",
                      "item": "https://www.rudhirsetu.org/donations",
                      "description": "Support our cause with donations"
                    },
                    {
                      "@type": "ListItem",
                      "position": 5,
                      "name": "Social",
                      "item": "https://www.rudhirsetu.org/social",
                      "description": "Connect with us on social media"
                    },
                    {
                      "@type": "ListItem",
                      "position": 6,
                      "name": "Contact",
                      "item": "https://www.rudhirsetu.org/contact",
                      "description": "Get in touch with our team"
                    }
                  ]
                },
                {
                  "@type": "ItemList",
                  "@id": "https://www.rudhirsetu.org/#services",
                  "name": "Our Services",
                  "description": "Core services offered by Rudhirsetu Seva Sanstha",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Blood Donation Drives",
                      "url": "https://www.rudhirsetu.org/camp"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Healthcare Support",
                      "url": "https://www.rudhirsetu.org/camp"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": "Cancer Awareness Programs",
                      "url": "https://www.rudhirsetu.org/camp"
                    },
                    {
                      "@type": "ListItem",
                      "position": 4,
                      "name": "Community Health Camps",
                      "url": "https://www.rudhirsetu.org/camp"
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${poppins.className} font-sans antialiased`}>
        <PageTransitionProvider>
          <DevelopmentWarning />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="p-0">
              {children}
            </main>
          </div>
          <Footer />
          <SpeedInsights />
          <Analytics />
        </PageTransitionProvider>
      </body>
    </html>
  );
} 