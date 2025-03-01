/**
 * Type definitions for Sanity documents and responses
 */

// Base Sanity document type
interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
}

// Sanity image type
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

// Event document type
export interface Event extends SanityDocument {
  _type: 'event';
  title: string;
  date: string;
  location: string;
  expectedParticipants?: string;
  isUpcoming: boolean;
  desc?: string;
}

// Gallery image document type
export interface GalleryImage extends SanityDocument {
  _type: 'galleryImage';
  title?: string;
  description?: string;
  category: string;
  isFeatured: boolean;
  image: SanityImage;
}

// Donation settings document type
export interface DonationSettings extends SanityDocument {
  _type: 'donationSettings';
  upiId: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankAndBranch: string;
  qrCodeImage: SanityImage;
}

// Contact settings document type
export interface ContactSettings extends SanityDocument {
  _type: 'contactSettings';
  address: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
}

// Social media settings document type
export interface SocialMediaSettings extends SanityDocument {
  _type: 'socialMediaSettings';
  linkedinUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  description: string;
}

// Pagination type for client-side pagination
export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
} 