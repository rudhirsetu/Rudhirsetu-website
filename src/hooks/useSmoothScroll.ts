'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';

/**
 * Custom hook for implementing smooth scroll with damping.
 *
 * Only active for mouse / trackpad users who haven't asked for reduced motion.
 * Touch devices (iOS, Android) and `prefers-reduced-motion: reduce` keep fully
 * native scrolling, which is already smooth there and gets momentum, rubber
 * banding and overscroll behaviour that a JS scroller can't match. Lenis is
 * loaded lazily so those visitors never download it.
 *
 * @param maxSpeed - Maximum scroll speed (default: 0.75)
 * @param damping - Damping factor for scroll smoothness (default: 0.2)
 */
export function useSmoothScroll(maxSpeed: number = 0.75, damping: number = 0.2) {
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Primary input is touch (phones, tablets) or there is no hover capability.
    const touchQuery = window.matchMedia('(pointer: coarse), (hover: none)');

    let lenis: Lenis | null = null;
    let cancelled = false;

    const stop = () => {
      lenis?.destroy();
      lenis = null;
    };

    const start = async () => {
      if (lenis || reducedMotionQuery.matches || touchQuery.matches) return;

      const { default: LenisCtor } = await import('lenis');
      // Re-check: the component may have unmounted, or the preference changed, while loading.
      if (cancelled || lenis || reducedMotionQuery.matches || touchQuery.matches) return;

      lenis = new LenisCtor({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lerp: damping,
        smoothWheel: true,
        wheelMultiplier: maxSpeed,
        syncTouch: false, // never hijack touch scrolling
        autoRaf: true, // Lenis owns (and cancels on destroy) its requestAnimationFrame loop
        // Cancel in-flight inertia when an internal link is clicked; otherwise Lenis keeps
        // easing toward the old page's offset after Next.js resets to top and drags the new page down.
        stopInertiaOnNavigate: true,
      });
    };

    const update = () => {
      if (reducedMotionQuery.matches || touchQuery.matches) stop();
      else void start();
    };

    void start();

    // addEventListener on MediaQueryList is missing in Safari < 14.
    const queries = [reducedMotionQuery, touchQuery];
    for (const query of queries) {
      if (query.addEventListener) query.addEventListener('change', update);
      else query.addListener?.(update);
    }

    return () => {
      cancelled = true;
      for (const query of queries) {
        if (query.removeEventListener) query.removeEventListener('change', update);
        else query.removeListener?.(update);
      }
      stop();
    };
  }, [maxSpeed, damping]);
}
