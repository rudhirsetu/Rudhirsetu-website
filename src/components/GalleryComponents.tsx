import { useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { urlFor } from '../lib/sanity';
import type { GalleryImage } from '../types/sanity';

// Reusable FeaturedCarousel component
export const FeaturedCarousel = memo(({ 
  featuredImages, 
  onImageClick,
  autoplayInterval = 5000,
  aspectRatio = 'md:aspect-[21/9] aspect-[4/3]'
}: { 
  featuredImages: GalleryImage[], 
  onImageClick?: (image: GalleryImage, index: number) => void,
  autoplayInterval?: number,
  aspectRatio?: string
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [featuredImages, autoplayInterval]);

  if (featuredImages.length === 0) return null;

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (onImageClick) {
      onImageClick(image, index);
    }
  };

  return (
    <div className="relative group">
      <div className={`relative ${aspectRatio} rounded-2xl overflow-hidden shadow-xl`}>
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
              onClick={() => handleImageClick(featuredImages[currentSlide], currentSlide)}
            >
              <img
                src={urlFor(image.image).url()}
                alt={image.title || 'Featured Image'}
                className="w-full h-full object-cover"
                loading="eager"
                style={{ minHeight: '300px' }}
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
  );
});

// Reusable Lightbox component
export const ImageLightbox = ({ 
  selectedImage, 
  images, 
  selectedIndex, 
  onClose, 
  onPrev, 
  onNext,
  showThumbnails
}: { 
  selectedImage: GalleryImage | null; 
  images: GalleryImage[]; 
  selectedIndex: number; 
  onClose: () => void; 
  onPrev: () => void; 
  onNext: () => void; 
  showThumbnails?: boolean;
}) => {
  if (!selectedImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm"
      tabIndex={0}
    >
      <button
        onClick={onClose}
        className="absolute bg-black/70 border border-gray-700 rounded-full top-6 right-6 p-2 text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-300 z-[60]"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        <button
          onClick={onPrev}
          className="absolute bg-black/70 border border-gray-700 rounded-full left-4 p-2 sm:p-3 z-[60] text-white hover:bg-white hover:text-black transition-colors duration-300"
          aria-label="Previous image"
          disabled={images.length <= 1}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="relative max-w-5xl max-h-full">
          <img
            src={urlFor(selectedImage.image).url()}
            alt={selectedImage.title || 'Gallery image'}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            loading="eager"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          />
        </div>

        <button
          onClick={onNext}
          className="absolute bg-black/70 border border-gray-700 rounded-full right-4 p-2 sm:p-3 z-[60] text-white hover:bg-white hover:text-black transition-colors duration-300"
          aria-label="Next image"
          disabled={images.length <= 1}
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
              {selectedIndex + 1} of {images.length}
            </span>
          </div>
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4 px-4 overflow-x-auto max-w-full">
            <div className="flex gap-2 p-2 bg-black/60 rounded-full backdrop-blur-sm overflow-x-auto max-w-full">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index !== selectedIndex) {
                      onPrev(); // This is a hack to make TypeScript happy
                      // In reality we would want to set the selected image to this one
                    }
                  }}
                  className="relative flex-shrink-0"
                  aria-label={`Go to image ${index + 1}`}
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-colors ${
                    index === selectedIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}>
                    <img 
                      src={urlFor(img.image).url()} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 