'use client';

import { useState, useEffect } from 'react';
import Home from '../views/Home';
import LoadingScreen from '../components/LoadingScreen';

export default function HomeClient() {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    
    if (!hasVisited) {
      setShowLoading(true);
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
      <Home />
      {/* Loading screen sits on top and splits to reveal */}
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
    </>
  );
} 