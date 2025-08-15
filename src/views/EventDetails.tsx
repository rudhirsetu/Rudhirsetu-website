import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Users, Heart, Clock, ArrowLeft, X, ChevronLeft, ChevronRight, Calendar, Share2, ExternalLink, FileText, Camera, CalendarHeart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Event } from '../types/sanity';
import { client } from '../lib/sanity';
import { urlFor } from '../lib/sanity';
import { format } from 'date-fns';

interface EventDetailsProps {
  eventId?: string;
  eventData?: Event;
}

const EventDetails = ({ eventId, eventData }: EventDetailsProps = {}) => {
  const id = eventId;
  const [event, setEvent] = useState<Event | null>(eventData || null);
  const [loading, setLoading] = useState(!eventData);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track scroll position for parallax and reveal effects
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollPosition(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrevImage = useCallback(() => {
    if (selectedImage === null || !event?.gallery) return;
    setSelectedImage(selectedImage === 0 ? event.gallery.length - 1 : selectedImage - 1);
  }, [selectedImage, event?.gallery]);

  const handleNextImage = useCallback(() => {
    if (selectedImage === null || !event?.gallery) return;
    setSelectedImage(selectedImage === event.gallery.length - 1 ? 0 : selectedImage + 1);
  }, [selectedImage, event?.gallery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft' && selectedImage !== null) {
        handlePrevImage();
      } else if (e.key === 'ArrowRight' && selectedImage !== null) {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handlePrevImage, handleNextImage]);

  useEffect(() => {
    // Only scroll to top if user is significantly down the page
    if (window.scrollY > window.innerHeight) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Only fetch if we don't have eventData from the server
    if (eventData) {
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "event" && _id == $id][0]{
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
            gallery,
            _createdAt,
            _updatedAt
          }`,
          { id }
        );
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (id && !eventData) {
      fetchEvent();
    }
  }, [id, eventData]);

  const Lightbox = () => {
    if (selectedImage === null || !event?.gallery) return null;

    const image = event.gallery[selectedImage];

    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm">
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute bg-black/70 border border-gray-700 rounded-full top-6 right-6 p-2 text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-300 z-[60]"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center p-4">
          <button
            onClick={handlePrevImage}
            className="absolute bg-black/70 border border-gray-700 rounded-full left-4 p-2 sm:p-3 z-[60] text-white hover:bg-white hover:text-black transition-colors duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="relative max-w-5xl max-h-full">
            <img
              src={urlFor(image).width(1500).url()}
              alt={image.alt || 'Gallery image'}
              className="max-w-full max-h-[80vh] mb-10 object-contain rounded-lg shadow-2xl"
            />
            
            {image.caption && (
              <div className="absolute top-[-50px] left-0 right-0 text-center">
                <p className="text-white p-3 text-sm md:text-base rounded-lg backdrop-blur-sm">
                  {image.caption}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleNextImage}
            className="absolute bg-black/70 border border-gray-700 rounded-full right-4 p-2 sm:p-3 z-[60] text-white hover:bg-white hover:text-black transition-colors duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4">
          <div className="flex gap-2 p-2 bg-black/60 rounded-full backdrop-blur-sm overflow-x-auto max-w-full">
            {event.gallery.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className="relative flex-shrink-0"
                aria-label={`Go to image ${index + 1}`}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-colors ${
                  index === selectedImage ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                }`}>
                  <img 
                    src={urlFor(img).width(100).height(100).url()} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-red-100 rounded-full w-40 mb-8"></div>
            <div className="h-[400px] bg-gray-200 rounded-2xl mb-8 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-300 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <div className="h-10 bg-gray-300 rounded-full w-64 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded-full w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4 mt-8"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="bg-gray-100 rounded-2xl p-6 h-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-16 bg-gradient-to-b from-red-50 to-white flex items-center justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="bg-white p-8 rounded-2xl shadow-xl inline-block max-w-md mx-auto border border-red-100"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                <X className="w-12 h-12 text-red-500" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Event Not Found</h2>
            <p className="text-red-700 text-lg mb-8">{error || 'We couldn\'t find the event you\'re looking for. It may have been removed or is temporarily unavailable.'}</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/camp"
                className="inline-flex items-center px-6 py-3 bg-red-900 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Camps
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: delay 
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-gray-50 via-white to-red-50/30 pb-16 overflow-hidden max-w-7xl mx-auto min-h-screen"
    >
      {/* Hero Section with Parallax */}
      <div className="relative w-full">
        {event.image && (
          <div className="relative h-[65vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{ 
                y: scrollPosition * 0.2,
                scale: 1 + scrollPosition * 0.0005
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={urlFor(event.image).width(1920).height(1080).url()}
                alt={event.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
            </motion.div>
            
            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-between container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-20">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/camp"
                  className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-black/30 hover:bg-red-900 text-white rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 group shadow-lg text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>Back to Camps</span>
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl mb-4 sm:mb-6 md:mb-12"
              >
                <div className="space-y-3 sm:space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="inline-flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4"
                  >
                    <span className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 ${
                      event.isUpcoming 
                        ? 'bg-red-600 text-white' 
                        : 'bg-black/30 text-white backdrop-blur-sm'
                    }`}>
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {event.isUpcoming ? 'Upcoming Event' : 'Past Event'}
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 bg-black/30 text-white rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm inline-flex items-center">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight shadow-text mb-4 md:mb-6"
                  >
                    {event.title}
                  </motion.h1>
                  
                  {event.shortDesc && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mt-2 sm:mt-4 shadow-text mb-4 md:mb-6"
                    >
                      {event.shortDesc}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Decorative curve */}
        <div className="absolute -bottom-1 left-0 right-0 h-12 sm:h-16">
          <svg className="w-full h-full fill-white" preserveAspectRatio="none" viewBox="0 0 1440 74">
            <path d="M0,0V72.8C239.9,72.9,480.1,73,720,73C959.9,73,1200.1,73,1440,73V0Z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-6 sm:mt-8">
        {/* Background gradient overlay for glass morphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-white/10 to-red-100/20 pointer-events-none -mx-4 sm:-mx-6 lg:-mx-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About This Event - First on mobile */}
          <motion.div 
            className="order-1 lg:order-1 lg:col-span-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Description */}
            <motion.div 
              variants={fadeIn}
              custom={0.1}
              className="mb-12"
            >
              <motion.h2 
                variants={fadeIn}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 flex items-center"
              >
                <FileText className="w-8 h-8 mr-3 text-red-600" />
                About This Event
              </motion.h2>
              <motion.div 
                variants={fadeIn}
                className="prose prose-lg prose-red max-w-none"
              >
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">{event.desc}</p>
              </motion.div>
            </motion.div>

            {/* Event Gallery - Third on mobile, but on left column on desktop */}
            {event.gallery && event.gallery.length > 0 && (
              <motion.div 
                className="order-3 lg:order-1"
                variants={fadeIn}
                custom={0.3}
              >
                <motion.h2 
                  variants={fadeIn}
                  className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 flex items-center"
                >
                  <Camera className="w-8 h-8 mr-3 text-red-600" />
                  Event Gallery
                </motion.h2>
                <motion.div 
                  variants={fadeIn}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                >
                  {event.gallery.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className="relative aspect-square group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 backdrop-blur-sm"
                      whileHover={{ y: -8, scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <img
                        src={urlFor(image).width(400).height(400).url()}
                        alt={image.alt || `Gallery image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3" />
                      {image.caption && (
                        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <p className="text-white text-sm font-medium">{image.caption}</p>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Event Details - Sidebar on desktop */}
          <div className="order-2 lg:order-2 lg:col-span-1 lg:sticky lg:top-6 lg:self-start">
            {/* Main Event Details Box */}
            <motion.div 
              variants={fadeIn}
              initial="hidden" 
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-600/5 pointer-events-none"></div>
              <div className="relative flex items-center bg-gradient-to-r from-red-900/90 to-red-800/90 backdrop-blur-sm text-white p-6">
                <CalendarHeart className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-bold">Event Details</h2>
              </div>
              
              <div className="relative p-6 space-y-5 backdrop-blur-sm">
                <motion.div 
                  variants={fadeIn}
                  className="flex items-start p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg"
                >
                  <div className="bg-gradient-to-br from-red-100 to-red-50 p-3 rounded-xl mr-4 shadow-sm">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Date & Time</h3>
                    <p className="text-gray-600">
                      {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                      <br />
                      {format(new Date(event.date), 'h:mm a')}
                    </p>
                  </div>
                </motion.div>

                {event.expectedParticipants && (
                  <motion.div 
                    variants={fadeIn}
                    className="flex items-start p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg"
                  >
                    <div className="bg-gradient-to-br from-red-100 to-red-50 p-3 rounded-xl mr-4 shadow-sm">
                      <Users className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Expected Participants</h3>
                      <p className="text-gray-600">{event.expectedParticipants}</p>
                    </div>
                  </motion.div>
                )}
                
                <motion.div 
                  variants={fadeIn}
                  className="pt-6 mt-6 border-t border-white/30"
                >
                  {event.isUpcoming ? (
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <span>Get Involved</span>
                    </Link>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-100/80 to-blue-50/60 backdrop-blur-sm rounded-2xl p-5 text-blue-800 text-center border border-blue-200/50 shadow-lg">
                      <p className="font-medium">This event has already taken place</p>
                      <p className="text-sm mt-1 opacity-80">Browse our gallery to see the highlights</p>
                    </div>
                  )}
                </motion.div>
                
                <motion.div 
                  variants={fadeIn}
                  className="flex justify-center gap-4 pt-6 mt-6 border-t border-white/30"
                >
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: event.title,
                          text: event.shortDesc || `Check out this event: ${event.title}`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="flex flex-col items-center text-gray-700 hover:text-red-600 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-white/70 backdrop-blur-sm rounded-2xl mb-2 hover:bg-red-50 transition-all duration-300 shadow-lg group-hover:shadow-xl border border-white/50">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">Share</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Location Section - Outside the main box */}
            <motion.div 
              variants={fadeIn}
              initial="hidden" 
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-600/5 pointer-events-none"></div>
              <div className="relative flex items-center bg-gradient-to-r from-red-900/90 to-red-800/90 backdrop-blur-sm text-white p-6">
                <MapPin className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-bold">Location</h2>
              </div>
              
              <div className="relative p-6 backdrop-blur-sm">
                <motion.div 
                  variants={fadeIn}
                  className="p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg"
                >
                  <div className="flex items-start mb-4">
                    <div className="bg-gradient-to-br from-red-100 to-red-50 p-3 rounded-xl mr-4 shadow-sm">
                      <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Event Location</h3>
                      <p className="text-gray-600">{event.location}</p>
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 text-sm inline-flex items-center mt-1 transition-colors"
                      >
                        <span>View on map</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </div>
                  </div>
                  
                  {/* Embedded Map */}
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full"
                      title={`Map showing location: ${event.location}`}
                    ></iframe>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && <Lightbox />}

      {/* Custom CSS for text shadow */}
      <style>
        {`
          .shadow-text {
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
        `}
      </style>
    </motion.div>
  );
};

export default EventDetails; 