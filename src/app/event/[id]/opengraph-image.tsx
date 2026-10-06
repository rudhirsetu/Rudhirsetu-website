import { getEventIds, renderEventImage } from '../../_og/event-image';

// Prerendered at build time for every event in Sanity (new events are rendered on their first
// request), then refreshed when the event's cache tag is revalidated or after 5 minutes.
export const alt = 'Rudhirsetu Seva Sanstha event';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';
export const revalidate = 300;

export async function generateStaticParams() {
  return getEventIds();
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return renderEventImage(id);
}
