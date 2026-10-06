'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';

interface TransitionState {
  isTransitioning: boolean;
  fromCardId: string | null;
  cardRect: DOMRect | null;
}

interface PageTransitionContextType {
  transitionState: TransitionState;
  startTransition: (cardId: string, cardRect: DOMRect) => void;
  endTransition: () => void;
}

const IDLE_STATE: TransitionState = {
  isTransitioning: false,
  fromCardId: null,
  cardRect: null,
};

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [transitionState, setTransitionState] = useState<TransitionState>(IDLE_STATE);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearEndTimer = useCallback(() => {
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }
  }, []);

  // Stable callbacks + memoised value: consumers (every EventCard) only re-render
  // when the transition state actually changes, not whenever the provider does.
  const startTransition = useCallback((cardId: string, cardRect: DOMRect) => {
    // A pending "end" from the previous transition must not reset this new one.
    clearEndTimer();
    setTransitionState({ isTransitioning: true, fromCardId: cardId, cardRect });
  }, [clearEndTimer]);

  const endTransition = useCallback(() => {
    clearEndTimer();
    // Delay to allow transition to complete
    endTimerRef.current = setTimeout(() => {
      endTimerRef.current = null;
      setTransitionState(IDLE_STATE);
    }, 800);
  }, [clearEndTimer]);

  useEffect(() => clearEndTimer, [clearEndTimer]);

  const value = useMemo(
    () => ({ transitionState, startTransition, endTransition }),
    [transitionState, startTransition, endTransition]
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
}
