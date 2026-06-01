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
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    
    if (!hasVisited) {
      setShowLoading(true);
      // Trigger Hero animations right when split animation begins
      // Progress: 700ms + 100ms pause = 800ms
      setTimeout(() => {
        setHeroAnimationsReady(true);
      }, 800);
    } else {
      // If no loading screen, start Hero animations immediately
      setHeroAnimationsReady(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    // Mark as visited in session storage
    sessionStorage.setItem('hasVisitedHome', 'true');
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