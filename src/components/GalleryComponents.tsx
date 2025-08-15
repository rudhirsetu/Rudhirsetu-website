import { useState, useEffect, memo, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { urlFor } from '../lib/sanity';
import type { GalleryImage } from '../types/sanity';

// Optimized FeaturedCarousel component
const FeaturedCarouselComponent = ({ 
  featuredImages, 
  onImageClick,
  autoplayInterval = 8000,
  aspectRatio = 'md:aspect-[21/9] aspect-[4/3]'
}: { 
  featuredImages: GalleryImage[], 
  onImageClick?: (image: GalleryImage, index: number) => void,
  autoplayInterval?: number,
  aspectRatio?: string
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // Preload first image
  const carouselRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection Observer to pause when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setIsPaused(true);
        }
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized auto-advance with proper cleanup
  useEffect(() => {
    if (featuredImages.length <= 1 || isPaused || !isVisible) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % featuredImages.length;
        // Preload next image
        setLoadedImages(prev => new Set([...prev, next]));
        return next;
      });
    }, autoplayInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [featuredImages.length, autoplayInterval, isPaused, isVisible]);

  // Preload adjacent images
  const preloadAdjacentImages = useCallback((index: number) => {
    const toLoad = new Set<number>();
    toLoad.add(index);
    if (index > 0) toLoad.add(index - 1);
    if (index < featuredImages.length - 1) toLoad.add(index + 1);
    
    setLoadedImages(prev => new Set([...prev, ...toLoad]));
  }, [featuredImages.length]);

  useEffect(() => {
    preloadAdjacentImages(currentSlide);
  }, [currentSlide, preloadAdjacentImages]);

  if (featuredImages.length === 0) return null;

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (onImageClick) {
      onImageClick(image, index);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    preloadAdjacentImages(index);
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % featuredImages.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + featuredImages.length) % featuredImages.length;
    goToSlide(prev);
  };

  return (
    <div 
      ref={carouselRef}
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`relative ${aspectRatio} rounded-2xl overflow-hidden bg-gray-100`}>
        {/* Only render current and adjacent images */}
        {featuredImages.map((image, index) => {
          const isActive = index === currentSlide;
          const shouldRender = Math.abs(index - currentSlide) <= 1 || 
                             (currentSlide === 0 && index === featuredImages.length - 1) ||
                             (currentSlide === featuredImages.length - 1 && index === 0);
          
          if (!shouldRender) return null;

          return (
            <div
              key={image._id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{ 
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={() => handleImageClick(image, currentSlide)}
              >
                {loadedImages.has(index) && (
                  <img
                    src={urlFor(image.image).width(1200).quality(85).url()}
                    alt={image.title || 'Featured Image'}
                    className="w-full h-full object-cover"
                    loading={index <= 1 ? "eager" : "lazy"}
                    style={{ minHeight: '300px' }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-full mb-2 sm:mb-3">
                      Featured
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">{image.title}</h3>
                    {image.description && (
                      <p className="text-white/90 text-sm sm:text-base max-w-2xl line-clamp-2">{image.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Simplified Controls */}
        {featuredImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="pointer-events-auto w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 hover:scale-110 flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-200 backdrop-blur-sm border border-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="pointer-events-auto w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 hover:scale-110 flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-200 backdrop-blur-sm border border-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Simplified Progress Indicators */}
      {featuredImages.length > 1 && (
        <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
          {featuredImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-red-600 w-8' 
                  : 'bg-gray-300 w-2.5 hover:bg-red-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

FeaturedCarouselComponent.displayName = 'FeaturedCarousel';
export const FeaturedCarousel = memo(FeaturedCarouselComponent);

// Optimized Lightbox component
export const ImageLightbox = ({ 
  selectedImage, 
  images, 
  selectedIndex, 
  onClose, 
  onPrev, 
  onNext
}: { 
  selectedImage: GalleryImage | null; 
  images: GalleryImage[]; 
  selectedIndex: number; 
  onClose: () => void; 
  onPrev: () => void; 
  onNext: () => void; 
}) => {
  const [showInfo, setShowInfo] = useState(false);
  
  if (!selectedImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      tabIndex={0}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white hover:text-red-500 transition-colors z-[60]"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        <button
          onClick={onPrev}
          className="absolute left-4 p-3 z-[60] text-white hover:text-red-500 transition-all duration-200 bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-sm border border-white/20 hover:scale-110"
          aria-label="Previous image"
          disabled={images.length <= 1}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative max-w-5xl max-h-full">
          <img
            src={urlFor(selectedImage.image).quality(90).url()}
            alt={selectedImage.title || 'Gallery image'}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            loading="eager"
          />
        </div>

        <button
          onClick={onNext}
          className="absolute right-4 p-3 z-[60] text-white hover:text-red-500 transition-all duration-200 bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-sm border border-white/20 hover:scale-110"
          aria-label="Next image"
          disabled={images.length <= 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Simplified Info Panel */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        {showInfo && (
          <div className="max-w-5xl mx-auto bg-black/60 rounded-xl p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-white/80 mt-1 max-w-3xl text-sm md:text-base">
                    {selectedImage.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="ml-3 p-1.5 text-white hover:text-red-500 transition-colors"
                aria-label="Hide information"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 text-sm text-white/60">
              {selectedIndex + 1} of {images.length}
            </div>
          </div>
        )}

        {!showInfo && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowInfo(true)}
              className="bg-black/60 rounded-full px-4 py-2 text-white hover:bg-black/80 transition-colors flex items-center gap-2"
              aria-label="Show information"
            >
              <span className="text-sm">Show Info</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 