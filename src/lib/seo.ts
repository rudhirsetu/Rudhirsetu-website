// SEO utilities for dynamic meta tag management and better search results
import type { Metadata } from 'next';

// ---------------------------------------------------------------------------
// Shared metadata helper
//
// Every page builds its <head> tags with `buildMetadata` so Open Graph and
// Twitter tags stay complete and consistent (title, description, url, type,
// site name, locale, card type). The share image itself comes from the
// `opengraph-image.tsx` file in each route segment (see src/app/_og): Next
// prerenders it, adds absolute og:image tags (with type, width, height and alt)
// using `metadataBase`, and copies the image to twitter:image. That only works
// while `openGraph.images` / `twitter.images` are NOT set in a page's metadata.
// ---------------------------------------------------------------------------

export const SITE_NAME = 'Rudhirsetu Seva Sanstha';

/** Canonical origin, without a trailing slash. `NEXT_PUBLIC_BASE_URL` overrides it per environment. */
export const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org').replace(/\/+$/, '');

/** `en_IN` is the accurate Open Graph locale for an Indian audience. */
export const OG_LOCALE = 'en_IN';

/** Pages that have a preset share image in `src/app/_og/presets.ts`. */
export type OgRoute = 'home' | 'camp' | 'gallery' | 'social' | 'donations' | 'contact';

/** Turns a site path ("/camp") into an absolute URL. Absolute URLs pass through. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Shortens text to `max` characters at a word boundary, adding an ellipsis when cut. */
export function truncateText(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, '')}…`;
}

export interface BuildMetadataOptions {
  /**
   * The page title WITHOUT the site name: the root layout's title template
   * (`%s | Rudhirsetu Seva Sanstha`) appends it. Pass `{ absolute }` to opt out (home page).
   */
  title: string | { absolute: string };
  /** Title for link previews. Defaults to "<title> | Rudhirsetu Seva Sanstha". */
  ogTitle?: string;
  /** Search-result description; also used for link previews unless `ogDescription` is given. */
  description: string;
  ogDescription?: string;
  /** Site path of the page ("/camp"). Omit it for pages that must not declare a URL (404). */
  path?: string;
  /** Open Graph object type. Defaults to "website". */
  type?: 'website' | 'article';
}

/**
 * Builds the title, description, canonical URL, Open Graph and Twitter metadata for a page.
 * Spread the result into the page's `metadata` and add page-specific fields
 * (`keywords`, `robots`, ...) next to it.
 */
export function buildMetadata({
  title,
  ogTitle,
  description,
  ogDescription,
  path,
  type = 'website',
}: BuildMetadataOptions): Metadata {
  const shareTitle = ogTitle ?? (typeof title === 'string' ? `${title} | ${SITE_NAME}` : title.absolute);
  const shareDescription = ogDescription ?? description;
  const url = path === undefined ? undefined : absoluteUrl(path);

  return {
    title,
    description,
    ...(url && { alternates: { canonical: url } }),
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      ...(url && { url }),
      title: shareTitle,
      description: shareDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: shareDescription,
    },
  };
}

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export const updatePageSEO = (seo: PageSEO) => {
  // Update title
  document.title = seo.title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', seo.description);
  }
  
  // Update keywords if provided
  if (seo.keywords) {
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seo.keywords.join(', '));
    }
  }
  
  // Update canonical URL
  if (seo.canonical) {
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', seo.canonical);
    }
  }
  
  // Update Open Graph tags
  const updateOGTag = (property: string, content: string) => {
    const tag = document.querySelector(`meta[property="${property}"]`);
    if (tag) {
      tag.setAttribute('content', content);
    }
  };
  
  updateOGTag('og:title', seo.title);
  updateOGTag('og:description', seo.description);
  if (seo.canonical) updateOGTag('og:url', seo.canonical);
  if (seo.ogImage) updateOGTag('og:image', seo.ogImage);
  
  // Update Twitter tags
  const updateTwitterTag = (name: string, content: string) => {
    const tag = document.querySelector(`meta[name="${name}"]`);
    if (tag) {
      tag.setAttribute('content', content);
    }
  };
  
  updateTwitterTag('twitter:title', seo.title);
  updateTwitterTag('twitter:description', seo.description);
  if (seo.ogImage) updateTwitterTag('twitter:image', seo.ogImage);
  
  // Handle noindex
  if (seo.noindex) {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) {
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    }
  }
};

// Pre-defined SEO configurations for each page
export const pageSEOConfigs = {
  home: {
    title: 'Rudhirsetu Seva Sanstha | Blood Donation, Healthcare Support & Social Initiatives',
    description: 'Rudhirsetu Seva Sanstha drives community empowerment through blood donation, healthcare support, and transformative social initiatives. Join us in making a difference.',
    keywords: ['Rudhirsetu', 'blood donation', 'healthcare support', 'social initiatives', 'NGO India', 'community empowerment', 'cancer awareness'],
    canonical: 'https://www.rudhirsetu.org/',
    ogImage: 'https://www.rudhirsetu.org/og-thumbnail.png'
  },
  
  donations: {
    title: 'Donations - Support Rudhirsetu Seva Sanstha | Blood Donation & Healthcare',
    description: 'Support our blood donation drives, healthcare programs, and social initiatives. Make a difference in communities across India. UPI and bank transfer available.',
    keywords: ['donate to rudhirsetu', 'blood donation support', 'healthcare funding', 'NGO donations', 'charity India', 'UPI donation'],
    canonical: 'https://www.rudhirsetu.org/donations',
    ogImage: 'https://www.rudhirsetu.org/og-thumbnail.png'
  },
  
  contact: {
    title: 'Contact Us - Rudhirsetu Seva Sanstha | Get in Touch',
    description: 'Get in touch with Rudhirsetu Seva Sanstha. Contact us for partnerships, volunteering, emergency blood requirements, or support inquiries.',
    keywords: ['contact rudhirsetu', 'blood donation contact', 'emergency blood help', 'volunteer with rudhirsetu', 'NGO contact India'],
    canonical: 'https://www.rudhirsetu.org/contact',
    ogImage: 'https://www.rudhirsetu.org/og-thumbnail.png'
  },
  
  camp: {
    title: 'Our Camps - Rudhirsetu Seva Sanstha | Healthcare & Blood Donation Initiatives',
    description: 'See our blood donation drives, healthcare camps, and community initiatives across India. Join Rudhirsetu Seva Sanstha in making a difference.',
    keywords: ['health camps', 'blood donation camps', 'healthcare initiatives', 'community camps', 'medical camps', 'NGO camps'],
    canonical: 'https://www.rudhirsetu.org/camp',
    ogImage: 'https://www.rudhirsetu.org/og-thumbnail.png'
  },
  
  gallery: {
    title: 'Photo Gallery - Rudhirsetu Seva Sanstha | Blood Donation Events',
    description: 'View photos from our blood donation drives, healthcare camps, and community events across India. See our work in action.',
    keywords: ['rudhirsetu photos', 'blood donation events', 'healthcare camps photos', 'NGO gallery', 'community events'],
    canonical: 'https://www.rudhirsetu.org/gallery',
    ogImage: 'https://www.rudhirsetu.org/og-thumbnail.png'
  },
  
  social: {
    title: 'Social Media - Rudhirsetu Seva Sanstha | Connect With Us',
    description: 'Connect with Rudhirsetu on social media. Follow our latest updates, events, and community initiatives on Facebook, Instagram, Twitter, and YouTube.',
    keywords: ['rudhirsetu social media', 'follow rudhirsetu', 'NGO social media', 'blood donation updates', 'community news'],
    canonical: 'https://www.rudhirsetu.org/social',
    ogImage: 'https://www.rudhirsetu.org/og-thumbnail.png'
  }
} as const;

// Function to generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};



// Function to generate Event structured data
export const generateEventStructuredData = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: {name: string, address: string};
  organizer: string;
  url?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "location": event.location ? {
      "@type": "Place",
      "name": event.location.name,
      "address": event.location.address
    } : undefined,
    "organizer": {
      "@type": "Organization",
      "name": event.organizer,
      "url": "https://www.rudhirsetu.org"
    },
    "url": event.url
  };
}; 