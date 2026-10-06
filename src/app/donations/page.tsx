import { Metadata } from "next";
import DonationsClient from './DonationsClient';
import { client, urlFor } from '../../lib/sanity';
import { QUERIES } from '../../lib/queries';
import { buildMetadata } from '../../lib/seo';
import { DonationsPageData } from '../../lib/structured-data';
import type { DonationSettings } from '../../types/sanity';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

export const metadata: Metadata = {
  // The root layout title template appends " | Rudhirsetu Seva Sanstha". The share image comes from ./opengraph-image.tsx.
  ...buildMetadata({
    title: "Support Our Mission",
    description: 'Support our blood donation camps, healthcare initiatives and community outreach programs across India with your contribution.',
    path: '/donations',
  }),
  keywords: ["donations", "support", "contribute", "blood donation", "healthcare", "NGO", "charity", "rudhirsetu"],
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'article:section': 'Donations',
    'article:tag': 'Donation, Charity, Healthcare Funding, Blood Donation Support',
    'og:see_also': `${baseUrl}/camp`,
  },
};

async function getDonationSettings(): Promise<DonationSettings | null> {
  try {
    return await client.fetch<DonationSettings | null>(
      QUERIES.donationSettings,
      {},
      { next: { revalidate: 300, tags: ['donationSettings'] } }
    );
  } catch (error) {
    console.error('Error fetching donation settings:', error);
    return null;
  }
}

export default async function DonationsPage() {
  const settings = await getDonationSettings();

  // Size the QR for its on-screen frame (max ~288px wide, so 576px covers 2x screens).
  const qrCodeUrl = settings?.qrCodeImage?.asset
    ? urlFor(settings.qrCodeImage).width(576).quality(90).auto('format').url()
    : null;

  return (
    <>
      <script
        id="donations-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(DonationsPageData).replace(/</g, '\\u003c') }}
      />
      <DonationsClient settings={settings} qrCodeUrl={qrCodeUrl} />
    </>
  );
}
