'use client';

import { useEffect } from 'react';

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

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 50%, #fef2f2 100%)',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          color: '#111827',
          padding: '1rem',
        }}
      >
        <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '2rem' }}>
            A critical error occurred. Please try reloading the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '1rem 2rem',
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
