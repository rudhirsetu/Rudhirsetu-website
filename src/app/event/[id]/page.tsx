import EventDetailsClient from '../../../components/EventDetailsClient';
import { Metadata } from 'next';
import { client } from '../../../lib/sanity';
import { Event } from '../../../types/sanity';
import { notFound } from 'next/navigation';

// Force dynamic rendering for all event pages
export const dynamic = 'force-dynamic';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for known events (helps with Vercel deployment)
export async function generateStaticParams() {
  try {
    const events = await client.fetch(
      `*[_type == "event"]{
        _id
      }`
    );

    return events.map((event: { _id: string }) => ({
      id: event._id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for each event
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // Fetch event data
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
      { id }
    );

    if (!event) {
      return {
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
      };
    }

    // Format date
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Generate Open Graph image URL
    const ogImageUrl = `/api/og/event/${id}`;
    
    const title = `${event.title} - ${eventDate}`;
    const description = event.shortDesc || event.desc || `Join us for ${event.title} at ${event.location}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `https://www.rudhirsetu.org/event/${id}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 628,
            alt: event.title,
          },
        ],
        siteName: 'Rudhirsetu Seva Sanstha',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: `https://www.rudhirsetu.org/event/${id}`,
      },
    };
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
  
  try {
    // Fetch event data on the server
    const event: Event = await client.fetch(
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
      { id }
    );

    if (!event) {
      notFound();
    }

    return <EventDetailsClient eventId={id} eventData={event} />;
  } catch (error) {
    console.error('Error fetching event:', error);
    notFound();
  }
} 