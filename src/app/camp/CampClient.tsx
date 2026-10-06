'use client';

import Impact, { type EventsPage } from '../../views/Impact';

interface CampClientProps {
  initialUpcoming: EventsPage | null;
  initialPast: EventsPage | null;
}

export default function CampClient({ initialUpcoming, initialPast }: CampClientProps) {
  return <Impact initialUpcoming={initialUpcoming} initialPast={initialPast} />;
}
