'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ComponentType, ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  Share2,
  Users,
  X,
} from 'lucide-react';
import { motion, MotionConfig } from 'framer-motion';
import PreloadLink from '../components/PreloadLink';
import NotFoundState from '../components/events/NotFoundState';
import { Accent, Eyebrow, SectionHeader, sectionItemVariants } from '../components/ui/Section';
import { btnPrimary, btnSecondary, focusRing } from '../components/events/styles';
import { getEventDateParts, getSanityImageSize } from '../components/events/format';
import { Event } from '../types/sanity';
import { client, urlFor } from '../lib/sanity';
import { usePageTransition } from '../context/PageTransitionContext';

interface EventDetailsProps {
  eventId?: string;
  eventData?: Event;
}

type GalleryItem = NonNullable<Event['gallery']>[number];
type IconType = ComponentType<{ className?: string }>;

const containerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const galleryGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const sectionPadding = 'px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32';

/** Candidate srcset widths, capped at the original's width so Sanity never has to upscale. */
const responsiveWidths = (candidates: number[], natural?: number) => {
  if (!natural) return candidates;
  const smaller = candidates.filter((w) => w < natural);
  return smaller.length === candidates.length ? candidates : [...smaller, natural];
};

const imageAlt = (image: GalleryItem, title: string, index: number) =>
  image.alt || image.caption || `${title}, photo ${index + 1}`;

/* -------------------------------------------------------------------------- */
/*  Ledger row                                                                 */
/* -------------------------------------------------------------------------- */

const MetaRow = ({
  icon: Icon,
  label,
  children,
}: {
  icon: IconType;
  label: string;
  children: ReactNode;
}) => (
  <li className="flex items-start gap-4 border-b border-red-900/10 py-4">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-red-700">
      <Icon className="h-5 w-5" />
    </span>
    <span className="min-w-0">
      <span className="block text-sm text-gray-500">{label}</span>
      <span className="mt-0.5 block break-words font-medium text-gray-900">{children}</span>
    </span>
  </li>
);

/* -------------------------------------------------------------------------- */
/*  Share                                                                      */
/* -------------------------------------------------------------------------- */

const ShareButton = ({ title, text }: { title: string; text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // The share sheet was dismissed or the clipboard is unavailable: nothing to do.
    }
  };

  return (
    <button type="button" onClick={handleShare} className={`${btnSecondary} w-full`}>
      <Share2 className="h-4 w-4 text-red-700" />
      {copied ? 'Link copied' : 'Share this event'}
      <span role="status" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/*  Lightbox                                                                   */
/* -------------------------------------------------------------------------- */

const iconButton =
  'flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const Lightbox = ({
  images,
  index,
  title,
  onClose,
  onChange,
}: {
  images: GalleryItem[];
  index: number;
  title: string;
  onClose: () => void;
  onChange: (index: number) => void;
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;
  const image = images[index];

  const goPrev = useCallback(() => onChange((index - 1 + total) % total), [index, total, onChange]);
  const goNext = useCallback(() => onChange((index + 1) % total), [index, total, onChange]);

  // Lock page scroll, move focus into the dialog, and hand it back on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      root.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'Tab' && dialogRef.current) {
        // Keep keyboard focus inside the dialog.
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, goPrev, goNext]);

  const size = getSanityImageSize(image.asset?._ref);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photo gallery`}
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex flex-col bg-red-950 text-white"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <p className="text-sm font-semibold tabular-nums text-white/70">
          <span className="font-display text-lg text-white">{index + 1}</span> / {total}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className={iconButton}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div
        className="relative min-h-0 flex-1"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) > 50) (delta > 0 ? goPrev : goNext)();
        }}
      >
        {total > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous photo"
            className={`${iconButton} absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Absolutely positioned so max-height resolves against a definite box in every browser. */}
        <div className="pointer-events-none absolute inset-y-0 inset-x-4 sm:inset-x-24">
          <img
            key={index}
            src={urlFor(image).width(1600).fit('max').auto('format').url()}
            alt={imageAlt(image, title, index)}
            width={size?.width}
            height={size?.height}
            className="pointer-events-auto absolute inset-0 m-auto h-auto max-h-full w-auto max-w-full rounded-2xl object-contain"
          />
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next photo"
            className={`${iconButton} absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="px-4 pb-5 pt-4 sm:px-6">
        {image.caption && (
          <p className="mx-auto mb-4 max-w-2xl text-center text-white/80">{image.caption}</p>
        )}
        {total > 1 && (
          <ul className="mx-auto flex w-fit max-w-full gap-2 overflow-x-auto pb-1">
            {images.map((thumb, i) => (
              <li key={thumb.asset?._ref ?? i} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onChange(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index}
                  className={`block h-14 w-14 overflow-hidden rounded-xl border-2 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-16 sm:w-16 ${
                    i === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={urlFor(thumb).width(128).height(128).auto('format').url()}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body
  );
};

/* -------------------------------------------------------------------------- */
/*  Gallery                                                                    */
/* -------------------------------------------------------------------------- */

const GalleryGrid = ({
  images,
  title,
  onOpen,
}: {
  images: GalleryItem[];
  title: string;
  onOpen: (index: number) => void;
}) => {
  // With three or more photos the first one leads as a large tile.
  const hasLead = images.length >= 3;

  return (
    <motion.ul
      variants={galleryGridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
    >
      {images.map((image, index) => {
        const lead = hasLead && index === 0;
        const natural = getSanityImageSize(image.asset?._ref);
        // Never ask Sanity for more pixels than the original has.
        const side = Math.min(lead ? 1000 : 640, natural ? Math.min(natural.width, natural.height) : Infinity);
        return (
          <motion.li
            key={image.asset?._ref ?? index}
            variants={sectionItemVariants}
            className={lead ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square'}
          >
            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-label={`Open photo ${index + 1} of ${images.length}${
                image.caption ? `: ${image.caption}` : ''
              }`}
              className={`group relative block h-full w-full overflow-hidden rounded-2xl border border-red-900/10 bg-white ${focusRing}`}
            >
              <img
                src={urlFor(image).width(side).height(side).auto('format').url()}
                alt={imageAlt(image, title, index)}
                width={side}
                height={side}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {image.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-950/80 to-transparent p-4 pt-10 text-left text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {image.caption}
                </span>
              )}
            </button>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

/* -------------------------------------------------------------------------- */
/*  Loading state                                                              */
/* -------------------------------------------------------------------------- */

const EventSkeleton = () => (
  <div
    className="bg-white px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36"
    role="status"
    aria-busy="true"
    aria-label="Loading event"
  >
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="h-5 w-40 rounded bg-red-900/5" />
      <div className="mt-8 h-8 w-32 rounded-full bg-red-900/5" />
      <div className="mt-6 h-12 w-3/4 rounded-lg bg-red-900/5 sm:h-16" />
      <div className="mt-10 aspect-[4/3] rounded-3xl border border-red-900/5 bg-red-900/5 sm:aspect-[16/9]" />
      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8">
          <div className="h-4 w-full rounded bg-red-900/5" />
          <div className="h-4 w-full rounded bg-red-900/5" />
          <div className="h-4 w-3/4 rounded bg-red-900/5" />
        </div>
        <div className="h-72 rounded-3xl bg-paper lg:col-span-4" />
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const EventDetails = ({ eventId, eventData }: EventDetailsProps = {}) => {
  const id = eventId;
  const [event, setEvent] = useState<Event | null>(eventData || null);
  const [loading, setLoading] = useState(!eventData);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { transitionState, endTransition } = usePageTransition();

  // End the card -> page transition once this page has mounted.
  // (endTransition is memoised in PageTransitionContext, so this runs once.)
  useEffect(() => {
    endTransition();
  }, [endTransition]);

  useEffect(() => {
    // Only fetch if we don't have eventData from the server.
    if (eventData || !id) return;

    let cancelled = false;
    const fetchEvent = async () => {
      try {
        const data = await client.fetch(
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
        if (!cancelled) setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        if (!cancelled) setError('Failed to load event details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEvent();
    return () => {
      cancelled = true;
    };
  }, [id, eventData]);

  const closeLightbox = useCallback(() => setSelectedImage(null), []);

  if (loading) {
    return <EventSkeleton />;
  }

  if (error || !event) {
    return (
      <NotFoundState
        eyebrow="Event not found"
        title={
          <>
            We couldn&apos;t find that <Accent>event</Accent>
          </>
        }
        message={
          error ||
          "It may have been removed, or the link might be out of date. Browse our camps to find what's happening near you."
        }
        primary={{ href: '/camp', label: 'See camps' }}
        secondary={{ href: '/', label: 'Back home' }}
      />
    );
  }

  const dateParts = getEventDateParts(event.date);
  const gallery = event.gallery?.filter((image) => image?.asset) ?? [];
  const hasGallery = gallery.length > 0;
  const hasImage = Boolean(event.image?.asset);
  const isUpcoming = event.isUpcoming;
  const aboutText = event.desc || event.shortDesc;
  const skipEntrance = transitionState.isTransitioning;

  const heroSrc = (width: number) =>
    urlFor(event.image)
      .width(width)
      .height(Math.round((width * 9) / 16))
      .auto('format')
      .url();

  // Event images are often portrait posters. Those are shown whole beside the details
  // instead of being cropped into a wide banner.
  const imageSize = hasImage ? getSanityImageSize(event.image.asset?._ref) : null;
  const ratio = imageSize ? imageSize.width / imageSize.height : 16 / 9;
  const isPoster = hasImage && ratio < 1.5;

  const heroWidths = responsiveWidths([800, 1200, 1600], imageSize?.width);
  const heroMax = heroWidths[heroWidths.length - 1];

  const posterSrc = (width: number) =>
    urlFor(event.image).width(width).fit('max').auto('format').url();
  const posterWidths = responsiveWidths([640, 960, 1200], imageSize?.width);
  const posterMax = posterWidths[posterWidths.length - 1];

  const mapsLink = event.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    : null;

  const ledger = (
    <div className="rounded-3xl bg-paper p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900">
        Event details
      </h2>
      <ul className="mt-4 border-t border-red-900/10">
        {dateParts && (
          <>
            <MetaRow icon={Calendar} label="Date">
              {dateParts.full}
            </MetaRow>
            <MetaRow icon={Clock} label="Time">
              {dateParts.time} IST
            </MetaRow>
          </>
        )}
        {event.location && (
          <MetaRow icon={MapPin} label="Location">
            {event.location}
            {mapsLink && (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-1 flex w-fit items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-800 ${focusRing}`}
              >
                Open in Maps
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </MetaRow>
        )}
        {event.expectedParticipants && (
          <MetaRow
            icon={Users}
            label={isUpcoming ? 'Expected participants' : 'Participants'}
          >
            {event.expectedParticipants}
          </MetaRow>
        )}
      </ul>

      {!isUpcoming && (
        <p className="mt-5 text-sm leading-relaxed text-gray-600">
          This event has already taken place. Browse the gallery to see the highlights.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {isUpcoming ? (
          <PreloadLink href="/contact" priority="high" className={`${btnPrimary} w-full`}>
            <Heart className="h-4 w-4" />
            Get involved
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </PreloadLink>
        ) : (
          <PreloadLink href="/gallery" priority="medium" className={`${btnPrimary} w-full`}>
            See the gallery
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </PreloadLink>
        )}
        <ShareButton
          title={event.title}
          text={event.shortDesc || `Check out this event: ${event.title}`}
        />
      </div>
    </div>
  );

  const about = aboutText ? (
    <>
      <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
        About this <Accent>event</Accent>
      </h2>
      <p className="mt-8 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-gray-600">
        {aboutText}
      </p>
    </>
  ) : null;

  return (
    <MotionConfig reducedMotion="user">
      <article>
        {/* Header, hero image and details */}
        <section className="bg-white px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-32 lg:pt-36">
          <motion.div
            initial={skipEntrance ? false : 'hidden'}
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-7xl"
          >
            <motion.div variants={sectionItemVariants}>
              <PreloadLink
                href="/camp"
                priority="high"
                className={`group inline-flex items-center gap-2 font-semibold text-red-700 hover:text-red-800 ${focusRing}`}
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="border-b border-red-700/30 pb-0.5 transition-colors group-hover:border-red-800">
                  All events &amp; camps
                </span>
              </PreloadLink>
            </motion.div>

            <motion.div
              variants={sectionItemVariants}
              className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-12 lg:items-end lg:gap-16"
            >
              <div className="lg:col-span-8">
                <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
                      isUpcoming
                        ? 'bg-red-100 text-red-900'
                        : 'border border-red-900/10 bg-paper text-gray-700'
                    }`}
                  >
                    {isUpcoming && (
                      <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                    )}
                    {isUpcoming ? 'Upcoming event' : 'Completed event'}
                  </span>
                  {dateParts && (
                    <span className="text-sm font-medium tabular-nums text-gray-500">
                      {dateParts.full}
                    </span>
                  )}
                </div>
                <motion.h1
                  layoutId={`event-title-${event._id}`}
                  className="text-balance break-words font-display text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
                >
                  {event.title}
                </motion.h1>
              </div>
              {event.desc && event.shortDesc && (
                <p className="text-lg leading-relaxed text-gray-600 lg:col-span-4 lg:pb-2">
                  {event.shortDesc}
                </p>
              )}
            </motion.div>

            {hasImage && !isPoster && (
              <motion.div variants={sectionItemVariants} className="mt-10 sm:mt-12">
                <motion.div
                  layoutId={`event-image-${event._id}`}
                  className="rounded-3xl border border-red-900/10 bg-white p-2.5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper sm:aspect-[16/9]">
                    <img
                      src={heroSrc(heroMax)}
                      srcSet={heroWidths.map((w) => `${heroSrc(w)} ${w}w`).join(', ')}
                      sizes="(min-width: 1280px) 1200px, (min-width: 640px) 100vw, 140vw"
                      width={heroMax}
                      height={Math.round((heroMax * 9) / 16)}
                      alt={event.image.alt || event.title}
                      fetchPriority="high"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                    />
                    {dateParts && (
                      <div className="absolute bottom-4 left-4 rounded-xl bg-white px-4 py-2 text-center leading-none shadow-sm sm:bottom-5 sm:left-5">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-red-700">
                          {dateParts.monthShort}
                        </span>
                        <span className="block font-display text-2xl font-bold text-gray-900">
                          {dateParts.day}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Poster (when portrait), details and description */}
          <div className="mx-auto mt-14 grid max-w-7xl gap-12 sm:mt-16 lg:mt-20 lg:grid-cols-12 lg:gap-16">
            {isPoster ? (
              <>
                <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
                  <motion.div
                    layoutId={`event-image-${event._id}`}
                    className="rounded-3xl border border-red-900/10 bg-paper p-2.5"
                  >
                    <div
                      className="overflow-hidden rounded-2xl bg-white"
                      style={{ aspectRatio: `${imageSize?.width} / ${imageSize?.height}` }}
                    >
                      <img
                        src={posterSrc(posterMax)}
                        srcSet={posterWidths.map((w) => `${posterSrc(w)} ${w}w`).join(', ')}
                        sizes="(min-width: 1024px) 40vw, (min-width: 448px) 448px, 100vw"
                        width={posterMax}
                        height={Math.round(posterMax / ratio)}
                        alt={event.image.alt || event.title}
                        fetchPriority="high"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-14 lg:col-span-7">
                  {ledger}
                  {about}
                </div>
              </>
            ) : (
              <>
                <aside className="order-1 lg:order-2 lg:col-span-5 lg:self-start xl:col-span-4 lg:sticky lg:top-28">
                  {ledger}
                </aside>
                <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-8">{about}</div>
              </>
            )}
          </div>
        </section>

        {/* Gallery */}
        {hasGallery && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className={`bg-paper ${sectionPadding}`}
          >
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                icon={Camera}
                eyebrow="Photos"
                title={
                  <>
                    Event <Accent>gallery</Accent>
                  </>
                }
                description={`${gallery.length} ${
                  gallery.length === 1 ? 'photo' : 'photos'
                } from this event. Tap any photo to view it full size.`}
              />
              <GalleryGrid images={gallery} title={event.title} onOpen={setSelectedImage} />
            </div>
          </motion.section>
        )}

        {/* Map */}
        {event.location && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className={`bg-white ${sectionPadding}`}
          >
            <div
              className={`mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16 ${
                hasGallery ? '' : 'border-t border-red-900/10 pt-20 sm:pt-24 lg:pt-32'
              }`}
            >
              <motion.div variants={sectionItemVariants} className="lg:col-span-5">
                <Eyebrow icon={MapPin}>Location</Eyebrow>
                <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  Find the <Accent>venue</Accent>
                </h2>
                <p className="mt-6 break-words text-lg leading-relaxed text-gray-600">
                  {event.location}
                </p>
                {mapsLink && (
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btnPrimary} mt-8`}
                  >
                    Open in Google Maps
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </motion.div>

              <motion.div variants={sectionItemVariants} className="lg:col-span-7">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-red-900/10 bg-paper lg:aspect-[16/10]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      event.location
                    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="absolute inset-0 h-full w-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    title={`Map showing location: ${event.location}`}
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </article>

      {selectedImage !== null && gallery[selectedImage] && (
        <Lightbox
          images={gallery}
          index={selectedImage}
          title={event.title}
          onClose={closeLightbox}
          onChange={setSelectedImage}
        />
      )}
    </MotionConfig>
  );
};

export default EventDetails;
