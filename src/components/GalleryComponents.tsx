'use client';

import { useState, useEffect, memo, useRef, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GalleryImage } from '../types/sanity';
import { formatCategory, imageAlt, imageSrc, imageSrcSet } from './gallery/image-utils';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const subscribeReducedMotion = (onChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener?.('change', onChange);
  return () => query.removeEventListener?.('change', onChange);
};
const getReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(REDUCED_MOTION_QUERY).matches;

const pad = (n: number) => String(n).padStart(2, '0');

/** `:focus-visible` check that never throws on older engines. */
const isFocusVisible = (el: EventTarget) => {
  try {
    return (el as HTMLElement).matches(':focus-visible');
  } catch {
    return true;
  }
};

/* -------------------------------------------------------------------------- */
/*  Featured carousel                                                         */
/* -------------------------------------------------------------------------- */

const CAROUSEL_WIDTHS = [800, 1200, 1600];

const CarouselArrow = ({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
}) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous photo' : 'Next photo'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-red-900/15 bg-white text-red-800 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};

const FeaturedCarouselComponent = ({
  featuredImages,
  onImageClick,
  autoplayInterval = 8000,
  aspectRatio = 'md:aspect-[21/9] aspect-[4/3]',
  priority = false,
}: {
  featuredImages: GalleryImage[];
  onImageClick?: (image: GalleryImage, index: number) => void;
  autoplayInterval?: number;
  aspectRatio?: string;
  /** Load the first slide eagerly (use when the carousel is above the fold). */
  priority?: boolean;
}) => {
  const count = featuredImages.length;
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // Respect reduced-motion: no autoplay.
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const justSwiped = useRef(false);

  const active = count > 0 ? Math.min(current, count - 1) : 0;

  const go = useCallback(
    (index: number) => {
      if (count === 0) return;
      setCurrent(((index % count) + count) % count);
    },
    [count],
  );


  // Only advance while on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const autoplay = count > 1 && isVisible && !isHovered && !isFocused && !reduceMotion;

  // Restarts whenever the slide changes, so manual navigation resets the timer.
  useEffect(() => {
    if (!autoplay) return;
    const id = setTimeout(() => setCurrent((c) => (c + 1) % count), autoplayInterval);
    return () => clearTimeout(id);
  }, [autoplay, active, count, autoplayInterval]);

  if (count === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || count < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      justSwiped.current = true;
      setTimeout(() => {
        justSwiped.current = false;
      }, 350);
      go(active + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured photos"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setIsHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setIsHovered(false)}
      onFocus={(e) => setIsFocused(isFocusVisible(e.target))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsFocused(false);
      }}
    >
      <div
        className={`relative isolate touch-pan-y overflow-hidden rounded-3xl border border-red-900/10 bg-red-950/5 ${aspectRatio}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-live={autoplay ? 'off' : 'polite'}
      >
        {featuredImages.map((image, index) => {
          const isActive = index === active;
          const distance = Math.abs(index - active);
          // Only keep the current slide and its neighbours in the DOM.
          if (Math.min(distance, count - distance) > 1) return null;

          const eager = priority && index === 0;
          return (
            <div
              key={image._id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              inert={!isActive}
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (justSwiped.current) return;
                  onImageClick?.(image, active);
                }}
                aria-label={`View photo${image.title ? `: ${image.title}` : ''}`}
                className="group/slide relative block h-full w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white"
              >
                <img
                  src={imageSrc(image.image, 1200)}
                  srcSet={imageSrcSet(image.image, CAROUSEL_WIDTHS)}
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  alt={imageAlt(image, 'Featured photo')}
                  decoding="async"
                  loading={eager ? 'eager' : 'lazy'}
                  fetchPriority={eager ? 'high' : undefined}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/slide:scale-[1.03]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-red-950/10 to-transparent"
                />
                {(image.title || image.description) && (
                  <span className="absolute inset-x-0 bottom-0 block p-5 text-white sm:p-8 lg:p-10">
                    {image.title && (
                      <span className="block max-w-3xl font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                        {image.title}
                      </span>
                    )}
                    {image.description && (
                      <span className="mt-2 line-clamp-2 block max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                        {image.description}
                      </span>
                    )}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-between gap-6 sm:mt-5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            {featuredImages.map((image, index) => (
              <button
                key={image._id}
                type="button"
                onClick={() => go(index)}
                aria-label={`Go to photo ${index + 1}`}
                aria-current={index === active ? 'true' : undefined}
                className="group/dot flex h-8 min-w-0 max-w-16 flex-1 items-center focus-visible:outline-none"
              >
                <span
                  className={`block h-1 w-full rounded-full transition-colors group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-red-700 group-focus-visible/dot:ring-offset-2 ${
                    index === active ? 'bg-red-700' : 'bg-red-900/15 group-hover/dot:bg-red-900/30'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm font-semibold tabular-nums text-gray-500 sm:block">
              <span className="text-gray-900">{pad(active + 1)}</span> / {pad(count)}
            </span>
            <CarouselArrow direction="prev" onClick={() => go(active - 1)} />
            <CarouselArrow direction="next" onClick={() => go(active + 1)} />
          </div>
        </div>
      )}
    </div>
  );
};

FeaturedCarouselComponent.displayName = 'FeaturedCarousel';
export const FeaturedCarousel = memo(FeaturedCarouselComponent);

/* -------------------------------------------------------------------------- */
/*  Lightbox                                                                  */
/* -------------------------------------------------------------------------- */

const LIGHTBOX_WIDTH = 1600;
const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

const LightboxImage = ({ item }: { item: GalleryImage }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-center text-white/60">
        This photo could not be loaded.
      </div>
    );
  }

  return (
    <img
      ref={(el) => {
        // Cached images can finish before React attaches onLoad.
        if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
      }}
      src={imageSrc(item.image, LIGHTBOX_WIDTH)}
      alt={imageAlt(item)}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};

const LightboxNav = ({
  direction,
  onClick,
  className = '',
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  className?: string;
}) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous photo' : 'Next photo'}
      className={`h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white hover:text-red-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-950 ${className}`}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
};

export const ImageLightbox = ({
  selectedImage,
  images,
  selectedIndex,
  onClose,
  onPrev,
  onNext,
}: {
  selectedImage: GalleryImage | null;
  images: GalleryImage[];
  selectedIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const isOpen = selectedImage !== null;
  const total = images.length;
  const hasMany = total > 1;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const latest = useRef({ onClose, onPrev, onNext, hasMany });

  useEffect(() => {
    latest.current = { onClose, onPrev, onNext, hasMany };
  });

  // Lock page scroll (html is the scroll root on this site) without moving the page.
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPaddingRight;
    };
  }, [isOpen]);

  // iOS Safari: stop touch-drags from scrolling the page behind the overlay.
  useEffect(() => {
    const el = dialogRef.current;
    if (!isOpen || !el) return;
    const block = (e: TouchEvent) => e.preventDefault();
    el.addEventListener('touchmove', block, { passive: false });
    return () => el.removeEventListener('touchmove', block);
  }, [isOpen]);

  // Focus management: move focus in, restore it on close.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  // Keyboard: Escape, arrows, focus trap.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const { onClose: close, onPrev: prev, onNext: next, hasMany: many } = latest.current;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowLeft' && many) {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight' && many) {
        e.preventDefault();
        next();
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement;
        if (e.shiftKey && (current === first || !dialogRef.current.contains(current))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (current === last || !dialogRef.current.contains(current))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Warm the cache for the neighbours so next/prev feel instant.
  useEffect(() => {
    if (!isOpen || !hasMany) return;
    [selectedIndex - 1, selectedIndex + 1].forEach((i) => {
      const neighbour = images[(i + total) % total];
      if (neighbour) {
        const img = new window.Image();
        img.src = imageSrc(neighbour.image, LIGHTBOX_WIDTH);
      }
    });
  }, [isOpen, hasMany, selectedIndex, images, total]);

  if (!selectedImage || typeof document === 'undefined') return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !hasMany) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) onNext();
      else onPrev();
    }
  };

  const closeOnBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const { title, description, category } = selectedImage;

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer${title ? `: ${title}` : ''}`}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={closeOnBackdrop}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[100] flex flex-col bg-red-950/95 text-white"
    >
      {/* Top bar */}
      <div
        onClick={closeOnBackdrop}
        className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6"
      >
        <p className="font-display text-lg font-semibold tabular-nums">
          <span>{pad(selectedIndex + 1)}</span>
          <span className="text-white/60"> / {pad(total)}</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-950"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Stage */}
      <div className="relative min-h-0 flex-1 px-4 sm:px-6 md:px-24">
        <div className="relative h-full w-full">
          <LightboxImage key={selectedImage._id} item={selectedImage} />
        </div>
        {hasMany && (
          <>
            <LightboxNav
              direction="prev"
              onClick={onPrev}
              className="absolute left-6 top-1/2 hidden -translate-y-1/2 md:flex"
            />
            <LightboxNav
              direction="next"
              onClick={onNext}
              className="absolute right-6 top-1/2 hidden -translate-y-1/2 md:flex"
            />
          </>
        )}
      </div>

      {/* Caption + touch controls */}
      <div
        onClick={closeOnBackdrop}
        className="shrink-0 px-4 pb-6 pt-5 sm:px-6 sm:pb-8"
      >
        <div className="mx-auto flex max-w-3xl items-end justify-between gap-4" onClick={closeOnBackdrop}>
          <div className="min-w-0" aria-live="polite">
            {category && (
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                {formatCategory(category)}
              </p>
            )}
            {title && (
              <h2 className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-white/70 sm:text-base">
                {description}
              </p>
            )}
          </div>
          {hasMany && (
            <div className="flex shrink-0 gap-2 md:hidden">
              <LightboxNav direction="prev" onClick={onPrev} className="flex" />
              <LightboxNav direction="next" onClick={onNext} className="flex" />
            </div>
          )}
        </div>
      </div>
    </motion.div>,
    document.body,
  );
};
