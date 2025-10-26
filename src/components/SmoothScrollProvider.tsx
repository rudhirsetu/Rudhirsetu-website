'use client';

import { useSmoothScroll } from '../hooks/useSmoothScroll';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Client component that enables smooth scrolling with damping for the entire app
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  // Initialize smooth scroll with specified parameters
  useSmoothScroll(0.75, 0.2);

  return <>{children}</>;
}
