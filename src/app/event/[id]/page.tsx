import EventDetailsClient from '../../../components/EventDetailsClient';
import { Metadata } from 'next';
import { client } from '../../../lib/sanity';
import { Event } from '../../../types/sanity';
import { notFound } from 'next/navigation';

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