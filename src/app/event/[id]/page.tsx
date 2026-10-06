import EventDetailsClient from '../../../components/EventDetailsClient';
import { Metadata } from 'next';
import { client, urlFor } from '../../../lib/sanity';
import { Event } from '../../../types/sanity';
import { buildMetadata, truncateText } from '../../../lib/seo';
import { notFound } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

// Same model as the other pages: cached for 5 minutes, refreshed sooner by the Sanity webhook
// (`event-<id>` and `event` tags), so an edit still appears if a webhook delivery is missed.
export const revalidate = 300;

interface EventPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for known events (helps with Vercel deployment)
export async function generateStaticParams() {
  try {
    console.log('Generating static params for events...');
    
    // Use a more reliable client configuration for build time
    const events = await client.fetch(
      `*[_type == "event"]{
        _id
      }`,
      {},
      {
        cache: 'no-store', // Don't cache during build
        next: { revalidate: 0 }
      }
    );

    console.log(`Found ${events?.length || 0} events for static generation`);
    
    if (!events || events.length === 0) {
      console.warn('No events found during static generation');
      return [];
    }

    const params = events.map((event: { _id: string }) => ({
      id: event._id,
    }));
    
    console.log('Generated params:', params);
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array to prevent build failure, but routes will be handled dynamically
    return [];
  }
}

// Generate metadata for each event
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // Fetch event data with proper revalidation
    const event: Event = await client.fetch(
      `*[_type == "event" && _id == $id][0]{
        _id,
        title,
        date,
        location,
        expectedParticipants,
        isUpcoming,
        desc,
        image,
        shortDesc,
        gallery
      }`,
      { id },
      {
        next: { revalidate: 300, tags: ['event', `event-${id}`] }
      }
    );

    if (!event) {
      return {
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
      };
    }

    // Format date
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // The page title is the event title; the root layout template appends the site name.
    // Link previews also get the date and place, which the share image shows too.
    // The share image itself comes from ./opengraph-image.tsx.
    const summary = event.shortDesc || event.desc || `Join us for ${event.title}`;
    const description = truncateText(
      `${eventDate}${event.location ? ` · ${event.location}` : ''}. ${summary}`,
      200,
    );

    return buildMetadata({
      title: event.title,
      description,
      path: `/event/${id}`,
      type: 'article',
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Event Details',
      description: 'View event details and information.',
    };
  }
}

export default async function EventDetailsPage({ params }: EventPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let event: Event | null = null;
  try {
    // Fetch event data on the server with proper revalidation
    event = await client.fetch(
      `*[_type == "event" && _id == $id][0]{
        _id,
        _type,
        title,
        date,
        location,
        expectedParticipants,
        isUpcoming,
        desc,
        image,
        shortDesc,
        gallery,
        _createdAt,
        _updatedAt
      }`,
      { id },
      {
        next: { revalidate: 300, tags: ['event', `event-${id}`] }
      }
    );
  } catch (error) {
    console.error('Error fetching event:', error);
  }

  // Called outside the try block: notFound() works by throwing, and must not be caught above.
  if (!event) {
    notFound();
  }

  // schema.org Event markup for rich results. "<" is escaped so CMS text can't close the script tag.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    description: event.shortDesc || event.desc,
    url: `${baseUrl}/event/${id}`,
    ...(event.location && {
      location: { '@type': 'Place', name: event.location, address: event.location },
    }),
    ...(event.image?.asset && {
      image: [urlFor(event.image).width(1200).height(675).auto('format').url()],
    }),
    organizer: {
      '@type': 'Organization',
      name: 'Rudhirsetu Seva Sanstha',
      url: baseUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <EventDetailsClient eventId={id} eventData={event} />
    </>
  );
}
