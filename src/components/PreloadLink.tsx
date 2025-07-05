import React, { useRef, useCallback } from 'react';
import Link from 'next/link';

interface PreloadLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
  preloadDelay?: number;
  prefetch?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: unknown;
}

// Cache to prevent duplicate preloads
const preloadCache = new Set<string>();

// Preload function that works with App Router
const preloadRoute = async (href: string) => {
  if (preloadCache.has(href)) return;
  
  try {
    preloadCache.add(href);
    
    // For App Router, we'll use manual resource preloading
    if (typeof window !== 'undefined') {
      // Preload the page as a module
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
      
      // DNS prefetch for external resources
      const dnsLink = document.createElement('link');
      dnsLink.rel = 'dns-prefetch';
      dnsLink.href = new URL(href, window.location.origin).origin;
      document.head.appendChild(dnsLink);
    }
  } catch (error) {
    console.warn('Preload failed for:', href, error);
    preloadCache.delete(href);
  }
};

const PreloadLink: React.FC<PreloadLinkProps> = ({
  href,
  children,
  className = '',
  priority = 'medium',
  preloadDelay = 150,
  prefetch = true,
  onClick,
  ...props
}) => {
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasPreloaded = useRef(false);

  // Determine prefetch strategy based on priority
  const shouldPrefetch = priority === 'high' ? true : prefetch;
  const hoverDelay = priority === 'high' ? 50 : preloadDelay;

  const handleMouseEnter = useCallback(() => {
    if (hasPreloaded.current) return;

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set up delayed preload
    hoverTimeoutRef.current = setTimeout(() => {
      if (!hasPreloaded.current && href) {
        hasPreloaded.current = true;
        preloadRoute(href);
      }
    }, hoverDelay);
  }, [href, hoverDelay]);

  const handleMouseLeave = useCallback(() => {
    // Clear timeout if user moves away quickly
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleFocus = useCallback(() => {
    // Preload immediately on focus for accessibility
    if (!hasPreloaded.current && href) {
      hasPreloaded.current = true;
      preloadRoute(href);
    }
  }, [href]);

  // Enhanced click handler for even faster navigation
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
    
    // Ensure preload happens immediately on click if not already done
    if (!hasPreloaded.current && href) {
      preloadRoute(href);
    }
  }, [href, onClick]);

  return (
    <Link
      href={href}
      prefetch={shouldPrefetch}
      {...props}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default PreloadLink; 