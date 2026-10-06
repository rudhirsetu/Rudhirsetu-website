'use client';

import { TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Staging-only notice. Hidden by default (as before); set
 * NEXT_PUBLIC_SHOW_DEV_WARNING=true to show it on a test deployment.
 * It sits at the bottom of the screen so it never covers the navbar.
 */
const DevelopmentWarning = () => {
  const [isVisible, setIsVisible] = useState(process.env.NEXT_PUBLIC_SHOW_DEV_WARNING === 'true');

  if (!isVisible) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/15 bg-red-950 text-white pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <TriangleAlert aria-hidden="true" className="h-5 w-5 shrink-0 text-red-300" />
        <p className="flex-1 text-sm leading-snug text-white/90">
          <span className="font-semibold text-white">Development version.</span>{' '}
          Data shown is for testing purposes only. This is not the official website.
        </p>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss warning"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default DevelopmentWarning;
