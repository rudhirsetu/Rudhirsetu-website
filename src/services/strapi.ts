import { client } from '../lib/sanity';

export interface Event {
  _id: string;
  _type: 'event';
  title: string;
  date: string;
  location: string;
  expectedParticipants?: string;
  isUpcoming: boolean;
  desc?: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface GalleryImage {
  _id: string;
  _type: 'galleryImage';
  title?: string;
  description?: string;
  category: string;
  isFeatured: boolean;
  image: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
}

export interface DonationSettings {
  _id: string;
  _type: 'donationSettings';
  upiId: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankAndBranch: string;
  qrCodeImage: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
}

export interface ContactSettings {
  _id: string;
  _type: 'contactSettings';
  address: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface SocialMediaSettings {
  _id: string;
  _type: 'socialMediaSettings';
  linkedinUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  description: string;
}

export const fetchEvents = async (page = 1, pageSize = 6) => {
  try {
    const events = await client.fetch(QUERIES.allEvents);
    const total = events.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedEvents = events.slice(start, end);

    return {
      data: paginatedEvents,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return null;
  }
};

export const fetchUpcomingEvents = async (page = 1, pageSize = 6) => {
  try {
    const events = await client.fetch(QUERIES.upcomingEvents);
    const total = events.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedEvents = events.slice(start, end);

    return {
      data: paginatedEvents,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return null;
  }
};

export const fetchPastEvents = async (page = 1, pageSize = 6) => {
  try {
    const events = await client.fetch(QUERIES.pastEvents);
    const total = events.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedEvents = events.slice(start, end);

    return {
      data: paginatedEvents,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching past events:', error);
    return null;
  }
};

export const fetchGalleryImages = async (page = 1, pageSize = 12) => {
  try {
    const images = await client.fetch(QUERIES.galleryImages);
    const total = images.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedImages = images.slice(start, end);

    return {
      data: paginatedImages,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return null;
  }
};

export const fetchGalleryImagesByCategory = async (category: string, page = 1, pageSize = 12) => {
  try {
    const images = await client.fetch(QUERIES.galleryImagesByCategory(category));
    const total = images.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedImages = images.slice(start, end);

    return {
      data: paginatedImages,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching gallery images by category:', error);
    return null;
  }
};

export const fetchDonationSettings = async () => {
  try {
    const settings = await client.fetch(QUERIES.donationSettings);
    return settings;
  } catch (error) {
    console.error('Error fetching donation settings:', error);
    return null;
  }
};

export const fetchContactSettings = async () => {
  try {
    const settings = await client.fetch(QUERIES.contactSettings);
    return settings;
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return null;
  }
};

export const fetchSocialMediaSettings = async () => {
  try {
    const settings = await client.fetch(QUERIES.socialMediaSettings);
    return settings;
  } catch (error) {
    console.error('Error fetching social media settings:', error);
    return null;
  }
};

// GROQ Queries
export const QUERIES = {
  allEvents: `*[_type == "event"] | order(date desc)`,
  upcomingEvents: `*[_type == "event" && isUpcoming == true] | order(date asc)`,
  pastEvents: `*[_type == "event" && isUpcoming == false] | order(date desc)`,
  featuredImages: `*[_type == "galleryImage" && isFeatured == true]`,
  galleryImages: `*[_type == "galleryImage" && !isFeatured]`,
  galleryImagesByCategory: (category: string) => `*[_type == "galleryImage" && !isFeatured && category == "${category}"]`,
  donationSettings: `*[_type == "donationSettings"][0]`,
  contactSettings: `*[_type == "contactSettings"][0]`,
  socialMediaSettings: `*[_type == "socialMediaSettings"][0]`,
}; 