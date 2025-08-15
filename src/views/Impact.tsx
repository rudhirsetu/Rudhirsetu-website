import { useEffect, useState, useCallback } from 'react';
import { Heart, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Event, Pagination } from '../types/sanity';
import { eventService } from '../services/sanity-client';
import EventCard from '../components/EventCard';
import { StructuredData } from '../components/StructuredData';
import { CampPageData } from '../lib/structured-data';

const PaginationControls = ({ pagination, onPageChange, label }: { 
  pagination: Pagination | null; 
  onPageChange: (page: number) => void;
  label: string;
}) => {
  if (!pagination || pagination.pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8">
      <span className="text-sm text-gray-600 font-medium">
        {label} {pagination.page} of {pagination.pageCount}
      </span>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pageCount}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

const Impact = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [upcomingPagination, setUpcomingPagination] = useState<Pagination | null>(null);
  const [pastPagination, setPastPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const loadEvents = useCallback(async (upcomingPage = 1, pastPage = 1, showLoading = true) => {
    try {
      // Only show loading for initial load or when explicitly requested
      if (showLoading && !initialLoadComplete) {
        setLoading(true);
      }
      
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
      
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    // Only scroll to top if user is significantly down the page - separate effect
    if (window.scrollY > window.innerHeight) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleUpcomingPageChange = useCallback((page: number) => {
    loadEvents(page, pastPagination?.page || 1, false);
  }, [loadEvents, pastPagination?.page]);

  const handlePastPageChange = useCallback((page: number) => {
    loadEvents(upcomingPagination?.page || 1, page, false);
  }, [loadEvents, upcomingPagination?.page]);

  if (loading && !initialLoadComplete) {
    return (
      <div className="pt-[100px] pb-12 sm:pb-16">
        <div className="container mx-auto px-4">
          {/* Skeleton Header */}
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="w-32 h-8 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
          </div>

          {/* Skeleton Events */}
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
                <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200">
                  <div className="absolute top-4 right-4">
                    <div className="w-24 h-6 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-32 h-7 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 md:p-8 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-200 rounded mr-3 min-w-[20px] min-h-[20px]"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-200 rounded mr-3 min-w-[20px] min-h-[20px]"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-200 rounded mr-3 min-w-[20px] min-h-[20px]"></div>
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[100px] pb-16 sm:pb-24">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 p-6 sm:p-8 rounded-2xl inline-block max-w-md mx-auto shadow-lg">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-4 opacity-50" />
            <p className="text-red-700 text-xl mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <StructuredData data={CampPageData} id="camp-page-structured-data" />
      <div className="pt-[100px] pb-12 sm:pb-16">
        <div className="container mx-auto px-4">
          {/* Show subtle loading indicator during pagination */}
          {loading && initialLoadComplete && (
            <div className="fixed top-[100px] left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg px-4 py-2 border">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            </div>
          )}
          {/* Page Header */}
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <span className="px-4 py-1.5 bg-red-50 text-[#9B2C2C] text-sm font-medium rounded-full mb-4 sm:mb-6 inline-flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Our Events & Camps
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">Making a Difference Together</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Together, we&apos;re making a difference in our community through various healthcare initiatives and awareness programs.
            </p>
          </div>

          {/* Upcoming Events */}
          <section className="mb-16 sm:mb-24">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Upcoming & Ongoing Events</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} variant="upcoming" />
                ))
              ) : (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12">
                  <p className="text-gray-600 text-lg">No upcoming events at this time. Check back soon!</p>
                </div>
              )}
            </div>
            
            <div>
              <PaginationControls
                pagination={upcomingPagination}
                onPageChange={handleUpcomingPageChange}
                label="Page"
              />
            </div>
          </section>

          {/* Past Events */}
          <section>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Past Events & Camps</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {pastEvents.length > 0 ? (
                pastEvents.map((event) => (
                  <EventCard key={event._id} event={event} variant="past" />
                ))
              ) : (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12">
                  <p className="text-gray-600 text-lg">No past events found.</p>
                </div>
              )}
            </div>
            
            <div>
              <PaginationControls
                pagination={pastPagination}
                onPageChange={handlePastPageChange}
                label="Page"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Impact;