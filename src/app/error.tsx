'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to logging/monitoring.
    console.error('Route error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-xl mx-auto text-center">
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="bg-white rounded-full p-6 shadow-lg border-4 border-red-200 inline-flex">
            <Heart className="w-12 h-12 text-red-600 animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We hit an unexpected error while loading this page. You can try again,
          and if the problem persists, please let us know.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
