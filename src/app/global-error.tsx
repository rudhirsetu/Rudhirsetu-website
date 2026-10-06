'use client';

import { useEffect } from 'react';

/**
 * Last-resort boundary: replaces the root layout when the layout itself fails, so the
 * site's CSS and fonts may be missing. Inline styles only, in the brand palette
 * (maroon #450A0A, rose #FCA5A5, action red #DC2626; see docs/BRAND.md).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  const button = {
    display: 'inline-block',
    padding: '0.875rem 1.5rem',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as const;

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(220,38,38,0.28), transparent 70%), #450A0A',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: '1.5rem',
        }}
      >
        <title>Something went wrong | Rudhirsetu Seva Sanstha</title>
        <main style={{ maxWidth: '34rem', textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FCA5A5',
            }}
          >
            Rudhirsetu Seva Sanstha
          </p>
          <h1
            style={{
              margin: '1rem 0',
              fontSize: 'clamp(2.25rem, 6vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Something went wrong
          </h1>
          <p style={{ margin: '0 0 2rem', fontSize: '1.125rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
            The site couldn&apos;t load just now. Please try again in a moment.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={reset} style={{ ...button, border: 'none', background: '#ffffff', color: '#7F1D1D' }}>
              Try again
            </button>
            {/* A full page load, not a client navigation: the app shell is what failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ ...button, border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff' }}>
              Back home
            </a>
          </div>
          {error.digest && (
            <p style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
