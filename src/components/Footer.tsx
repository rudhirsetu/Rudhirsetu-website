import Link from 'next/link';
import { getSiteSettings } from '../lib/data';
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Events & Camps', path: '/camp' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Socials', path: '/social' },
  { label: 'Donate', path: '/donations' },
  { label: 'Contact Us', path: '/contact' },
];

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{children}</h3>
);

// Server component: contact + social settings are fetched (and cached) on the server,
// so the footer ships no client JS and never pops in after load.
const Footer = async () => {
  const { contact: contactSettings, social: socialLinks } = await getSiteSettings();

  const socials = [
    { url: socialLinks?.facebookUrl, label: 'Facebook', icon: Facebook },
    { url: socialLinks?.instagramUrl, label: 'Instagram', icon: Instagram },
    { url: socialLinks?.linkedinUrl, label: 'LinkedIn', icon: Linkedin },
    { url: socialLinks?.youtubeUrl, label: 'YouTube', icon: Youtube },
  ].filter((social) => social.url && /^https?:\/\//i.test(social.url));

  return (
    <footer className="relative bg-white">
      <div className="relative overflow-hidden rounded-t-[2rem] bg-red-950 text-white sm:rounded-t-[3rem]">
        {/* Soft glow (a gradient, not a blur filter) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(220,38,38,0.28),transparent_70%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Call to action */}
          <div className="grid gap-8 border-b border-white/10 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                Rudhirsetu means bridge of blood
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Be a part of the{' '}
                <span className="font-script font-normal tracking-normal text-red-300">bridge.</span>
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
              <Link
                href="/camp"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 font-semibold text-red-900 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Join Our Next Camp
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/donations"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Donate Now
                <Heart className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-12 py-12 sm:py-16 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link
                href="/"
                aria-label="Rudhirsetu Seva Sanstha home"
                className="inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <img alt="Rudhirsetu Logo" width={80} height={83} className="h-20 w-auto" src="/images/logo-light.svg" />
              </Link>
              <p className="mt-6 max-w-sm leading-relaxed text-white/60">
                Since 2010, Rudhirsetu Seva Sanstha has organised blood donation camps, emergency blood support
                and free health camps for the community.
              </p>
              {socials.length > 0 && (
                <ul className="mt-6 flex items-center gap-2.5" aria-label="Social media">
                  {socials.map(({ url, label, icon: Icon }) => (
                    <li key={label}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Explore */}
            <nav aria-label="Footer" className="lg:col-span-4 lg:col-start-5 xl:col-span-3 xl:col-start-6">
              <ColumnHeading>Explore</ColumnHeading>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="group inline-flex min-h-[44px] items-center gap-1 whitespace-nowrap text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                        {link.label}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Reach us */}
            <div className="md:col-span-2 lg:col-span-4 lg:col-start-9">
              <ColumnHeading>Reach Us</ColumnHeading>

              {contactSettings?.phone && (
                <a
                  href={`tel:${contactSettings.phone}`}
                  className="group mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-white/25 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>
                    <span className="flex items-center gap-2 text-sm text-red-300">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60 motion-reduce:hidden" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                      </span>
                      Need blood urgently? 24/7 support
                    </span>
                    <span className="mt-2 block font-display text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                      {contactSettings.phone}
                    </span>
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-red-900 transition-transform group-hover:scale-105">
                    <Phone className="h-5 w-5" />
                  </span>
                </a>
              )}

              <ul className="mt-5 space-y-4">
                {contactSettings?.email && (
                  <li>
                    <a
                      href={`mailto:${contactSettings.email}`}
                      className="flex items-start gap-3 break-all text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                      <span>{contactSettings.email}</span>
                    </a>
                  </li>
                )}
                {contactSettings?.address && (
                  <li className="flex items-start gap-3 text-white/75">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                    <span className="leading-relaxed">{contactSettings.address}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Wordmark band with the bottom bar set into it */}
        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 250"
              className="block w-full select-none font-script"
              preserveAspectRatio="xMidYMax meet"
            >
              <defs>
                <linearGradient id="footer-wordmark-fade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
                  <stop offset="75%" stopColor="#ffffff" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <text
                x="500"
                y="215"
                textAnchor="middle"
                fontSize="230"
                textLength="980"
                lengthAdjust="spacingAndGlyphs"
                fill="url(#footer-wordmark-fade)"
              >
                Rudhirsetu
              </text>
            </svg>
          </div>

          {/* On phones the bar sits below the wordmark; from sm up it is set into the wordmark's lower edge. */}
          <div className="relative sm:absolute sm:inset-x-0 sm:bottom-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-sm text-white/50 sm:flex-row">
                <p className="text-center sm:text-left">
                  &copy; {new Date().getFullYear()} Rudhirsetu Seva Sanstha. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <a
                    href="https://www.linkedin.com/in/deeptanshu-l-6868a4187/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 transition-colors hover:text-white"
                  >
                    Made with
                    <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                    by Deeptanshu
                  </a>
                  <a
                    href="#"
                    className="group inline-flex items-center gap-1.5 font-medium text-white/70 transition-colors hover:text-white"
                  >
                    Back to top
                    <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
