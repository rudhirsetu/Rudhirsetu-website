/**
 * GROQ Queries for Sanity
 * These queries fetch data from our Sanity content lake
 */

export const QUERIES = {
  // Event queries with pagination
  upcomingEvents: (page: number = 1, pageSize: number = 6) => `*[_type == "event" && isUpcoming == true] | order(date asc) [${(page - 1) * pageSize}...${page * pageSize}] {
    _id,
    _type,
    title,
    date,
    location,
    expectedParticipants,
    isUpcoming,
    desc,
    image,
    shortDesc,
    _createdAt,
    _updatedAt
  }`,

  upcomingEventsCount: `count(*[_type == "event" && isUpcoming == true])`,

  pastEvents: (page: number = 1, pageSize: number = 6) => `*[_type == "event" && isUpcoming == false] | order(date desc) [${(page - 1) * pageSize}...${page * pageSize}] {
    _id,
    _type,
    title,
    date,
    location,
    expectedParticipants,
    isUpcoming,
    desc,
    image,
    shortDesc,
    _createdAt,
    _updatedAt
  }`,

  pastEventsCount: `count(*[_type == "event" && isUpcoming == false])`,

  // Gallery queries
  featuredImages: `*[_type == "galleryImage" && isFeatured == true] {
    _id,
    _type,
    title,
    description,
    category,
    isFeatured,
    image
  }`,

  galleryImages: `*[_type == "galleryImage" && !isFeatured] {
    _id,
    _type,
    title,
    description,
    category,
    isFeatured,
    image
  }`,

  galleryImagesByCategory: (category: string) => `*[_type == "galleryImage" && !isFeatured && category == "${category}"] {
    _id,
    _type,
    title,
    description,
    category,
    isFeatured,
    image
  }`,

  // Settings queries
  donationSettings: `*[_type == "donationSettings"][0] {
    _id,
    _type,
    upiId,
    accountName,
    accountNumber,
    ifscCode,
    bankAndBranch,
    qrCodeImage
  }`,

  contactSettings: `*[_type == "contactSettings"][0] {
    _id,
    _type,
    address,
    phone,
    email,
    googleMapsUrl
  }`,

  socialMediaSettings: `*[_type == "socialMediaSettings"][0] {
    _id,
    _type,
    linkedinUrl,
    facebookUrl,
    instagramUrl,
    youtubeUrl,
    description
  }`,
}; 