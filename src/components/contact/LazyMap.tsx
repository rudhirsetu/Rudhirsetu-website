'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, MapPin, Move } from 'lucide-react';
import { safeMapsEmbedUrl } from '../../lib/maps';

interface LazyMapProps {
  src?: string | null;
  title: string;
}

/**
 * Google Maps embed in a rounded frame.
 * - The iframe is only mounted once the frame is near the viewport.
 * - It starts "paused" (pointer-events: none) so touch scrolling and the mouse wheel are never
 *   trapped by the map; visitors opt in with the "Explore map" button and release with "Done".
 */
export default function LazyMap({ src: rawSrc, title }: LazyMapProps) {
  // Only Google Maps embeds are allowed into the iframe (the URL comes from the CMS).
  const src = safeMapsEmbedUrl(rawSrc);
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !src) return;

    // No IntersectionObserver (very old browsers): just load it.
    if (typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setShouldLoad(true));
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div
      ref={frameRef}
      className="relative h-full min-h-[22rem] overflow-hidden rounded-3xl border border-red-900/10 bg-paper sm:min-h-[26rem] lg:min-h-[34rem]"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="p-8 text-center">
          <MapPin className="mx-auto mb-3 h-10 w-10 text-red-700/40" aria-hidden="true" />
          <p className="text-gray-500">{src ? 'Loading map...' : 'Map not available'}</p>
        </div>
      </div>

      {src && shouldLoad && (
        <>
          <iframe
            src={src}
            title={title}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className="absolute inset-0 h-full w-full border-0"
            style={{ pointerEvents: interactive ? 'auto' : 'none' }}
          />
          <button
            type="button"
            onClick={() => setInteractive((value) => !value)}
            className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-red-900/15 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            {interactive ? (
              <Check className="h-4 w-4 text-red-700" aria-hidden="true" />
            ) : (
              <Move className="h-4 w-4 text-red-700" aria-hidden="true" />
            )}
            {interactive ? 'Done' : 'Explore map'}
          </button>
        </>
      )}
    </div>
  );
}
