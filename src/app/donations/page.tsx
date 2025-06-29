import { Metadata } from "next";
import DonationsClient from './DonationsClient';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

export const metadata: Metadata = {
  title: "Support Our Mission | Rudhirsetu Seva Sanstha",
  description: "Make a meaningful impact with your donation. Support our blood donation camps, healthcare initiatives, and community outreach programs across India.",
  keywords: ["donations", "support", "contribute", "blood donation", "healthcare", "NGO", "charity", "rudhirsetu"],
  openGraph: {
    title: "Support Our Mission | Rudhirsetu Seva Sanstha",
    description: "Transform lives with your contribution",
    url: `${baseUrl}/donations`,
    siteName: "Rudhirsetu Seva Sanstha",
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Support Our Mission')}&description=${encodeURIComponent('Transform lives with your contribution')}&route=donations`,
        width: 1200,
        height: 630,
        alt: "Rudhirsetu Seva Sanstha - Support Our Mission",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Support Our Mission | Rudhirsetu Seva Sanstha",
    description: "Transform lives with your contribution",
    images: [`${baseUrl}/api/og?title=${encodeURIComponent('Support Our Mission')}&description=${encodeURIComponent('Transform lives with your contribution')}&route=donations`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/donations`,
  },
  other: {
    'article:section': 'Donations',
    'article:tag': 'Donation, Charity, Healthcare Funding, Blood Donation Support',
    'og:see_also': `${baseUrl}/camp`,
  },
};

export default function DonationsPage() {
  return <DonationsClient />;
} 