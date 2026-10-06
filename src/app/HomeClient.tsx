'use client';

import { useEffect, useState } from 'react';
import Home from '../views/Home';
import LoadingScreen, { LOADING_REVEAL_MS } from '../components/LoadingScreen';
import type { ContactSettings, Event, GalleryImage } from '../types/sanity';

interface HomeClientProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  featuredImages: GalleryImage[];
  contactSettings: ContactSettings | null;
}

export default function HomeClient({
  upcomingEvents,
  pastEvents,
  featuredImages,
  contactSettings,
}: HomeClientProps) {
  // The intro curtain and hero entrance are CSS (see layout.tsx + globals.css). Only the
  // JS count-ups need to know when to start: after the curtain lifts, if it is showing.
  const [heroAnimationsReady, setHeroAnimationsReady] = useState(false);
  useEffect(() => {
    const intro = document.documentElement.classList.contains('intro');
    const timer = setTimeout(() => setHeroAnimationsReady(true), intro ? LOADING_REVEAL_MS + 200 : 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Home is always rendered, sitting underneath */}
      <Home
        heroAnimationsReady={heroAnimationsReady}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        featuredImages={featuredImages}
        contactSettings={contactSettings}
      />
      {/* First-visit curtain: server-rendered, shown and animated purely by CSS */}
      <LoadingScreen />
    </>
  );
}
