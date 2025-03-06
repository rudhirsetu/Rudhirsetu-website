import { useEffect, useState } from 'react';
import { MapPin, Users, Heart, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Event, Pagination } from '../types/sanity';
import { eventService } from '../services/sanity-client';
import { format } from 'date-fns';
import { urlFor } from '../lib/sanity';
import { Link } from 'react-router-dom';

const Impact = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [upcomingPagination, setUpcomingPagination] = useState<Pagination | null>(null);
  const [pastPagination, setPastPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async (upcomingPage = 1, pastPage = 1) => {
    try {
      setLoading(true);
      const [upcomingData, pastData] = await Promise.all([
        eventService.fetchUpcoming(upcomingPage),
        eventService.fetchPast(pastPage)
      ]);

      if (upcomingData) {
        setUpcomingEvents(upcomingData.data);
        setUpcomingPagination(upcomingData.meta.pagination);
      }
      if (pastData) {
        setPastEvents(pastData.data);
        setPastPagination(pastData.meta.pagination);
      }
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const PaginationControls = ({ pagination, onPageChange, label }: { 
    pagination: Pagination | null; 
    onPageChange: (page: number) => void;
    label: string;
  }) => {
    if (!pagination || pagination.pageCount <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <span className="text-sm text-gray-600">
          {label} {pagination.page} of {pagination.pageCount}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pageCount}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
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
              onClick={() => window.location.reload()}
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
          <h1 className="text-4xl font-bold mb-4">Our Camps & Events</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Together, we're making a difference in our community through various healthcare initiatives and awareness programs.
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Upcoming or Ongoing Camps & Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div 
                key={event._id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {event.image && (
                  <div className="relative h-64">
                    <img
                      src={urlFor(event.image).width(800).height(400).url()}
                      alt={event.title}
                      className="w-full h-full object-top object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                        {format(new Date(event.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-red-900">{event.title}</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full text-center bg-red-100 text-red-700`}>
                      Upcoming
                    </span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-2 text-red-600" />
                      <span>{format(new Date(event.date), 'MMMM d, yyyy h:mm a')}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-2 text-red-600" />
                      <span>{event.location}</span>
                    </div>
                    {event.expectedParticipants && (
                      <div className="flex items-center text-gray-700">
                        <Users className="w-5 h-5 mr-2 text-red-600" />
                        <span>Expected: {event.expectedParticipants}</span>
                      </div>
                    )}
                  </div>
                  {event.desc && (
                    <p className="text-gray-600 border-t border-red-100 pt-4 mb-4 line-clamp-2">{event.desc}</p>
                  )}
                  <div className="mt-auto">
                    <Link 
                      to={`/event/${event._id}`}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-500 font-medium rounded-xl transition-colors duration-300"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <PaginationControls
            pagination={upcomingPagination}
            onPageChange={(page) => loadEvents(page, pastPagination?.page || 1)}
            label="Page"
          />
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Past Camps & Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 mb-12 gap-6">
            {pastEvents.map((event) => (
              <div 
                key={event._id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                {event.image && (
                  <div className="relative h-64">
                    <img
                      src={urlFor(event.image).width(800).height(400).url()}
                      alt={event.title}
                      className="w-full h-full object-top object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-gray-600 text-white text-sm font-medium rounded-full">
                        {format(new Date(event.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                      Completed
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{format(new Date(event.date), 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  {event.desc && (
                    <div className="flex items-start text-gray-600 border-t border-gray-100 pt-4 mt-4">
                      <Heart className="w-5 h-5 mr-2 mt-1 text-gray-500" />
                      <p className="line-clamp-2">{event.desc}</p>
                    </div>
                  )}
                  <div className="mt-auto pt-4">
                    <Link 
                      to={`/event/${event._id}`}
                      className="inline-flex items-center px-4 py-2 bg-gray-600  text-white hover:bg-gray-500 font-medium rounded-xl transition-colors duration-300"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <PaginationControls
            pagination={pastPagination}
            onPageChange={(page) => loadEvents(upcomingPagination?.page || 1, page)}
            label="Page"
          />
        </section>

      </div>
    </div>
  );
};

export default Impact; 