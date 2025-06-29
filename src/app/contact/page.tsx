import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Contact Rudhirsetu Seva Sanstha for partnerships, volunteering opportunities, support inquiries, or to learn more about our blood donation and healthcare initiatives.',
  keywords: ['contact', 'get in touch', 'volunteer', 'partnership', 'blood donation inquiry', 'healthcare support'],
  openGraph: {
    title: 'Contact Us - Get in Touch | Rudhirsetu Seva Sanstha',
    description: 'Connect with us for partnerships, volunteering, or support inquiries. Join our mission to empower communities through healthcare initiatives.',
    url: 'https://www.rudhirsetu.org/contact',
    images: [
      {
        url: 'https://www.rudhirsetu.org/og-thumbnail.png',
        width: 1200,
        height: 628,
        alt: 'Contact Rudhirsetu Seva Sanstha',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Get in Touch | Rudhirsetu Seva Sanstha',
    description: 'Connect with us for partnerships, volunteering, or support inquiries.',
    images: ['https://www.rudhirsetu.org/og-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://www.rudhirsetu.org/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
} 