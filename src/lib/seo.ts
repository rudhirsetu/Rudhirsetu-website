// SEO utilities for dynamic meta tag management and better search results

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
  
  impact: {
    title: 'Our Impact - Rudhirsetu Seva Sanstha | Community Healthcare Initiatives',
    description: 'See the transformative impact of Rudhirsetu\'s blood donation drives, healthcare programs, and community initiatives across India. Lives saved, communities empowered.',
    keywords: ['rudhirsetu impact', 'blood donation results', 'healthcare impact', 'community programs', 'NGO achievements', 'lives saved'],
    canonical: 'https://www.rudhirsetu.org/impact',
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

// Function to generate FAQ structured data
export const generateFAQStructuredData = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
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