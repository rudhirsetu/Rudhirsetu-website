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
    // Initialize Lenis with custom configuration
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: damping,
      smoothWheel: true,
      wheelMultiplier: maxSpeed,
    });

    // Request animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, [maxSpeed, damping]);
}
