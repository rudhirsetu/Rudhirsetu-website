'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ArrowUpRight, Heart, Menu, X } from 'lucide-react';
import PreloadLink from './PreloadLink';

interface NavItem {
  href: string;
  label: string;
  /** Extra path prefixes that should light this item up (e.g. event pages belong to Camps). */
  match?: string[];
}

const DONATE_HREF = '/donations';

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/camp', label: 'Camps', match: ['/camp', '/event'] },
  { href: '/gallery', label: 'Gallery' },
  { href: DONATE_HREF, label: 'Donate' },
  { href: '/social', label: 'Socials' },
  { href: '/contact', label: 'Contact' },
];

/** Desktop shows Donate as the CTA button, so it is not repeated in the link row. */
const DESKTOP_LINKS = NAV_ITEMS.filter((item) => item.href !== DONATE_HREF);

const MENU_ID = 'mobile-menu';
const SCROLLED_AT = 16;
/** Routes whose top section is the dark hero, where the bar starts out white-on-dark. */
const DARK_TOP_ROUTES = ['/'];
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const isActive = (pathname: string, item: NavItem) => {
  if (item.href === '/') return pathname === '/';
  return (item.match ?? [item.href]).some((base) => pathname === base || pathname.startsWith(`${base}/`));
};

/**
 * Freezes the page behind the mobile menu.
 *
 * `overflow: hidden` alone is not enough on older iOS Safari, so the body is
 * pinned with `position: fixed` and the scroll offset is restored on unlock.
 * The scrollbar width is re-added as padding so desktop layouts do not jump.
 * (`top` needs `!important` because globals.css pins `body { top: 0 !important }`.)
 * Lenis ignores wheel events inside the menu via `data-lenis-prevent`.
 */
const lockBodyScroll = () => {
  const { body, documentElement: html } = document;
  const scrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - html.clientWidth;
  const style = body.style;
  const prev = {
    position: style.position,
    left: style.left,
    right: style.right,
    width: style.width,
    paddingRight: style.paddingRight,
  };

  style.position = 'fixed';
  style.setProperty('top', `${-scrollY}px`, 'important');
  style.left = '0';
  style.right = '0';
  style.width = '100%';
  if (scrollbarWidth > 0) style.paddingRight = `${scrollbarWidth}px`;

  return () => {
    style.position = prev.position;
    style.removeProperty('top');
    style.left = prev.left;
    style.right = prev.right;
    style.width = prev.width;
    style.paddingRight = prev.paddingRight;
    window.scrollTo(0, scrollY);
  };
};

const Brand = ({ tone }: { tone: 'dark' | 'light' }) => (
  <span className="flex items-center gap-2.5">
    <img
      src="/images/monogram.svg"
      alt=""
      width={219}
      height={210}
      className={`h-9 w-auto shrink-0 transition-[filter] duration-300 lg:h-10 ${tone === 'light' ? 'brightness-0 invert' : ''}`}
    />
    <span className="flex flex-col">
      <span
        className={`font-display text-xl/none font-bold tracking-tight transition-colors duration-300 ${tone === 'dark' ? 'text-gray-900' : 'text-white'}`}
      >
        Rudhirsetu
      </span>
      <span
        className={`mt-1 text-xs/none font-semibold transition-colors duration-300 ${tone === 'dark' ? 'text-red-700' : 'text-red-200'}`}
      >
        Seva Sanstha
      </span>
    </span>
  </span>
);

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu is "open" only for the route it was opened on, so navigating closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Scroll state: passive listener, rAF-throttled; React only re-renders when the flag flips.
  // The bar stays visible and condenses into a pill once the page is scrolled.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLLED_AT);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setOpenFor(null);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // While the menu is open: lock scroll, move focus in, trap Tab, close on Escape / when the desktop layout kicks in.
  useEffect(() => {
    if (!open) return;

    const unlock = lockBodyScroll();
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const outside = !dialog.contains(active);
      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia('(min-width: 1024px)');
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setOpenFor(null);
    };

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onBreakpoint);
      unlock();
    };
  }, [open, closeMenu]);

  // "Skip to content": works without an id on <main> (falls back to the first <main>).
  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById('main-content') ?? document.querySelector('main');
    if (!main) return;
    event.preventDefault();
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    main.style.outline = 'none';
    main.focus({ preventScroll: false });
  };

  // Over the dark hero the bar is transparent and white; once scrolled it becomes the solid white pill.
  const pill = scrolled;
  const light = !scrolled && DARK_TOP_ROUTES.includes(pathname);

  return (
    <MotionConfig reducedMotion="user">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-[max(1rem,env(safe-area-inset-top))]">
        <a
          href="#main-content"
          onClick={skipToContent}
          className="pointer-events-auto absolute left-4 top-3 z-20 -translate-y-24 rounded-md bg-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Skip to content
        </a>

        <div
          className="mx-auto max-w-7xl pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 lg:px-8"
        >
          <div
            className={`pointer-events-auto relative mx-auto flex h-14 items-center justify-between transition-[max-width,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid lg:h-16 lg:grid-cols-[1fr_auto_1fr] ${
              pill ? 'max-w-[60rem] pl-3 pr-1.5 lg:pl-4 lg:pr-2' : 'max-w-7xl pl-1 pr-0 lg:pl-4 lg:pr-0'
            }`}
          >
            {/* Pill surface. Deliberately no backdrop-filter: re-blurring the page under a fixed bar
                on every scroll frame caused heavy jank (measured on /camp). Near-opaque white instead. */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 rounded-full border transition-[opacity,box-shadow] duration-300 ${
                pill
                  ? 'border-red-900/10 bg-white/95 opacity-100 shadow-[0_16px_40px_-18px_rgba(69,10,10,0.35)]'
                  : 'border-transparent opacity-0'
              }`}
            />

            {/* Logo */}
            <PreloadLink
              href="/"
              priority="high"
              aria-label="Rudhirsetu Seva Sanstha, home"
              className={`relative flex items-center justify-self-start rounded-full py-1 pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 [-webkit-tap-highlight-color:transparent] ${
                light ? 'focus-visible:outline-white' : 'focus-visible:outline-red-700'
              }`}
            >
              <Brand tone={light ? 'light' : 'dark'} />
            </PreloadLink>

            {/* Desktop links */}
            <nav aria-label="Primary" className="relative hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {DESKTOP_LINKS.map((item) => {
                  const active = isActive(pathname, item);
                  return (
                    <li key={item.href}>
                      <PreloadLink
                        href={item.href}
                        priority={item.href === '/' || item.href === '/camp' ? 'high' : 'medium'}
                        aria-current={active ? (pathname === item.href ? 'page' : 'true') : undefined}
                        className={`relative flex h-11 items-center rounded-full px-4 text-[15px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 [-webkit-tap-highlight-color:transparent] ${
                          light
                            ? `focus-visible:outline-white ${active ? 'text-white' : 'text-white/70 hover:text-white'}`
                            : `focus-visible:outline-red-700 ${active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`
                        }`}
                      >
                        <span className="relative">{item.label}</span>
                        {active && (
                          <motion.span
                            layoutId="nav-active-dot"
                            layoutDependency={pathname}
                            aria-hidden="true"
                            className={`absolute bottom-1 left-1/2 h-1 w-1 -ml-0.5 rounded-full ${light ? 'bg-white' : 'bg-red-600'}`}
                            transition={{ type: 'spring', stiffness: 520, damping: 42 }}
                          />
                        )}
                      </PreloadLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Donate CTA + mobile menu toggle */}
            <div className="relative flex items-center justify-end gap-1.5 lg:gap-2">
              <PreloadLink
                href={DONATE_HREF}
                priority="high"
                className={`group inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[15px] font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-5 [-webkit-tap-highlight-color:transparent] ${
                  light
                    ? 'bg-white text-red-900 hover:bg-red-100 focus-visible:outline-white'
                    : 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-700'
                }`}
              >
                Donate
                <Heart
                  aria-hidden="true"
                  className={`hidden h-4 w-4 transition-transform group-hover:scale-110 min-[400px]:block ${light ? 'fill-red-900/20' : 'fill-white/30'}`}
                />
              </PreloadLink>

              <button
                ref={toggleRef}
                type="button"
                aria-expanded={open}
                aria-controls={MENU_ID}
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpenFor(open ? null : pathname)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden [-webkit-tap-highlight-color:transparent] ${
                  light
                    ? 'border-white/30 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white'
                    : 'border-red-900/10 bg-paper text-gray-900 hover:bg-red-100 focus-visible:outline-red-700'
                }`}
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu: full-screen maroon sheet */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={dialogRef}
              id={MENU_ID}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              data-lenis-prevent
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto fixed inset-x-0 top-0 z-10 h-screen overflow-x-hidden overflow-y-auto overscroll-contain bg-red-950 text-white supports-[height:100dvh]:h-[100dvh] lg:hidden"
            >
              {/* Soft glow (gradient, not a blur filter) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-24 h-[28rem] bg-[radial-gradient(22rem_14rem_at_50%_50%,rgba(220,38,38,0.3),transparent)]"
              />

              <div className="relative flex min-h-full flex-col pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pt-[max(1rem,env(safe-area-inset-top))]">
                <div className="mx-auto w-full max-w-7xl pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6">
                  <div className="flex h-14 items-center justify-between pl-3 pr-1.5">
                    <PreloadLink
                      href="/"
                      priority="high"
                      aria-label="Rudhirsetu Seva Sanstha, home"
                      onClick={() => closeMenu(false)}
                      className="flex items-center rounded-full py-1 pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]"
                    >
                      <Brand tone="light" />
                    </PreloadLink>
                    <button
                      ref={closeRef}
                      type="button"
                      aria-label="Close menu"
                      onClick={() => closeMenu(true)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]"
                    >
                      <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <nav aria-label="Mobile" className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-6 sm:px-6">
                  <ul className="border-t border-white/15">
                    {NAV_ITEMS.map((item, index) => {
                      const active = isActive(pathname, item);
                      return (
                        <motion.li
                          key={item.href}
                          className="border-b border-white/15"
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 + index * 0.05, duration: 0.5, ease: EASE_OUT }}
                        >
                          <PreloadLink
                            href={item.href}
                            priority={item.href === '/' || item.href === '/camp' || item.href === DONATE_HREF ? 'high' : 'medium'}
                            aria-current={active ? (pathname === item.href ? 'page' : 'true') : undefined}
                            onClick={() => closeMenu(false)}
                            className="group flex min-h-14 items-center gap-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:gap-6 sm:py-4 [-webkit-tap-highlight-color:transparent]"
                          >
                            <span className="w-7 shrink-0 text-sm font-semibold tabular-nums text-red-300/60">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span
                              className={`font-display text-[clamp(2rem,10vw,3.25rem)] font-bold leading-none tracking-tight transition-colors ${
                                active ? 'text-white' : 'text-white/75 group-hover:text-white'
                              }`}
                            >
                              {item.label}
                            </span>
                            {active ? (
                              <span aria-hidden="true" className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-red-400" />
                            ) : (
                              <ArrowUpRight
                                aria-hidden="true"
                                className="ml-auto h-6 w-6 shrink-0 text-white/30 transition-colors group-hover:text-white"
                              />
                            )}
                          </PreloadLink>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 text-sm text-white/50 sm:px-6">
                  <p>Rudhirsetu means bridge of blood</p>
                  <p className="shrink-0 tabular-nums">Since 2010</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
};

export default Navbar;
