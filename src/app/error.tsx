'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { Accent, Eyebrow } from '../components/ui/Section';
import { btnPrimary, btnSecondary, focusRing } from '../components/events/styles';

/** Route error boundary: shown inside the normal layout (navbar + footer) when a page throws. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error boundary caught:', error);
  }, [error]);

  return (
    <section className="flex min-h-[80vh] supports-[height:100svh]:min-h-[85svh] items-center bg-white px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <img
          src="/images/illustrations/not-found.webp"
          alt=""
          aria-hidden="true"
          width={530}
          height={720}
          className="mb-8 h-48 w-auto sm:h-60"
        />
        <Eyebrow center>Something went wrong</Eyebrow>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          We hit a <Accent>snag</Accent>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
          This page didn&apos;t load properly. Please try again. If it keeps happening, call our 24/7 line or
          drop us a message.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button type="button" onClick={reset} className={btnPrimary}>
            <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-45" />
            Try again
          </button>
          <Link href="/" className={btnSecondary}>
            Back home
          </Link>
        </div>

        <p className="mt-12 w-full border-t border-red-900/10 pt-6 text-sm text-gray-500">
          Need blood urgently?{' '}
          <Link
            href="/contact"
            className={`font-semibold text-red-700 underline decoration-red-700/30 underline-offset-4 hover:text-red-800 ${focusRing}`}
          >
            Contact us
          </Link>
          {error.digest && <span className="mt-2 block text-xs text-gray-400">Reference: {error.digest}</span>}
        </p>
      </div>
    </section>
  );
}
