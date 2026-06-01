'use client';

import { useState, useEffect } from 'react';
import Home from '../views/Home';
import LoadingScreen from '../components/LoadingScreen';
import type { Event } from '../types/sanity';

interface HomeClientProps {
  initialUpcomingEvents?: Event[];
  initialPastEvents?: Event[];
}

export default function HomeClient({
  initialUpcomingEvents = [],
  initialPastEvents = [],
}: HomeClientProps) {
  const [showLoading, setShowLoading] = useState(false);
  const [heroAnimationsReady, setHeroAnimationsReady] = useState(false);

  useEffect(() => {
    // Check if this is the first visit in this session. sessionStorage can throw
    // on some browsers (e.g. Safari with storage blocked / private mode), so guard
    // it — otherwise heroAnimationsReady would never flip and the hero would stay
    // invisible (opacity 0).
    let hasVisited: string | null = null;
    try {
      hasVisited = sessionStorage.getItem('hasVisitedHome');
    } catch {
      // ignore — treat as a first visit
    }

    if (!hasVisited) {
      setShowLoading(true);
      // Trigger Hero animations right when split animation begins
      // Progress: 700ms + 100ms pause = 800ms
      const timer = setTimeout(() => {
        setHeroAnimationsReady(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // If no loading screen, start Hero animations immediately
      setHeroAnimationsReady(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    // Mark as visited in session storage (guarded — may be blocked on Safari)
    try {
      sessionStorage.setItem('hasVisitedHome', 'true');
    } catch {
      // ignore — the loading screen simply shows again next visit
    }
    setShowLoading(false);
  };

  return (
    <>
      {/* Home is always rendered, sitting underneath */}
      <Home
        heroAnimationsReady={heroAnimationsReady}
        initialUpcomingEvents={initialUpcomingEvents}
        initialPastEvents={initialPastEvents}
      />
      {/* Loading screen sits on top and splits to reveal */}
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
    </>
  );
} 