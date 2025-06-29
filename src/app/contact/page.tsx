import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Get in Touch - Join Our Life-Saving Mission',
  description: 'Connect with Rudhirsetu Seva Sanstha for partnerships, volunteering opportunities, event collaborations, or support inquiries. Together, we can create a healthier, more caring community.',
  keywords: [
    'contact us', 
    'get in touch', 
    'volunteer opportunities', 
    'partnership inquiries', 
    'blood donation inquiry',
    'healthcare support',
    'NGO collaboration',
    'community partnership',
    'join our mission',
    'support inquiries'
  ],
  openGraph: {
    title: 'Get in Touch: Join Our Life-Saving Mission | Rudhirsetu Seva Sanstha',
    description: 'Ready to make a difference? Connect with us for volunteer opportunities, partnerships, or to learn how you can contribute to our life-saving healthcare and blood donation initiatives.',
    url: 'https://www.rudhirsetu.org/contact',
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: '/api/og?title=Get in Touch&description=Join our life-saving mission&route=contact',
        width: 1200,
        height: 628,
        alt: 'Contact Rudhirsetu Seva Sanstha - Join Our Mission',
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
    title: 'Get in Touch - Join Our Life-Saving Mission | Rudhirsetu Seva Sanstha',
    description: 'Connect with us for volunteer opportunities, partnerships, or to join our healthcare initiatives.',
    images: ['/api/og?title=Get in Touch&description=Join our life-saving mission&route=contact'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/contact',
  },
  other: {
    'article:section': 'Contact',
    'article:tag': 'Contact, Volunteer, Partnership, Community Engagement',
    'contact:email': 'hello@rudhirsetu.org',
    'contact:phone_number': '+91-XXXXXXXXXX',
  },
};

export default function ContactPage() {
  return <ContactClient />;
} 