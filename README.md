# Rudhirsetu Website

A modern web application for Rudhirsetu Seva Sanstha built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Currently using Strapi (with migration notes for Sanity)
- **Routing**: React Router
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Content Models

### 1. Events
Events are used in the Impact page to showcase upcoming and past events.

```typescript
interface Event {
  id: number;
  documentId: string;
  title: string;
  date: string;
  location: string;
  expectedParticipants?: string;
  isUpcoming: boolean;
  desc?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
```

**API Endpoints**:
- Get all events: `GET /api/events?sort=date:desc`
- Get upcoming events: `GET /api/events?filters[isUpcoming][$eq]=true`
- Get past events: `GET /api/events?filters[isUpcoming][$eq]=false`

### 2. Gallery Images
Used in the Gallery page to display images with categories and featured images.

```typescript
interface GalleryImage {
  id: number;
  documentId: string;
  Title?: string;
  description?: string;
  category: string;
  IsFeatured: boolean;
  image: Array<{
    id: number;
    url: string;
    alternativeText: string | null;
    formats: {
      thumbnail?: ImageFormat;
      small?: ImageFormat;
    };
  }>;
}

interface ImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}
```

**API Endpoints**:
- Get all images: `GET /api/gallery-images?populate=*`
- Get images by category: `GET /api/gallery-images?populate=*&filters[category][$eq]={category}`

### 3. Donation Settings
Single type for managing donation-related information.

```typescript
interface DonationSettings {
  id: number;
  documentId: string;
  upiId: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankAndBranch: string;
  qrCodeImage: {
    url: string;
    alternativeText: string | null;
    formats: {
      thumbnail: ImageFormat;
      small: ImageFormat;
      medium: ImageFormat;
    };
  };
}
```

**API Endpoint**:
- Get donation settings: `GET /api/donation-setting?populate=*`

### 4. Contact Settings
Single type for managing contact information.

```typescript
interface ContactSettings {
  id: number;
  documentId: string;
  address: string;
  phone: string;
  email: string;
  url: string; // Google Maps iframe HTML
}
```

**API Endpoint**:
- Get contact settings: `GET /api/contact-setting?populate=*`

## Migration Notes for Sanity

### Schema Transformations

1. **Events Collection**:
```javascript
// Sanity schema
export default {
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'location',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'expectedParticipants',
      type: 'string'
    },
    {
      name: 'isUpcoming',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'desc',
      type: 'text'
    }
  ]
}
```

2. **Gallery Images Collection**:
```javascript
// Sanity schema
export default {
  name: 'galleryImage',
  title: 'Gallery Images',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string'
    },
    {
      name: 'description',
      type: 'text'
    },
    {
      name: 'category',
      type: 'string',
      options: {
        list: [
          'blood-donation',
          'eye-care',
          'cancer-awareness',
          'thalassemia-support'
        ]
      }
    },
    {
      name: 'isFeatured',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text'
        }
      ]
    }
  ]
}
```

3. **Donation Settings Singleton**:
```javascript
// Sanity schema
export default {
  name: 'donationSettings',
  title: 'Donation Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // Prevents creating multiple instances
  fields: [
    {
      name: 'upiId',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'accountName',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'accountNumber',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'ifscCode',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'bankAndBranch',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'qrCodeImage',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text'
        }
      ]
    }
  ]
}
```

4. **Contact Settings Singleton**:
```javascript
// Sanity schema
export default {
  name: 'contactSettings',
  title: 'Contact Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'address',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'phone',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'googleMapsUrl',
      type: 'url',
      validation: Rule => Rule.required()
    }
  ]
}
```

### Key Differences between Strapi and Sanity

1. **Image Handling**:
   - Strapi: Stores images on local filesystem or external providers, returns URLs
   - Sanity: Uses Sanity Image Pipeline, requires GROQ queries

2. **API Structure**:
   - Strapi: REST API with filters and populate
   - Sanity: GROQ queries for flexible data fetching

3. **Authentication**:
   - Strapi: JWT-based auth
   - Sanity: Token-based auth with CDN

4. **Deployment**:
   - Strapi: Requires separate backend hosting
   - Sanity: Hosted service, only frontend deployment needed

## Environment Variables

```env
# Current Strapi Setup
VITE_STRAPI_API_URL=http://localhost:1337
VITE_STRAPI_URL=http://localhost:1337

# For Sanity Migration
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-05-03
```

## Pagination

All list endpoints support pagination with the following parameters:
- `page`: Current page number
- `pageSize`: Number of items per page (default: 6 for events, 12 for gallery)

Response includes metadata:
```typescript
interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
```

Folder structure:
1. src/components - For reusable UI components
2. src/pages - For different pages/routes
3. src/assets - For images and other static assets
4. src/styles - For global styles
5. src/layouts - For layout components
6. src/utils - For utility functions
7. src/types - For TypeScript type definitions






