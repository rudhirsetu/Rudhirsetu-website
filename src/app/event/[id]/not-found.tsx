import NotFoundState from '../../../components/events/NotFoundState';
import { Accent } from '../../../components/ui/Section';

export default function EventNotFound() {
  return (
    <NotFoundState
      eyebrow="Event not found"
      title={
        <>
          We couldn&apos;t find that <Accent>event</Accent>
        </>
      }
      message="It may have been removed, or the link might be out of date. Browse our camps to find what's happening near you."
      primary={{ href: '/camp', label: 'See camps' }}
      secondary={{ href: '/', label: 'Back home' }}
    />
  );
}
