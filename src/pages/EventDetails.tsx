import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Heart, Clock, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../types/sanity';
import { client } from '../lib/sanity';
import { urlFor } from '../lib/sanity';
import { format } from 'date-fns';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

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
  }, [selectedImage]);

  useEffect(() => {
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

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handlePrevImage = () => {
    if (selectedImage === null || !event?.gallery) return;
    setSelectedImage(selectedImage === 0 ? event.gallery.length - 1 : selectedImage - 1);
  };

  const handleNextImage = () => {
    if (selectedImage === null || !event?.gallery) return;
    setSelectedImage(selectedImage === event.gallery.length - 1 ? 0 : selectedImage + 1);
  };

  const Lightbox = () => {
    if (selectedImage === null || !event?.gallery) return null;

    const image = event.gallery[selectedImage];

    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute bg-black/50 border-1 border-gray-300 rounded-full top-6 right-6 p-2 text-red-600 hover:text-gray-300 transition-colors z-[60]"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6 md:w-10 md:h-10" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center p-4">
          <button
            onClick={handlePrevImage}
            className="absolute bg-black/50 border-1 border-gray-300 rounded-full left-4 p-2 z-[60] text-gray-300 hover:text-gray-300 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 md:w-10 md:h-10" />
          </button>

          <div className="relative max-w-4xl max-h-full">
            <img
              src={urlFor(image).width(1200).url()}
              alt={image.alt || 'Gallery image'}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {image.caption && (
              <p className="absolute bottom-0 left-0 right-0 text-center text-white bg-black/50 p-2">
                {image.caption}
              </p>
            )}
          </div>

          <button
            onClick={handleNextImage}
            className="absolute bg-black/50 border-1 border-gray-300 rounded-full right-4 p-2 z-[60] text-gray-300 hover:text-gray-300 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 md:w-10 md:h-10" />
          </button>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {event.gallery.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === selectedImage ? 'bg-white' : 'bg-gray-500 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 p-4 rounded-lg inline-block">
            <p className="text-red-700 text-center text-xl">{error || 'Event not found'}</p>
            <Link
              to="/impact"
              className="mt-4 inline-flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-0 pb-8">
      <div className="container mx-auto px-0 md:px-32">
        {/* Back Button - Now floating over the image */}
        <div className="relative">
          {/* Event Image */}
          {event.image && (
            <div className="relative h-[600px]">
              <img
                src={urlFor(event.image).width(1200).height(800).url()}
                alt={event.title}
                className="w-full h-full object-top object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/40 " />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                <Link
                  to="/impact"
                  className="inline-flex bg-red-600 px-4 py-2 rounded-full items-center text-white hover:text-gray-200 transition-colors w-fit"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Events
                </Link>

                <div className="max-w-4xl">
                  <div className="flex flex-col items-start gap-4 mb-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">{event.title}</h1>
                    <span 
                      className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white"
                    >
                      {event.isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="container mx-auto mt-8 px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Description */}
              <div className="p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                <p className="text-gray-600 whitespace-pre-line">{event.desc}</p>
              </div>

              {/* Gallery Section */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Camp Photos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className="relative aspect-square group overflow-hidden rounded-lg"
                      >
                        <img
                          src={urlFor(image).width(400).height(400).url()}
                          alt={image.alt || `Gallery image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {image.caption && (
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-black/50">
                            <p className="text-white text-sm text-center">{image.caption}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Event Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-red-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Date & Time</h3>
                      <p className="text-gray-600">
                        {format(new Date(event.date), 'MMMM d, yyyy')}
                        <br />
                        {format(new Date(event.date), 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-red-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Location</h3>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>

                  {event.expectedParticipants && (
                    <div className="flex items-start">
                      <Users className="w-5 h-5 text-red-600 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Expected Participants</h3>
                        <p className="text-gray-600">{event.expectedParticipants}</p>
                      </div>
                    </div>
                  )}

                  {event.isUpcoming && (
                    <Link
                      to="/contact"
                      className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Get Involved
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox />
    </div>
  );
};

export default EventDetails; 