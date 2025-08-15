'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    fromCardId: null,
    cardRect: null,
  });

  const startTransition = (cardId: string, cardRect: DOMRect) => {
    setTransitionState({
      isTransitioning: true,
      fromCardId: cardId,
      cardRect,
    });
  };

  const endTransition = () => {
    // Delay to allow transition to complete
    setTimeout(() => {
      setTransitionState({
        isTransitioning: false,
        fromCardId: null,
        cardRect: null,
      });
    }, 800);
  };

  return (
    <PageTransitionContext.Provider value={{ transitionState, startTransition, endTransition }}>
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