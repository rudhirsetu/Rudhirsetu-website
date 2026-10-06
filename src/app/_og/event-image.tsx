import { getEventDateParts, getSanityImageSize } from '../../components/events/format';
import { client, urlFor } from '../../lib/sanity';
import { SITE_URL } from '../../lib/seo';
import type { Event } from '../../types/sanity';
import { loadIllustration, loadLogo, loadRemoteImage } from './assets';
import { EventCard, eventPhotoSize } from './card';
import { getOgFonts } from './fonts';
import { CACHE_DEGRADED, CACHE_EVENT, bannerResponse, renderImage } from './respond';

type EventForImage = Pick<Event, '_id' | 'title' | 'date' | 'location' | 'isUpcoming' | 'image'>;

const EVENT_QUERY = `*[_type == "event" && _id == $id][0]{
  _id,
  title,
  date,
  location,
  isUpcoming,
  image
}`;

/** Ids of every event, for `generateStaticParams`, so each event's share image is prerendered at build time. */
export async function getEventIds(): Promise<Array<{ id: string }>> {
  try {
    const events = await client.fetch<Array<{ _id: string }>>(
      `*[_type == "event"]{ _id }`,
      {},
      { next: { revalidate: 300, tags: ['event'] } },
    );
    return (events ?? []).map((event) => ({ id: event._id }));
  } catch (error) {
    // An empty list keeps the build going; images are then generated on first request.
    console.error('Error listing events for share images:', error);
    return [];
  }
}

/**
 * Keeps only Latin text and common punctuation. Satori can't shape Devanagari (vowel signs and
 * conjuncts come out wrong, which is worse than leaving the text out) and would fetch emoji
 * images over the network, so anything else is dropped from the image. Page titles and
 * descriptions still carry the full text.
 */
function toLatinText(text: string): string {
  return text
    .replace(/[^\u0020-\u024F\u2010-\u2027\u20B9]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s\-\u2013\u2014|<>\u00B7,;:]+|[\s\-\u2013\u2014|<>\u00B7,;:]+$/g, '');
}

/**
 * Event titles are often "Blood Donation Camp | Venue, Town — 5th October 2025". The venue and
 * date already get their own rows on the card, so the headline keeps just the first part.
 */
function eventHeadline(title: string): string {
  const clean = title.replace(/\s+/g, ' ').trim();
  const first = clean.split(/\s+(?:\||—|–|<>|·)\s+/)[0]?.trim() ?? clean;
  const headline = toLatinText(first.length >= 14 ? first : clean);
  return /[A-Za-z0-9]/.test(headline) ? headline : 'Rudhirsetu event';
}

/** "Sun, Oct 5, 2025 · 9:00 AM IST", always in India time (see components/events/format.ts). */
function eventDateLine(iso: string): string {
  const parts = getEventDateParts(iso);
  return parts ? `${parts.weekday.slice(0, 3)}, ${parts.short} · ${parts.time} IST` : '';
}

/**
 * Renders the share image for one event: status, title, IST date, location and the event's photo
 * (or a calendar illustration when there is no photo or it can't be loaded).
 */
export async function renderEventImage(id: string): Promise<Response> {
  try {
    const event = await client.fetch<EventForImage | null>(
      EVENT_QUERY,
      { id },
      // Same tags as the event page, so the Sanity webhook refreshes both.
      { next: { revalidate: 300, tags: ['event', `event-${id}`] } },
    );
    if (!event) {
      return new Response('Event not found', { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } });
    }

    const headline = eventHeadline(event.title ?? '');
    const dateLine = eventDateLine(event.date);
    const location = toLatinText(event.location ?? '');

    // The photo is drawn at a size that matches its own aspect ratio, so posters are not cropped.
    // Satori can't decode WebP/AVIF, which `urlFor` would otherwise negotiate, so ask for a JPEG.
    const source = getSanityImageSize(event.image?.asset?._ref);
    const photoSize = eventPhotoSize(source ? source.width / source.height : 1);
    const photoUrl = event.image?.asset
      ? urlFor(event.image)
          .width(photoSize.width)
          .height(photoSize.height)
          .fit('crop')
          .format('jpg')
          .quality(80)
          .url()
      : null;

    const text = [headline, dateLine, location, 'Upcoming Completed'].join(' ');
    const [{ fonts, degraded }, logo, photoData] = await Promise.all([
      getOgFonts(text, SITE_URL),
      loadLogo(SITE_URL),
      photoUrl ? loadRemoteImage(photoUrl) : Promise.resolve(null),
    ]);
    const photo = photoData ? { src: photoData, ...photoSize } : null;
    // Without a photo the card shows a calendar illustration instead.
    const illustration = photo ? null : await loadIllustration('calendar', SITE_URL);

    const incomplete = degraded || !logo || (photoUrl !== null && photo === null);
    return await renderImage(
      <EventCard
        title={headline}
        status={event.isUpcoming ? 'upcoming' : 'completed'}
        dateLine={dateLine}
        location={location}
        photo={photo}
        illustration={illustration}
        logo={logo}
      />,
      fonts,
      incomplete ? CACHE_DEGRADED : CACHE_EVENT,
    );
  } catch (error) {
    console.error('Error generating event share image:', error);
    return bannerResponse(SITE_URL);
  }
}
