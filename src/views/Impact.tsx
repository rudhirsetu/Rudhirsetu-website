'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, MotionConfig } from 'framer-motion';
import PreloadLink from '../components/PreloadLink';
import EventCard from '../components/EventCard';
import { Accent, SectionHeader, sectionItemVariants } from '../components/ui/Section';
import { btnOnDark, btnOnDarkOutline, btnSecondary, focusRing } from '../components/events/styles';
import { Event, Pagination } from '../types/sanity';
import { eventService } from '../services/sanity-client';
import { IMPACT } from '../lib/impact';

/** One page of events plus its pagination meta. Fetched on the server for page 1. */
export interface EventsPage {
  data: Event[];
  pagination: Pagination;
}

interface ImpactProps {
  initialUpcoming?: EventsPage | null;
  initialPast?: EventsPage | null;
}

type Fetcher = ReturnType<typeof eventService.fetchUpcoming>;

const fetchUpcoming = (page: number): Fetcher => eventService.fetchUpcoming(page);
const fetchPast = (page: number): Fetcher => eventService.fetchPast(page);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/**
 * Holds one paginated list. Page 1 normally arrives from the server; if it did not
 * (Sanity hiccup at render time) the list fetches itself on mount instead.
 */
function useEventList(fetchPage: (page: number) => Fetcher, initial: EventsPage | null) {
  const [list, setList] = useState<EventsPage | null>(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const hadInitial = useRef(Boolean(initial));

  const goTo = useCallback(
    async (page: number) => {
      const id = ++requestId.current;
      setLoading(true);
      setError(null);
      const result = await fetchPage(page);
      if (id !== requestId.current) return false; // a newer request superseded this one
      if (result) {
        setList({ data: result.data, pagination: result.meta.pagination });
      } else {
        setError('We could not load events just now. Please try again.');
      }
      setLoading(false);
      return Boolean(result);
    },
    [fetchPage]
  );

  useEffect(() => {
    if (hadInitial.current) return;
    // Deferred so the fallback fetch starts after mount rather than setting state inside the effect.
    const timer = setTimeout(() => void goTo(1), 0);
    return () => clearTimeout(timer);
  }, [goTo]);

  return { list, loading, error, goTo };
}

type EventListState = ReturnType<typeof useEventList>;

const ListHeading = ({
  index,
  title,
  total,
}: {
  index: number;
  title: ReactNode;
  total?: number;
}) => (
  <motion.div
    variants={sectionItemVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    className="mb-8 flex items-end justify-between gap-6 border-b border-red-900/10 pb-5 sm:mb-10 sm:pb-6"
  >
    <div>
      <span className="text-sm font-semibold tabular-nums text-red-700/50">
        {String(index).padStart(2, '0')}
      </span>
      <h2 className="mt-1 font-display text-3xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
    {typeof total === 'number' && (
      <p className="shrink-0 pb-1 text-sm text-gray-500 tabular-nums">
        {total} {total === 1 ? 'event' : 'events'}
      </p>
    )}
  </motion.div>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`animate-pulse overflow-hidden rounded-3xl border border-red-900/5 bg-white ${
          i === 2 ? 'hidden md:block' : i === 3 ? 'hidden lg:block' : ''
        }`}
      >
        <div className="m-3 h-56 rounded-2xl bg-red-900/5" />
        <div className="space-y-3 p-6">
          <div className="h-6 w-3/4 rounded bg-red-900/5" />
          <div className="h-4 w-1/2 rounded bg-red-900/5" />
          <div className="h-4 w-2/3 rounded bg-red-900/5" />
        </div>
      </div>
    ))}
  </div>
);

/** Centred empty / error state with the calendar illustration. */
const StatePanel = ({
  title,
  message,
  tone,
  action,
}: {
  title: string;
  message: string;
  tone: 'white' | 'paper';
  action?: ReactNode;
}) => (
  <div
    className={`flex flex-col items-center rounded-3xl border border-red-900/10 px-6 py-12 text-center sm:py-16 ${
      tone === 'white' ? 'bg-white' : 'bg-paper'
    }`}
  >
    <img
      src="/images/illustrations/empty-events.webp"
      alt=""
      aria-hidden="true"
      width={653}
      height={800}
      loading="lazy"
      className="h-40 w-auto"
    />
    <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-gray-900">{title}</h3>
    <p className="mt-2 max-w-md text-gray-600">{message}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

const PaginationControls = ({
  pagination,
  onPageChange,
  label,
  busy,
}: {
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  label: string;
  busy: boolean;
}) => {
  if (!pagination || pagination.pageCount <= 1) return null;

  const { page, pageCount } = pagination;
  const atStart = page <= 1;
  const atEnd = page >= pageCount;
  const buttonClass = `flex h-12 w-12 items-center justify-center rounded-full border border-red-900/15 text-gray-900 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-white aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:border-red-900/15 aria-disabled:hover:bg-transparent aria-disabled:hover:text-gray-900 ${focusRing}`;

  return (
    <nav
      aria-label={`${label} pagination`}
      className="mt-10 flex items-center justify-between border-t border-red-900/10 pt-6"
    >
      <p className="text-sm font-medium text-gray-600 tabular-nums" aria-live="polite">
        Page <span className="font-display text-lg font-bold text-gray-900">{page}</span> of{' '}
        {pageCount}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => !atStart && !busy && onPageChange(page - 1)}
          aria-disabled={atStart || busy}
          aria-label={`Previous page of ${label.toLowerCase()}`}
          className={buttonClass}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => !atEnd && !busy && onPageChange(page + 1)}
          aria-disabled={atEnd || busy}
          aria-label={`Next page of ${label.toLowerCase()}`}
          className={buttonClass}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};

const EventList = ({
  id,
  index,
  title,
  label,
  variant,
  tone,
  state,
  emptyTitle,
  emptyMessage,
  emptyAction,
}: {
  id: string;
  index: number;
  title: ReactNode;
  label: string;
  variant: 'upcoming' | 'past';
  tone: 'white' | 'paper';
  state: EventListState;
  emptyTitle: string;
  emptyMessage: string;
  emptyAction?: ReactNode;
}) => {
  const { list, loading, error, goTo } = state;
  const anchorRef = useRef<HTMLDivElement>(null);

  const handlePageChange = useCallback(
    async (page: number) => {
      const ok = await goTo(page);
      const el = anchorRef.current;
      // Bring the list back into view only if the user paged from below its top edge.
      if (ok && el && el.getBoundingClientRect().top < 0) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [goTo]
  );

  const retry = (
    <button
      type="button"
      onClick={() => void goTo(list?.pagination.page ?? 1)}
      className={`inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700 ${focusRing}`}
    >
      Try again
    </button>
  );

  let body: ReactNode;
  if (!list && loading) {
    body = <SkeletonGrid />;
  } else if (!list) {
    body = (
      <StatePanel
        tone={tone}
        title="Failed to load events"
        message={error ?? 'Something went wrong. Please try again.'}
        action={retry}
      />
    );
  } else if (list.data.length === 0) {
    body = (
      <StatePanel tone={tone} title={emptyTitle} message={emptyMessage} action={emptyAction} />
    );
  } else {
    body = (
      <motion.div
        key={list.pagination.page}
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        aria-busy={loading}
        className={`grid grid-cols-1 items-stretch gap-6 transition-opacity duration-300 md:grid-cols-2 lg:grid-cols-3 ${
          loading ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        {list.data.map((event) => (
          <motion.div key={event._id} variants={sectionItemVariants} className="flex">
            <EventCard event={event} variant={variant} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div id={id} ref={anchorRef} className="scroll-mt-28">
      <ListHeading index={index} title={title} total={list?.pagination.total} />
      {body}
      {list && error && (
        <p role="alert" className="mt-6 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <PaginationControls
        pagination={list?.pagination ?? null}
        onPageChange={handlePageChange}
        label={label}
        busy={loading}
      />
    </div>
  );
};

const SummaryItem = ({
  href,
  value,
  label,
}: {
  href?: string;
  value: ReactNode;
  label: string;
}) => {
  const content = (
    <>
      <span className="block font-display text-4xl font-bold tracking-tight tabular-nums text-gray-900 transition-colors group-hover:text-red-700 sm:text-5xl">
        {value}
      </span>
      <span className="mt-1 block text-sm text-gray-500">{label}</span>
    </>
  );
  return (
    <li className="border-l border-red-900/10 first:border-l-0">
      {href ? (
        <a href={href} className={`group block px-4 py-6 sm:px-8 ${focusRing}`}>
          {content}
        </a>
      ) : (
        <div className="px-4 py-6 sm:px-8">{content}</div>
      )}
    </li>
  );
};

const Impact = ({ initialUpcoming = null, initialPast = null }: ImpactProps) => {
  const upcoming = useEventList(fetchUpcoming, initialUpcoming);
  const past = useEventList(fetchPast, initialPast);
  const yearsOfService = new Date().getFullYear() - IMPACT.foundedYear;

  return (
    <MotionConfig reducedMotion="user">
      {/* Header + upcoming */}
      <section className="bg-paper px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-44">
        <div className="mx-auto max-w-7xl">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <SectionHeader
              as="h1"
              icon={Activity}
              eyebrow="Events & Camps"
              title={
                <>
                  Making a difference <Accent>together</Accent>
                </>
              }
              description="Together, we're making a difference in our community through various healthcare initiatives and awareness programs."
            />
          </motion.div>

          <motion.ul
            variants={sectionItemVariants}
            initial="hidden"
            animate="visible"
            aria-label="Events at a glance"
            className="mb-16 grid grid-cols-3 border-y border-red-900/10 sm:mb-20"
          >
            <SummaryItem
              href="#upcoming"
              value={upcoming.list ? upcoming.list.pagination.total : '–'}
              label="Upcoming"
            />
            <SummaryItem
              href="#past"
              value={past.list ? past.list.pagination.total : '–'}
              label="Completed"
            />
            <SummaryItem value={yearsOfService} label="Years of service" />
          </motion.ul>

          <EventList
            id="upcoming"
            index={1}
            title={
              <>
                Upcoming &amp; <Accent>ongoing</Accent>
              </>
            }
            label="Upcoming events"
            variant="upcoming"
            tone="white"
            state={upcoming}
            emptyTitle="No upcoming events right now"
            emptyMessage="New camps are announced regularly. Check back soon, or get in touch if you'd like to help organise one."
            emptyAction={
              <PreloadLink href="/contact" priority="medium" className={btnSecondary}>
                Get in touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </PreloadLink>
            }
          />
        </div>
      </section>

      {/* Past events + call to action */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <EventList
            id="past"
            index={2}
            title={
              <>
                Past events &amp; <Accent>camps</Accent>
              </>
            }
            label="Past events"
            variant="past"
            tone="paper"
            state={past}
            emptyTitle="No past events yet"
            emptyMessage="Completed camps and events will be archived here."
          />

          <motion.div
            variants={sectionItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="relative mt-20 overflow-hidden rounded-3xl bg-red-700 p-7 text-white sm:mt-24 sm:p-10 lg:p-14"
          >
            <div className="relative grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                  Want to bring a camp to your <Accent className="text-red-100">community</Accent>?
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
                  Whether you&apos;d like to volunteer, donate or help organise a camp near you, we&apos;d
                  love to hear from you.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <PreloadLink href="/contact" priority="high" className={btnOnDark}>
                    Contact us
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </PreloadLink>
                  <PreloadLink href="/donations" priority="medium" className={btnOnDarkOutline}>
                    Donate
                  </PreloadLink>
                </div>
              </div>
              <div className="hidden justify-end lg:col-span-4 lg:flex">
                <img
                  src="/images/focus/blood-donation.webp"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width={440}
                  height={630}
                  className="h-56 w-auto drop-shadow-[0_30px_60px_rgba(69,10,10,0.45)]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Impact;
