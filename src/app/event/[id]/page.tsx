'use client';

import { useParams } from 'next/navigation';
import EventDetails from '../../../pages/EventDetails';

export default function EventDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  
  if (!id) {
    return <div>Event not found</div>;
  }
  
  return <EventDetails eventId={id} />;
} 