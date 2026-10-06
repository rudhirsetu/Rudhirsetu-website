import { Metadata } from "next";
import NotFoundState from '../components/events/NotFoundState';
import { Accent } from '../components/ui/Section';
import { buildMetadata } from '../lib/seo';

export const metadata: Metadata = {
  // 404 pages declare no URL (they are shown at whatever address was missing) and are not indexed.
  ...buildMetadata({
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found. Explore our blood donation drives, healthcare camps and community initiatives instead.',
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <NotFoundState
      eyebrow="Error 404"
      title={
        <>
          This page is <Accent>lost</Accent>
        </>
      }
      message="The page you're looking for has moved or doesn't exist. Don't worry, our mission to save lives carries on. Let's get you back on track."
      primary={{ href: '/', label: 'Back home' }}
      secondary={{ href: '/camp', label: 'See camps' }}
      links={[
        { href: '/gallery', label: 'Photo gallery' },
        { href: '/contact', label: 'Get involved' },
        { href: '/donations', label: 'Support us' },
      ]}
    />
  );
}
