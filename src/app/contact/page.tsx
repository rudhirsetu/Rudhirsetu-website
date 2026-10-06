import { Metadata } from "next";
import ContactClient from './ContactClient';
import { client } from '../../lib/sanity';
import { QUERIES } from '../../lib/queries';
import { buildMetadata } from '../../lib/seo';
import { ContactPageData } from '../../lib/structured-data';
import type { ContactSettings } from '../../types/sanity';

export const metadata: Metadata = {
  // The root layout title template appends " | Rudhirsetu Seva Sanstha". The share image comes from ./opengraph-image.tsx.
  ...buildMetadata({
    title: "Get in Touch",
    description: 'Get in touch with Rudhirsetu Seva Sanstha to volunteer, donate, partner with us or learn more about our blood donation and healthcare work.',
    path: '/contact',
  }),
  keywords: ["contact", "rudhirsetu", "blood donation", "volunteer", "healthcare", "NGO", "community service"],
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'article:section': 'Contact',
    'article:tag': 'Contact, Volunteer, Partnership, Community Engagement',
    'contact:email': 'rudhirsetu@rudhirsetu.org',
    'contact:phone_number': '+91-9321606868',
  },
};

async function getContactSettings(): Promise<ContactSettings | null> {
  try {
    return await client.fetch<ContactSettings | null>(
      QUERIES.contactSettings,
      {},
      { next: { revalidate: 300, tags: ['contactSettings'] } }
    );
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return null;
  }
}

export default async function ContactPage() {
  const settings = await getContactSettings();

  return (
    <>
      <script
        id="contact-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ContactPageData).replace(/</g, '\\u003c') }}
      />
      <ContactClient settings={settings} />
    </>
  );
}
