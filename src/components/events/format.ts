/**
 * Deterministic event date formatting.
 *
 * Events happen in India, so dates are always shown in IST regardless of the
 * viewer's (or the server's) time zone. This also keeps server-rendered HTML
 * identical to what the client renders, so there is no hydration mismatch.
 */
const EVENT_TIME_ZONE = 'Asia/Kolkata';

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: EVENT_TIME_ZONE,
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export interface EventDateParts {
  /** "Saturday" */
  weekday: string;
  /** "October" */
  month: string;
  /** "October" shortened to "Oct" */
  monthShort: string;
  /** "12" */
  day: string;
  /** "2026" */
  year: string;
  /** "9:30 AM" */
  time: string;
  /** "Saturday, October 12, 2026" */
  full: string;
  /** "Oct 12, 2026" */
  short: string;
}

export function getEventDateParts(iso: string): EventDateParts | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const p: Record<string, string> = {};
  for (const part of partsFormatter.formatToParts(date)) {
    p[part.type] = part.value;
  }

  const monthShort = p.month.slice(0, 3);
  return {
    weekday: p.weekday,
    month: p.month,
    monthShort,
    day: p.day,
    year: p.year,
    time: `${p.hour}:${p.minute} ${String(p.dayPeriod).toUpperCase()}`,
    full: `${p.weekday}, ${p.month} ${p.day}, ${p.year}`,
    short: `${monthShort} ${p.day}, ${p.year}`,
  };
}

/** Reads pixel dimensions out of a Sanity image asset ref ("image-<hash>-1200x800-jpg"). */
export function getSanityImageSize(ref?: string): { width: number; height: number } | null {
  if (!ref) return null;
  const match = /-(\d+)x(\d+)-[a-z]+$/i.exec(ref);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}
