import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Heart, Camera, Tag } from 'lucide-react';
import { client } from '../lib/sanity';
import { QUERIES } from '../lib/sanity';
import { urlFor } from '../lib/sanity';
import type { GalleryImage } from '../types/sanity';
import { FeaturedCarousel, ImageLightbox } from '../components/GalleryComponents';

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(16);
  const [isViewingFeatured, setIsViewingFeatured] = useState(false);

  // Categories with icons
  const categories = [
    { id: 'all', label: 'All Photos', icon: <Camera className="min-w-4 min-h-4" /> },
    { id: 'blood-donation', label: 'Blood Donation', icon: <Heart className="min-w-4 min-h-4" /> },
    { id: 'eye-care', label: 'Eye Care', icon: <Tag className="min-w-4 min-h-4" /> },
    { id: 'cancer-awareness', label: 'Cancer Awareness', icon: <Heart className="min-w-4 min-h-4" /> },
    { id: 'thalassemia-support', label: 'Thalassemia Support', icon: <Heart className="min-w-4 min-h-4" /> },
    { id: 'other', label: 'Other', icon: <Tag className="min-w-4 min-h-4" /> }
  ];

  // Load featured images separately
  useEffect(() => {
    const loadFeaturedImages = async () => {
      try {
        const data = await client.fetch(QUERIES.featuredImages);
        setFeaturedImages(data || []);
      } catch (err) {
        console.error('Error loading featured images:', err);
      }
    };
    loadFeaturedImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await client.fetch(QUERIES.galleryImages);
      setImages(data || []);
      filterImages(data || [], selectedCategory);
    } catch (err) {
      setError('Failed to load images. Please try again later.');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter images based on category
  const filterImages = (imagesList: GalleryImage[], category: string) => {
    let result = [...imagesList];
    
    // Apply category filter
    if (category !== 'all') {
      result = result.filter(image => 
        image.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    setFilteredImages(result);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Apply filters when category changes
  useEffect(() => {
    if (images.length > 0) {
      filterImages(images, selectedCategory);
    }
  }, [selectedCategory, images]);

  useEffect(() => {
    loadImages();
    window.scrollTo(0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset selected image index when changing to a new image
  useEffect(() => {
    if (selectedImage) {
      const index = filteredImages.findIndex(img => img._id === selectedImage._id);
      if (index !== -1) {
        setSelectedImageIndex(index);
      }
    }
  }, [selectedImage, filteredImages]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowFilters(false);
    setCurrentPage(1);
    
    // Scroll to the gallery section smoothly
    const gallerySection = document.getElementById('gallery-grid');
    if (gallerySection) {
      // Add a small delay to ensure state updates complete
      setTimeout(() => {
        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const ImageCard = ({ image }: { image: GalleryImage }) => {
    return (
      <div 
        className="group relative overflow-hidden shadow-md cursor-pointer rounded-lg"
        onClick={() => {
          // When clicking a gallery image, set isViewingFeatured to false
          setIsViewingFeatured(false);
          
          const index = filteredImages.findIndex(img => img._id === image._id);
          setSelectedImage(image);
          setSelectedImageIndex(index);
        }}
      >
        <img
          src={urlFor(image.image).url()}
          alt={image.title || 'Gallery Image'}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
          <div className="p-3 text-white w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-sm md:text-base font-semibold truncate">{image.title}</h3>
            {image.category && (
              <span className="inline-block px-2 py-0.5 bg-red-600/90 text-white text-xs rounded-full mt-1 shadow-sm">
                {image.category.charAt(0).toUpperCase() + image.category.slice(1).replace(/-/g, ' ')}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Gallery grid with a simple responsive masonry layout
  const GalleryGrid = ({ images }: { images: GalleryImage[] }) => {
    if (images.length === 0) {
      return (
        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <Camera className="w-12 h-12 text-red-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No images found</h3>
          <p className="text-gray-500 max-w-md">
            {selectedCategory !== 'all' && (
              <> in <span className="font-semibold">{categories.find(c => c.id === selectedCategory)?.label}</span></>
            )}
          </p>
          <button 
            onClick={() => {
              setSelectedCategory('all');
            }}
            className="mt-6 px-4 py-2 bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Reset Filters
          </button>
        </div>
      );
    }

    return (
      <div className="gallery-masonry">
        {images.map((image) => (
          <div key={image._id} className="gallery-item">
            <ImageCard image={image} />
          </div>
        ))}
      </div>
    );
  };

  // Get current images for pagination
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    
    // Scroll to the gallery section smoothly
    const gallerySection = document.getElementById('gallery-grid');
    if (gallerySection) {
      // Add a small delay to ensure state updates complete
      setTimeout(() => {
        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Pagination Controls component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-12">
        <span className="text-sm text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {totalPages <= 5 ? (
            // Show all page numbers if total pages <= 5
            [...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  currentPage === index + 1
                    ? 'bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))
          ) : (
            // Complex pagination for many pages
            <>
              {currentPage > 1 && (
                <button
                  onClick={() => paginate(1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  1
                </button>
              )}
              
              {currentPage > 3 && <span className="mx-1 text-gray-400">...</span>}
              
              {currentPage > 2 && (
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {currentPage - 1}
                </button>
              )}
              
              <button
                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white"
              >
                {currentPage}
              </button>
              
              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {currentPage + 1}
                </button>
              )}
              
              {currentPage < totalPages - 2 && <span className="mx-1 text-gray-400">...</span>}
              
              {currentPage < totalPages && (
                <button
                  onClick={() => paginate(totalPages)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {totalPages}
                </button>
              )}
            </>
          )}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  if (loading && images.length === 0) {
    return (
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded-lg w-1/4 mb-8"></div>
            <div className="h-[400px] bg-gray-200 rounded-2xl mb-12"></div>
            <div className="flex justify-between mb-8">
              <div className="h-8 bg-gray-200 rounded-lg w-40"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 p-8 rounded-2xl inline-block max-w-md mx-auto shadow-xl border border-red-100">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <X className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops, Something Went Wrong</h2>
            <p className="text-red-700 text-lg mb-8">{error}</p>
            <button
              onClick={() => loadImages()}
              className="px-6 py-3 bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-16 sm:pt-12 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 bg-red-50 text-[#9B2C2C] text-sm font-medium rounded-full mb-4 inline-flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Media Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Our Gallery</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Take a look at the moments we've captured while serving our community through various healthcare initiatives.
          </p>
        </div>

        {/* Custom CSS for Gallery Layout */}
        <style>
          {`
            .gallery-masonry {
              columns: 2 180px;
              column-gap: 12px;
            }
            
            @media (min-width: 640px) {
              .gallery-masonry {
                columns: 3 250px;
                column-gap: 16px;
              }
            }
            
            @media (min-width: 1024px) {
              .gallery-masonry {
                columns: 3 300px;
                column-gap: 20px;
              }
            }
            
            .gallery-item {
              break-inside: avoid;
              margin-bottom: 16px;
              display: block;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .gallery-item:hover {
              transform: translateY(-4px);
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
            }
            
            .gallery-item img {
              display: block;
              width: 100%;
              height: auto;
              transition: all 0.3s ease;
            }
            
            .gallery-item:hover img {
              transform: scale(1.03);
            }
          `}
        </style>

        {/* Featured Images Carousel */}
        {featuredImages.length > 0 && 
          <div className="mb-16 sm:mb-24">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Featured Moments</h2>
            </div>
            <FeaturedCarousel 
              featuredImages={featuredImages}
              onImageClick={(image) => {
                // When clicking a featured image, set isViewingFeatured to true
                setIsViewingFeatured(true);
                
                // Find index in featured images array
                const index = featuredImages.findIndex(img => img._id === image._id);
                if (index >= 0) {
                  setSelectedImage(image);
                  setSelectedImageIndex(index);
                }
              }}
            />
          </div>
        }

        {/* Filters */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100 shadow-sm mb-8 -mx-4 px-4 sm:-mx-8 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">

            {/* Desktop Categories */}
            <div className="flex flex-wrap items-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Categories */}
          {showFilters && (
            <div
              ref={filterRef}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gallery Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 text-gray-600">
          <p className="mb-4 sm:mb-0">
            Showing <span className="font-semibold">{Math.min(indexOfFirstImage + 1, filteredImages.length)}-{Math.min(indexOfLastImage, filteredImages.length)}</span> of <span className="font-semibold">{filteredImages.length}</span> {filteredImages.length === 1 ? 'image' : 'images'}
            {selectedCategory !== 'all' && (
              <> in <span className="font-semibold">{categories.find(c => c.id === selectedCategory)?.label}</span></>
            )}
          </p>

          {filteredImages.length > 0 && selectedCategory !== 'all' && (
            <button 
              onClick={() => {
                setSelectedCategory('all');
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filter
            </button>
          )}
        </div>

        {/* Gallery Grid with CSS Grid Layout */}
        <div id="gallery-grid" className="overflow-hidden">
          <GalleryGrid images={currentImages} />
        </div>

        {/* Pagination */}
        <PaginationControls />

        {/* Lightbox */}
        {selectedImage && (
          <ImageLightbox
            selectedImage={selectedImage}
            images={isViewingFeatured ? featuredImages : filteredImages}
            selectedIndex={selectedImageIndex}
            onClose={() => {
              setSelectedImage(null);
              setIsViewingFeatured(false);
            }}
            onPrev={() => {
              // Use the appropriate array based on what we're viewing
              const imageArray = isViewingFeatured ? featuredImages : filteredImages;
              const newIndex = (selectedImageIndex - 1 + imageArray.length) % imageArray.length;
              setSelectedImage(imageArray[newIndex]);
              setSelectedImageIndex(newIndex);
            }}
            onNext={() => {
              // Use the appropriate array based on what we're viewing
              const imageArray = isViewingFeatured ? featuredImages : filteredImages;
              const newIndex = (selectedImageIndex + 1) % imageArray.length;
              setSelectedImage(imageArray[newIndex]);
              setSelectedImageIndex(newIndex);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;