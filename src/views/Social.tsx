'use client';

import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { ArrowRight, ArrowUpRight, Facebook, Heart, Instagram, Linkedin, MessageSquare, Youtube } from 'lucide-react';
import { motion, MotionConfig } from 'framer-motion';
import type { SocialMediaSettings } from '../types/sanity';
import { settingsService } from '../services/sanity-client';
import PreloadLink from '../components/PreloadLink';
import { Accent, SectionHeader, sectionItemVariants } from '../components/ui/Section';

type IconType = ComponentType<{ className?: string }>;

interface Platform {
  key: keyof Pick<SocialMediaSettings, 'instagramUrl' | 'facebookUrl' | 'youtubeUrl' | 'linkedinUrl'>;
  name: string;
  icon: IconType;
  action: string;
  description: string;
}

const PLATFORMS: Platform[] = [
  {
    key: 'instagramUrl',
    name: 'Instagram',
    icon: Instagram,
    action: 'Follow',
    description: 'Join our Instagram community for visual stories and daily inspiration.',
  },
  {
    key: 'facebookUrl',
    name: 'Facebook',
    icon: Facebook,
    action: 'Follow',
    description: 'Follow us on Facebook for event updates and community stories.',
  },
  {
    key: 'youtubeUrl',
    name: 'YouTube',
    icon: Youtube,
    action: 'Subscribe',
    description: 'Subscribe to our YouTube channel for event recordings and impact stories.',
  },
  {
    key: 'linkedinUrl',
    name: 'LinkedIn',
    icon: Linkedin,
    action: 'Connect',
    description: 'Connect with us on LinkedIn for professional updates and networking.',
  },
];

/** Tile surfaces, in order: one dark, one paper, one white bordered, one red. Reds and maroons only. */
const SURFACES = [
  {
    tile: 'bg-red-950 text-white',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(220,38,38,0.35),transparent_60%)]',
    index: 'text-white/50',
    description: 'text-white/70',
    rule: 'border-white/15',
    meta: 'text-white/60',
    icon: 'bg-white/10 text-white group-hover:bg-white group-hover:text-red-950',
    arrow: 'border-white/25 text-white group-hover:border-white group-hover:bg-white group-hover:text-red-950',
    ring: 'focus-visible:ring-white focus-visible:ring-offset-white',
  },
  {
    tile: 'bg-paper text-gray-900',
    glow: '',
    index: 'text-red-700/50',
    description: 'text-gray-600',
    rule: 'border-red-900/10',
    meta: 'text-gray-500',
    icon: 'bg-white text-red-700 group-hover:bg-red-700 group-hover:text-white',
    arrow: 'border-red-900/15 text-red-700 group-hover:border-red-700 group-hover:bg-red-700 group-hover:text-white',
    ring: 'focus-visible:ring-red-700 focus-visible:ring-offset-white',
  },
  {
    tile: 'bg-white text-gray-900 border border-red-900/10',
    glow: '',
    index: 'text-red-700/50',
    description: 'text-gray-600',
    rule: 'border-red-900/10',
    meta: 'text-gray-500',
    icon: 'bg-paper text-red-700 group-hover:bg-red-700 group-hover:text-white',
    arrow: 'border-red-900/15 text-red-700 group-hover:border-red-700 group-hover:bg-red-700 group-hover:text-white',
    ring: 'focus-visible:ring-red-700 focus-visible:ring-offset-white',
  },
  {
    tile: 'bg-red-700 text-white',
    glow: 'bg-[radial-gradient(circle_at_0%_100%,rgba(69,10,10,0.45),transparent_65%)]',
    index: 'text-white/60',
    description: 'text-white/80',
    rule: 'border-white/20',
    meta: 'text-white/70',
    icon: 'bg-white/15 text-white group-hover:bg-white group-hover:text-red-700',
    arrow: 'border-white/30 text-white group-hover:border-white group-hover:bg-white group-hover:text-red-700',
    ring: 'focus-visible:ring-white focus-visible:ring-offset-white',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

/** Only http(s) links from the CMS are rendered; bare domains get https://. */
const toSafeUrl = (value?: string): URL | null => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
};

const displayUrl = (url: URL) => (url.hostname.replace(/^www\./, '') + url.pathname).replace(/\/$/, '');

const SocialTile = ({
  platform,
  url,
  index,
  wide,
}: {
  platform: Platform;
  url: URL;
  index: number;
  wide: boolean;
}) => {
  const surface = SURFACES[index % SURFACES.length];
  const Icon = platform.icon;

  return (
    <motion.div variants={sectionItemVariants} className={wide ? 'md:col-span-2' : undefined}>
      <a
        href={url.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative isolate flex min-h-[19rem] flex-col justify-between overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(69,10,10,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:min-h-[21rem] sm:p-8 ${surface.tile} ${surface.ring}`}
      >
        {surface.glow && (
          <span aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${surface.glow}`} />
        )}

        <div className="flex items-start justify-between gap-4">
          <span className={`text-sm font-semibold tabular-nums ${surface.index}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            aria-hidden="true"
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${surface.arrow}`}
          >
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <div>
          <span
            aria-hidden="true"
            className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${surface.icon}`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">{platform.name}</h2>
          <p className={`mt-3 max-w-md leading-relaxed ${surface.description}`}>{platform.description}</p>
          <div
            className={`mt-6 flex items-center justify-between gap-4 border-t pt-4 text-sm ${surface.rule} ${surface.meta}`}
          >
            <span className="min-w-0 truncate">{displayUrl(url)}</span>
            <span className="shrink-0 font-semibold">
              {platform.action}
              <span className="sr-only"> on {platform.name} (opens in a new tab)</span>
            </span>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

interface SocialProps {
  /** Social media settings fetched on the server. */
  settings: SocialMediaSettings | null;
}

const Social = ({ settings: initialSettings }: SocialProps) => {
  const [settings, setSettings] = useState<SocialMediaSettings | null>(initialSettings);
  const [loading, setLoading] = useState(initialSettings === null);

  // Browser fallback, only used when the server fetch returned nothing.
  useEffect(() => {
    if (initialSettings) return;
    let cancelled = false;
    settingsService
      .fetchSocialMedia()
      .then((data) => {
        if (!cancelled && data) setSettings(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialSettings]);

  const links = PLATFORMS.flatMap((platform) => {
    const url = toSafeUrl(settings?.[platform.key]);
    return url ? [{ platform, url }] : [];
  });

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-40"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            as="h1"
            icon={MessageSquare}
            eyebrow="Connect"
            title={
              <>
                Follow our <Accent>journey</Accent>
              </>
            }
            description={
              settings?.description ||
              'Follow us on social media to stay updated with our latest events, initiatives, and community stories.'
            }
          />

          {loading ? (
            <div aria-hidden="true" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="min-h-[19rem] animate-pulse rounded-3xl bg-red-900/5 sm:min-h-[21rem]" />
              ))}
            </div>
          ) : links.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
              {links.map(({ platform, url }, index) => (
                <SocialTile
                  key={platform.key}
                  platform={platform}
                  url={url}
                  index={index}
                  wide={links.length % 2 === 1 && index === links.length - 1}
                />
              ))}
            </div>
          ) : (
            <motion.div variants={sectionItemVariants} className="mx-auto max-w-md py-8 text-center">
              <img
                src="/images/illustrations/contact.webp"
                alt=""
                aria-hidden="true"
                width={715}
                height={579}
                decoding="async"
                className="mx-auto mb-8 h-40 w-auto"
              />
              <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900">
                Our channels are on their way
              </h2>
              <p className="mt-3 text-gray-600">
                We haven&apos;t linked our social profiles yet. In the meantime, you can reach us directly.
              </p>
            </motion.div>
          )}

          {/* Join the community */}
          <motion.div
            variants={sectionItemVariants}
            className="mt-16 flex flex-col gap-8 border-t border-red-900/10 pt-12 sm:mt-20 md:flex-row md:items-center md:gap-12"
          >
            <img
              src="/images/illustrations/social.webp"
              alt=""
              aria-hidden="true"
              width={720}
              height={579}
              loading="lazy"
              decoding="async"
              className="h-28 w-auto shrink-0 self-start sm:h-36 md:self-center"
            />
            <div className="flex-1">
              <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-4xl">
                Join our <Accent>community</Accent>
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
                Follow us to stay connected and be part of our journey in making a difference, one donation at a time.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <PreloadLink
                href="/contact"
                priority="high"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-red-700"
              >
                Get Involved
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </PreloadLink>
              <PreloadLink
                href="/donations"
                priority="medium"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-red-900/15 px-6 py-3.5 font-semibold text-gray-900 transition-colors hover:bg-paper"
              >
                Donate Now
                <Heart className="h-4 w-4 text-red-700" />
              </PreloadLink>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </MotionConfig>
  );
};

export default Social;
