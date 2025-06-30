import { Metadata } from "next";
import ContactClient from './ContactClient';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

export const metadata: Metadata = {
  title: "Get in Touch | Rudhirsetu Seva Sanstha",
  description: "Connect with Rudhirsetu Seva Sanstha. Join our life-saving mission of blood donation and healthcare services. Get in touch to volunteer, donate, or learn more about our community impact.",
  keywords: ["contact", "rudhirsetu", "blood donation", "volunteer", "healthcare", "NGO", "community service"],
  openGraph: {
    title: "Get in Touch | Rudhirsetu Seva Sanstha",
    description: "Join our life-saving mission of blood donation and healthcare services",
    url: `${baseUrl}/contact`,
    siteName: "Rudhirsetu Seva Sanstha",
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Get in Touch')}&description=${encodeURIComponent('Join our life-saving mission')}&route=contact`,
        width: 1200,
        height: 630,
        alt: "Rudhirsetu Seva Sanstha - Get in Touch",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get in Touch | Rudhirsetu Seva Sanstha",
    description: "Join our life-saving mission of blood donation and healthcare services",
    images: [`${baseUrl}/api/og?title=${encodeURIComponent('Get in Touch')}&description=${encodeURIComponent('Join our life-saving mission')}&route=contact`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  other: {
    'article:section': 'Contact',
    'article:tag': 'Contact, Volunteer, Partnership, Community Engagement',
    'contact:email': 'rudhirsetu@rudhirsetu.org',
    'contact:phone_number': '+91-9321606868',
  },
};

export default function ContactPage() {
  return <ContactClient />;
} 