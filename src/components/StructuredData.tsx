import { useEffect } from 'react';

interface StructuredDataProps {
  data: object;
  id?: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data, id }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id || `structured-data-${Date.now()}`;
    script.textContent = JSON.stringify(data);
    
    // Remove existing script with same ID if it exists
    if (id) {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptElement = document.getElementById(script.id);
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [data, id]);

  return null;
};

// Pre-defined structured data for common pages
export const DonationsPageData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.rudhirsetu.org/donations#webpage",
  "url": "https://www.rudhirsetu.org/donations",
  "name": "Donations - Support Rudhirsetu Seva Sanstha",
  "description": "Support our blood donation drives, healthcare programs, and social initiatives. Make a difference in communities across India.",
  "isPartOf": {
    "@id": "https://www.rudhirsetu.org/#website"
  },
  "about": {
    "@type": "DonateAction",
    "recipient": {
      "@id": "https://www.rudhirsetu.org/#organization"
    },
    "name": "Support Community Healthcare Initiatives"
  },
  "mainEntity": {
    "@type": "DonateAction",
    "name": "Donate to Rudhirsetu",
    "recipient": {
      "@id": "https://www.rudhirsetu.org/#organization"
    },
    "description": "Support blood donation drives, healthcare programs, and social welfare initiatives"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.rudhirsetu.org/"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Donations",
        "item": "https://www.rudhirsetu.org/donations"
      }
    ]
  }
};

export const ContactPageData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://www.rudhirsetu.org/contact#webpage",
  "url": "https://www.rudhirsetu.org/contact",
  "name": "Contact Us - Rudhirsetu Seva Sanstha",
  "description": "Get in touch with Rudhirsetu Seva Sanstha. Contact us for partnerships, volunteering, or support inquiries.",
  "isPartOf": {
    "@id": "https://www.rudhirsetu.org/#website"
  },
  "mainEntity": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "name": "Rudhirsetu Customer Service",
    "url": "https://www.rudhirsetu.org/contact",
    "availableLanguage": ["English", "Hindi"]
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home", 
        "item": "https://www.rudhirsetu.org/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact",
        "item": "https://www.rudhirsetu.org/contact"
      }
    ]
  }
};

export const ImpactPageData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.rudhirsetu.org/impact#webpage",
  "url": "https://www.rudhirsetu.org/impact",
  "name": "Our Impact - Rudhirsetu Seva Sanstha",
  "description": "See the transformative impact of Rudhirsetu's blood donation drives, healthcare programs, and community initiatives across India.",
  "isPartOf": {
    "@id": "https://www.rudhirsetu.org/#website"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "Impact Areas",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Blood Donation Impact",
        "description": "Lives saved through blood donation drives"
      },
      {
        "@type": "ListItem",
        "position": 2, 
        "name": "Healthcare Support",
        "description": "Medical aid and healthcare assistance provided"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Community Programs",
        "description": "Social initiatives and community empowerment"
      }
    ]
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.rudhirsetu.org/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Impact",
        "item": "https://www.rudhirsetu.org/impact"
      }
    ]
  }
};

export const GalleryPageData = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "@id": "https://www.rudhirsetu.org/gallery#webpage",
  "url": "https://www.rudhirsetu.org/gallery",
  "name": "Photo Gallery - Rudhirsetu Seva Sanstha",
  "description": "View photos from our blood donation drives, healthcare camps, and community events across India.",
  "isPartOf": {
    "@id": "https://www.rudhirsetu.org/#website"
  },
  "about": {
    "@id": "https://www.rudhirsetu.org/#organization"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.rudhirsetu.org/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Gallery",
        "item": "https://www.rudhirsetu.org/gallery"
      }
    ]
  }
};

export const SocialPageData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.rudhirsetu.org/social#webpage",
  "url": "https://www.rudhirsetu.org/social",
  "name": "Social Media - Rudhirsetu Seva Sanstha",
  "description": "Connect with Rudhirsetu on social media. Follow our latest updates, events, and community initiatives.",
  "isPartOf": {
    "@id": "https://www.rudhirsetu.org/#website"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "Social Media Profiles",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Facebook",
        "url": "https://www.facebook.com/rudhirsetu"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Instagram", 
        "url": "https://www.instagram.com/rudhirsetu"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Twitter",
        "url": "https://twitter.com/rudhirsetu"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "YouTube",
        "url": "https://www.youtube.com/rudhirsetu"
      }
    ]
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.rudhirsetu.org/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Social",
        "item": "https://www.rudhirsetu.org/social"
      }
    ]
  }
}; 