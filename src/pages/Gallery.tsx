import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { fetchGalleryImages, fetchGalleryImagesByCategory, GalleryImage, Pagination } from '../services/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'blood-donation', label: 'Blood Donation' },
    { id: 'eye-care', label: 'Eye Care' },
    { id: 'cancer-awareness', label: 'Cancer Awareness' },
    { id: 'thalassemia', label: 'Thalassemia' }
  ];

  const loadImages = async (page = 1) => {
    try {
      setLoading(true);
      const data = selectedCategory === 'all'
        ? await fetchGalleryImages(page)
        : await fetchGalleryImagesByCategory(selectedCategory, page);

      if (data) {
        setImages(data.data);
        setPagination(data.meta.pagination);
      }
    } catch (err) {
      setError('Failed to load images. Please try again later.');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  // Auto-advance carousel
  useEffect(() => {
    const featuredImages = images.filter(img => img.IsFeatured);
    if (featuredImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [images]);

  const getImageUrl = (image: GalleryImage, size: 'thumbnail' | 'small' | 'original' = 'original') => {
    if (!image.image?.[0]) {
      return '/images/placeholder.jpg'; // You should add a placeholder image
    }

    const imageData = image.image[0];

    if (size === 'original') {
      return `${STRAPI_URL}${imageData.url}`;
    }

    const format = imageData.formats?.[size];
    return format ? `${STRAPI_URL}${format.url}` : `${STRAPI_URL}${imageData.url}`;
  };

  const ImageCard = ({ image }: { image: GalleryImage }) => (
    <div 
      className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
      onClick={() => setSelectedImage(image)}
    >
      <img
        src={getImageUrl(image, 'small')}
        alt={image.Title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{image.Title}</h3>
          {image.description && (
            <p className="text-sm text-gray-200">{image.description}</p>
          )}
        </div>
      </div>
    </div>
  );

  const Lightbox = () => {
    if (!selectedImage) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X className="w-8 h-8" />
        </button>
        <img
          src={getImageUrl(selectedImage, 'original')}
          alt={selectedImage.Title}
          className="max-w-[90vw] max-h-[90vh] object-contain"
        />
        <div className="absolute bottom-4 left-4 right-4 text-white text-center">
          <h3 className="text-xl font-semibold">{selectedImage.Title}</h3>
          {selectedImage.description && (
            <p className="text-gray-300 mt-2">{selectedImage.description}</p>
          )}
        </div>
      </div>
    );
  };

  // Featured Images Carousel
  const FeaturedCarousel = () => {
    const featuredImages = images.filter(img => img.IsFeatured);
    if (featuredImages.length === 0) return null;

    return (
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Featured Moments</h2>
        <div className="relative">
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden">
            {featuredImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={getImageUrl(image, 'small')}
                  alt={image.Title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full mb-3">
                      Featured
                    </span>
                    <h3 className="text-2xl font-semibold text-white mb-2">{image.Title}</h3>
                    {image.description && (
                      <p className="text-gray-200">{image.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {featuredImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredImages.length) % featuredImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {featuredImages.length > 1 && (
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-2">
              {featuredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
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
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 p-4 rounded-lg inline-block">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => loadImages()}
              className="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Gallery</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Take a look at the moments we've captured while serving our community through various healthcare initiatives.
          </p>
        </div>

        {/* Featured Images Carousel */}
        <FeaturedCarousel />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images
            .filter(img => !img.IsFeatured)
            .map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.pageCount > 1 && (
          <div className="flex items-center justify-center mt-12 gap-2">
            <button
              onClick={() => loadImages(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-600">
              Page {pagination.page} of {pagination.pageCount}
            </span>
            <button
              onClick={() => loadImages(pagination.page + 1)}
              disabled={pagination.page === pagination.pageCount}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Lightbox */}
        <Lightbox />
      </div>
    </div>
  );
};

export default Gallery; 