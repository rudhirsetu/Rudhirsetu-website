'use client';

import EventDetails from '../pages/EventDetails';

interface EventDetailsClientProps {
  eventId: string;
}

export default function EventDetailsClient({ eventId }: EventDetailsClientProps) {
  return <EventDetails eventId={eventId} />;
} 