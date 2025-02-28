const STRAPI_URL = 'http://localhost:1337/api';

export interface Event {
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

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: Pagination;
  }
}

export const fetchEvents = async (page = 1, pageSize = 6) => {
  try {
    const response = await fetch(`${STRAPI_URL}/events?sort=date:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: StrapiResponse<Event[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return null;
  }
};

export const fetchUpcomingEvents = async (page = 1, pageSize = 6) => {
  try {
    const response = await fetch(
      `${STRAPI_URL}/events?filters[isUpcoming][$eq]=true&sort=date:asc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: StrapiResponse<Event[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return null;
  }
};

export const fetchPastEvents = async (page = 1, pageSize = 6) => {
  try {
    const response = await fetch(
      `${STRAPI_URL}/events?filters[isUpcoming][$eq]=false&sort=date:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: StrapiResponse<Event[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching past events:', error);
    return null;
  }
};

export interface GalleryImage {
  id: number;
  documentId: string;
  Title?: string;
  description?: string;
  category: string;
  IsFeatured: boolean;
  image: Array<{
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail?: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        url: string;
      };
      small?: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        url: string;
      };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export const fetchGalleryImages = async (page = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${STRAPI_URL}/gallery-images?populate=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: StrapiResponse<GalleryImage[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return null;
  }
};

export const fetchGalleryImagesByCategory = async (category: string, page = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${STRAPI_URL}/gallery-images?populate=*&filters[category][$eq]=${category}&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: StrapiResponse<GalleryImage[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gallery images by category:', error);
    return null;
  }
};

export interface DonationSettings {
  id: number;
  documentId: string;
  upiId: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankAndBranch: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  qrCodeImage: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      };
      medium: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      };
      small: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export const fetchDonationSettings = async () => {
  try {
    const response = await fetch(
      `${STRAPI_URL}/donation-setting?populate=*`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching donation settings:', error);
    return null;
  }
}; 