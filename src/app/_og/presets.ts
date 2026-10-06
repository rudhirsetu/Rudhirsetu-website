import type { OgRoute } from '../../lib/seo';
import type { IllustrationName } from './assets';

/** One word of a headline. `accent` words are set in the Pacifico script face (one per headline). */
export interface HeadlineWord {
  text: string;
  accent?: boolean;
}

export interface OgPreset {
  headline: HeadlineWord[];
  subtitle: string;
  illustration: IllustrationName;
}

/** Splits "Our *gallery*" style copy into words, marking the starred word as the accent. */
function words(copy: string): HeadlineWord[] {
  return copy.split(' ').map((word) => {
    const accent = /^\*(.+)\*([,.!?]*)$/.exec(word);
    return accent ? { text: accent[1] + accent[2], accent: true } : { text: word };
  });
}

/**
 * Share-image copy for each preset page. Headlines mirror each page's h1 and
 * use one script accent word, like the site. Each page's `opengraph-image.tsx`
 * picks its preset with `createPresetImage(route)` (see preset-image.tsx).
 * Pages without their own image (404, anything new) inherit the home one.
 */
export const OG_PRESETS: Record<OgRoute, OgPreset> = {
  home: {
    headline: words('Transforming *lives*, empowering communities'),
    subtitle: 'Blood donation, healthcare support and social initiatives across India.',
    illustration: 'drop',
  },
  camp: {
    headline: words('Making a difference *together*'),
    subtitle: 'Blood donation drives and healthcare camps for the community.',
    illustration: 'calendar',
  },
  gallery: {
    headline: words('Our *gallery*'),
    subtitle: 'Moments from our blood donation drives, camps and community events.',
    illustration: 'camera',
  },
  social: {
    headline: words('Follow our *journey*'),
    subtitle: 'Updates, stories and community impact from Rudhirsetu.',
    illustration: 'social',
  },
  donations: {
    headline: words('Support our *cause*'),
    subtitle: 'Your contribution powers blood drives, healthcare camps and community care.',
    illustration: 'donate',
  },
  contact: {
    headline: words('Get in *touch*'),
    subtitle: 'Volunteer, partner with us, or reach out in an emergency.',
    illustration: 'contact',
  },
};
