'use client';

import EventDetails from '../pages/EventDetails';
import { Event } from '../types/sanity';

interface EventDetailsClientProps {
  eventId: string;
  eventData?: Event;
}

export default function EventDetailsClient({ eventId, eventData }: EventDetailsClientProps) {
  return <EventDetails eventId={eventId} eventData={eventData} />;
} 