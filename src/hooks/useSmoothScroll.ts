'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Custom hook for implementing smooth scroll with damping
 * @param maxSpeed - Maximum scroll speed (default: 0.75)
 * @param damping - Damping factor for scroll smoothness (default: 0.2)
 */
export function useSmoothScroll(maxSpeed: number = 0.75, damping: number = 0.2) {
  useEffect(() => {
    // Honor reduced-motion: fall back to native scrolling, no RAF loop.
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (prefersReducedMotion) return;

    // Initialize Lenis with custom configuration
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: damping,
      smoothWheel: true,
      wheelMultiplier: maxSpeed,
    });

    // Request animation frame loop
    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Cleanup on unmount: cancel the loop, then destroy the instance.
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [maxSpeed, damping]);
}
