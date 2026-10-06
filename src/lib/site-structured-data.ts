/**
 * Site-wide JSON-LD (Organization, WebSite, home WebPage, breadcrumb and
 * services) rendered once from the root layout. Kept out of layout.tsx so the
 * layout stays readable; per-page data lives in `structured-data.ts`.
 */
export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NGO",
      "@id": "https://www.rudhirsetu.org/#organization",
      "name": "Rudhirsetu Seva Sanstha",
      "alternateName": [
        "Rudhirsetu",
        "Rudhir Setu",
        "Rudhirsetu NGO"
      ],
      "url": "https://www.rudhirsetu.org/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.rudhirsetu.org/images/logo-dark.svg",
        "width": 300,
        "height": 300,
        "caption": "Rudhirsetu Seva Sanstha Logo"
      },
      "image": [
        {
          "@type": "ImageObject",
          "url": "https://www.rudhirsetu.org/images/logo-dark.svg",
          "width": 300,
          "height": 300,
          "caption": "Rudhirsetu Seva Sanstha Logo"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.rudhirsetu.org/favicon.ico",
          "width": 48,
          "height": 48,
          "caption": "Rudhirsetu Favicon"
        }
      ],
      "description": "Rudhirsetu Seva Sanstha is a leading NGO empowering communities through blood donation drives, comprehensive healthcare support, cancer awareness programs, and transformative social initiatives since 2010.",
      "foundingDate": "2010",
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "knowsAbout": [
        "Blood Donation",
        "Healthcare Support",
        "Social Initiatives",
        "Community Empowerment",
        "Cancer Awareness",
        "Health Camps",
        "Medical Aid",
        "Social Welfare"
      ],
      "keywords": "blood donation, healthcare, NGO, social service, community health, cancer awareness, medical support",
      "slogan": "Empowering Communities Through Service",
      "mission": "To drive community empowerment through blood donation, healthcare support, and transformative social initiatives",
      "sameAs": [
        "https://www.facebook.com/rudhirsetu",
        "https://www.instagram.com/rudhirsetu",
        "https://twitter.com/rudhirsetu",
        "https://www.youtube.com/rudhirsetu",
        "https://www.linkedin.com/company/rudhirsetu"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "url": "https://www.rudhirsetu.org/contact",
          "availableLanguage": [
            "English",
            "Hindi"
          ]
        },
        {
          "@type": "ContactPoint",
          "contactType": "donations",
          "url": "https://www.rudhirsetu.org/donations",
          "availableLanguage": [
            "English",
            "Hindi"
          ]
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "India"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Community Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Blood Donation Drives",
              "description": "Regular blood donation camps and drives"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Healthcare Support",
              "description": "Medical aid and healthcare assistance programs"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Cancer Awareness",
              "description": "Cancer awareness and support programs"
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.rudhirsetu.org/#website",
      "url": "https://www.rudhirsetu.org/",
      "name": "Rudhirsetu Seva Sanstha - Official Website",
      "alternateName": "Rudhirsetu Website",
      "description": "Official website of Rudhirsetu Seva Sanstha - Leading NGO for Blood Donation, Healthcare Support & Social Initiatives in India",
      "publisher": {
        "@id": "https://www.rudhirsetu.org/#organization"
      },
      "potentialAction": [
        {
          "@type": "DonateAction",
          "target": "https://www.rudhirsetu.org/donations",
          "name": "Make a Donation"
        }
      ],
      "mainEntity": {
        "@id": "https://www.rudhirsetu.org/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.rudhirsetu.org/#webpage",
      "url": "https://www.rudhirsetu.org/",
      "name": "Rudhirsetu Seva Sanstha | Blood Donation, Healthcare Support & Social Initiatives",
      "isPartOf": {
        "@id": "https://www.rudhirsetu.org/#website"
      },
      "about": {
        "@id": "https://www.rudhirsetu.org/#organization"
      },
      "datePublished": "2010-01-01",
      "dateModified": "2025-06-29",
      "description": "Join Rudhirsetu Seva Sanstha in empowering communities through regular blood donation drives, comprehensive healthcare support, and innovative social initiatives.",
      "inLanguage": "en-US",
      "potentialAction": [
        {
          "@type": "ReadAction",
          "target": "https://www.rudhirsetu.org/"
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.rudhirsetu.org/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.rudhirsetu.org/",
          "description": "Homepage - Learn about our mission and services"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Camps",
          "item": "https://www.rudhirsetu.org/camp",
          "description": "See our healthcare camps and blood donation drives"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Gallery",
          "item": "https://www.rudhirsetu.org/gallery",
          "description": "Photo gallery of our events and activities"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Donations",
          "item": "https://www.rudhirsetu.org/donations",
          "description": "Support our cause with donations"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Social",
          "item": "https://www.rudhirsetu.org/social",
          "description": "Connect with us on social media"
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Contact",
          "item": "https://www.rudhirsetu.org/contact",
          "description": "Get in touch with our team"
        }
      ]
    },
    {
      "@type": "ItemList",
      "@id": "https://www.rudhirsetu.org/#services",
      "name": "Our Services",
      "description": "Core services offered by Rudhirsetu Seva Sanstha",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Blood Donation Drives",
          "url": "https://www.rudhirsetu.org/camp"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Healthcare Support",
          "url": "https://www.rudhirsetu.org/camp"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Cancer Awareness Programs",
          "url": "https://www.rudhirsetu.org/camp"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Community Health Camps",
          "url": "https://www.rudhirsetu.org/camp"
        }
      ]
    }
  ]
};
