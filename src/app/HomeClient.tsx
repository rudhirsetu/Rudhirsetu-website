'use client';

import { useState, useEffect } from 'react';
import Home from '../views/Home';
import LoadingScreen from '../components/LoadingScreen';

export default function HomeClient() {
  const [showLoading, setShowLoading] = useState(false);
  const [heroAnimationsReady, setHeroAnimationsReady] = useState(false);

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    
    if (!hasVisited) {
      setShowLoading(true);
      // Trigger Hero animations right when split animation begins
      // Progress: 2000ms + 100ms delay = 2100ms
      setTimeout(() => {
        setHeroAnimationsReady(true);
      }, 2100);
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
      <Home heroAnimationsReady={heroAnimationsReady} />
      {/* Loading screen sits on top and splits to reveal */}
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
    </>
  );
} 