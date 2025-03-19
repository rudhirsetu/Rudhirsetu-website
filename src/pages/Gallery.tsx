import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Filter, Heart, Camera, Tag } from 'lucide-react';
import { client } from '../lib/sanity';
import { QUERIES } from '../lib/sanity';
import { urlFor } from '../lib/sanity';
import type { GalleryImage } from '../types/sanity';

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Categories with icons
  const categories = [
    { id: 'all', label: 'All Photos', icon: <Camera className="min-w-4 min-h-4" /> },
    { id: 'blood-donation', label: 'Blood Donation', icon: <Heart className="min-w-4 min-h-4" /> },
    { id: 'eye-care', label: 'Eye Care', icon: <Tag className="min-w-4 min-h-4" /> },
    { id: 'cancer-awareness', label: 'Cancer Awareness', icon: <Heart className="min-w-4 min-h-4" /> },
    { id: 'thalassemia-support', label: 'Thalassemia Support', icon: <Heart className="min-w-4 min-h-4" /> },
    { id: 'other', label: 'Other', icon: <Tag className="min-w-4 min-h-4" /> }
  ];

  // Handle click outside of filter menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Auto-advance carousel
  useEffect(() => {
    if (featuredImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [featuredImages]);

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
  };

  const ImageCard = ({ image }: { image: GalleryImage }) => (
    <div 
      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl cursor-pointer"
      style={{ aspectRatio: '4/3' }}
      onClick={() => {
        const index = filteredImages.findIndex(img => img._id === image._id);
        setSelectedImage(image);
        setSelectedImageIndex(index);
      }}
    >
      <img
        src={urlFor(image.image).url()}
        alt={image.title || 'Gallery Image'}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <div className="p-4 text-white w-full">
          <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
          {image.description && (
            <p className="text-sm text-white/80 line-clamp-2">
              {image.description}
            </p>
          )}
          {image.category && (
            <span className="inline-block px-2 py-1 bg-red-600/80 text-white text-xs rounded-full mt-2">
              {image.category.charAt(0).toUpperCase() + image.category.slice(1).replace(/-/g, ' ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const MasonryGrid = ({ images }: { images: GalleryImage[] }) => {
    const [columns, setColumns] = useState<GalleryImage[][]>([]);

    // Calculate and set columns when images or window size changes
    useEffect(() => {
      const calculateColumns = () => {
        // Calculate number of columns based on screen width
        const columnCount = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
        
        // Initialize columns array
        const newColumns: GalleryImage[][] = Array.from({ length: columnCount }, () => []);
        
        // Helper function to get column heights
        const getColumnHeight = (columnIndex: number) => {
          return newColumns[columnIndex].reduce((height) => {
            // Use aspect ratio to estimate height (assuming base width of 100)
            const aspectRatio = 3/4; // Your images are using 4:3 ratio
            return height + (100 * aspectRatio);
          }, 0);
        };

        // Distribute images among columns
        images.forEach((image) => {
          // Find the shortest column
          const shortestColumnIndex = newColumns.reduce((shortest, _, currentIndex) => {
            const currentHeight = getColumnHeight(currentIndex);
            const shortestHeight = getColumnHeight(shortest);
            return currentHeight < shortestHeight ? currentIndex : shortest;
          }, 0);

          // Add image to shortest column
          newColumns[shortestColumnIndex].push(image);
        });

        setColumns(newColumns);
      };

      // Calculate initial columns
      calculateColumns();

      // Add resize listener
      const handleResize = () => {
        calculateColumns();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [images]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4 sm:gap-6">
            {column.map((image) => (
              <div key={image._id} className="break-inside-avoid">
                <ImageCard image={image} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const Lightbox = () => {
    if (!selectedImage) return null;

    return (
      <div 
        className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm"
        tabIndex={0}
      >
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute bg-black/70 border border-gray-700 rounded-full top-6 right-6 p-2 text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-300 z-[60]"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center p-4">
          <button
            onClick={() => {
              const newIndex = (selectedImageIndex - 1 + filteredImages.length) % filteredImages.length;
              setSelectedImage(filteredImages[newIndex]);
              setSelectedImageIndex(newIndex);
            }}
            className="absolute bg-black/70 border border-gray-700 rounded-full left-4 p-2 sm:p-3 z-[60] text-white hover:bg-white hover:text-black transition-colors duration-300"
            aria-label="Previous image"
            disabled={filteredImages.length <= 1}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="relative max-w-5xl max-h-full">
            <img
              src={urlFor(selectedImage.image).width(800).url()}
              alt={selectedImage.title || 'Gallery Image'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          <button
            onClick={() => {
              const newIndex = (selectedImageIndex + 1) % filteredImages.length;
              setSelectedImage(filteredImages[newIndex]);
              setSelectedImageIndex(newIndex);
            }}
            className="absolute bg-black/70 border border-gray-700 rounded-full right-4 p-2 sm:p-3 z-[60] text-white hover:bg-white hover:text-black transition-colors duration-300"
            aria-label="Next image"
            disabled={filteredImages.length <= 1}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="max-w-5xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-white/80 mt-1 max-w-3xl text-sm md:text-base">
                    {selectedImage.description}
                  </p>
                )}
              </div>
              {selectedImage.category && (
                <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full ml-4">
                  {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1).replace(/-/g, ' ')}
                </span>
              )}
            </div>
            <div className="mt-2 text-sm text-white/60 flex items-center">
              <span className="mr-4">
                {selectedImageIndex + 1} of {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Featured Images Carousel
  const FeaturedCarousel = () => {
    if (featuredImages.length === 0) return null;

    const handleImageClick = (image: GalleryImage) => {
      // First, ensure the image is in the filtered images array
      if (!filteredImages.some(img => img._id === image._id)) {
        setFilteredImages(prev => [image, ...prev]);
      }
      
      // Set a timeout to ensure the state has updated
      setTimeout(() => {
        const index = filteredImages.findIndex(img => img._id === image._id);
        setSelectedImage(image);
        setSelectedImageIndex(index >= 0 ? index : 0);
      }, 0);
    };

    return (
      <div className="mb-16 sm:mb-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured Moments</h2>
        </div>
        <div className="relative group">
          <div className="relative md:aspect-[21/9] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            {featuredImages.map((image, index) => (
              <div
                key={image._id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
              >
                <div 
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => handleImageClick(featuredImages[currentSlide])}
                >
                  <img
                    src={urlFor(image.image).width(1600).height(800).url()}
                    alt={image.title || 'Featured Image'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10">
                      <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-full mb-2 sm:mb-3 shadow-lg">
                        Featured
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg line-clamp-2">{image.title}</h3>
                      {image.description && (
                        <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl drop-shadow-md line-clamp-2">{image.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Controls - Only show on hover or touch devices */}
            <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev - 1 + featuredImages.length) % featuredImages.length);
                }}
                className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 text-white hover:bg-white hover:text-black duration-300 flex items-center justify-center backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
                }}
                className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 text-white hover:bg-white hover:text-black duration-300 flex items-center justify-center backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Progress Indicators */}
          {featuredImages.length > 1 && (
            <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-2 px-4 pointer-events-none">
              {featuredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-red-600 w-8 sm:w-12' 
                      : 'bg-gray-300 w-2.5 sm:w-3 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
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

        {/* Featured Images Carousel */}
        {featuredImages.length > 0 && <FeaturedCarousel />}

        {/* Filters */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100 shadow-sm mb-8 -mx-4 px-4 sm:-mx-8 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Mobile Filter Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full px-4 py-2.5 bg-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <span className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  {categories.find(c => c.id === selectedCategory)?.label || 'All Photos'}
                </span>
                <ChevronRight className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {/* Desktop Categories */}
            <div className="hidden md:flex flex-wrap items-center gap-3">
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
            Showing <span className="font-semibold">{filteredImages.length}</span> {filteredImages.length === 1 ? 'image' : 'images'}
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

        {/* Gallery Grid */}
        <MasonryGrid images={filteredImages} />

        {/* Lightbox */}
        {selectedImage && <Lightbox />}
      </div>
    </div>
  );
};

export default Gallery; 