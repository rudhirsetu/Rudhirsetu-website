'use client';

import React from 'react';
import Link from 'next/link';

interface PreloadLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  /**
   * `high` opts the route into a full prefetch as soon as the link is in view.
   * Everything else uses Next's default (auto) prefetching, which already warms
   * the route on viewport entry and again on hover / touch intent.
   */
  priority?: 'high' | 'medium' | 'low';
  /** @deprecated Hover prefetching is handled by next/link; kept for API compatibility. */
  preloadDelay?: number;
  prefetch?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: unknown;
}

/**
 * Thin wrapper around `next/link`.
 *
 * It used to inject extra `<link rel="prefetch">` / `dns-prefetch` tags on
 * hover. That re-downloaded the HTML document next/link had already prefetched
 * (and a same-origin DNS prefetch does nothing), and it only ever fired on
 * hover, so touch devices got nothing from it. next/link handles viewport,
 * hover, focus and touch intent itself.
 */
const PreloadLink: React.FC<PreloadLinkProps> = ({
  href,
  children,
  className = '',
  priority = 'medium',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preloadDelay,
  prefetch,
  onClick,
  ...props
}) => {
  const shouldPrefetch = priority === 'high' ? true : prefetch;

  return (
    <Link
      {...props}
      href={href}
      prefetch={shouldPrefetch}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default PreloadLink;
