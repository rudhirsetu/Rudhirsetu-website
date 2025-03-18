import { useEffect, useState } from 'react';
import { MapPin, Users, Heart, Clock, ChevronLeft, ChevronRight, ArrowRight, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

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
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

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

  if (loading) {
    return (
      <div className="py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse max-w-md mx-auto">
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-full mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 p-6 sm:p-8 rounded-2xl inline-block max-w-md mx-auto shadow-lg"
          >
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-4 opacity-50" />
            <p className="text-red-700 text-xl mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-12 sm:py-16"
    >
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12 sm:mb-16"
        >
          <span className="px-4 py-1.5 bg-red-50 text-[#9B2C2C] text-sm font-medium rounded-full mb-4 sm:mb-6 inline-flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Our Events & Camps
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">Making a Difference Together</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Together, we're making a difference in our community through various healthcare initiatives and awareness programs.
          </p>
        </motion.div>

        {/* Upcoming Events */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-16 sm:mb-24"
        >
          <motion.div 
            variants={itemVariants}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Upcoming & Ongoing Events</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <motion.div 
                  key={event._id} 
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {event.image && (
                    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                      <img
                        src={urlFor(event.image).width(800).height(400).url()}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-emerald-500 text-white text-sm font-medium rounded-full">
                          Upcoming
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-full inline-flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#9B2C2C] transition-colors duration-300">{event.title}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-3 text-[#9B2C2C]" />
                        <span>{format(new Date(event.date), 'h:mm a')}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-3 text-[#9B2C2C]" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      {event.expectedParticipants && (
                        <div className="flex items-center text-gray-700">
                          <Users className="w-5 h-5 mr-3 text-[#9B2C2C]" />
                          <span>Expected: {event.expectedParticipants} participants</span>
                        </div>
                      )}
                    </div>
                    
                    {event.desc && (
                      <p className="text-gray-600 mb-6 line-clamp-2 text-sm sm:text-base">{event.desc}</p>
                    )}
                    
                    <div className="mt-auto">
                      <Link 
                        to={`/event/${event._id}`}
                        className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg group-hover:shadow-xl text-sm sm:text-base"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                variants={itemVariants} 
                className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12"
              >
                <p className="text-gray-600 text-lg">No upcoming events at this time. Check back soon!</p>
              </motion.div>
            )}
          </div>
          
          <motion.div variants={itemVariants}>
            <PaginationControls
              pagination={upcomingPagination}
              onPageChange={(page) => loadEvents(page, pastPagination?.page || 1)}
              label="Page"
            />
          </motion.div>
        </motion.section>

        {/* Past Events */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Past Events & Camps</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <motion.div 
                  key={event._id} 
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {event.image && (
                    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                      <img
                        src={urlFor(event.image).width(800).height(400).url()}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter grayscale-[30%] group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1.5 bg-gray-700 text-white text-sm font-medium rounded-full inline-flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{event.title}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-gray-500" />
                        <span>{format(new Date(event.date), 'h:mm a')}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                    
                    {event.desc && (
                      <div className="flex items-start text-gray-600 mb-6">
                        <Heart className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                        <p className="line-clamp-2 text-sm sm:text-base">{event.desc}</p>
                      </div>
                    )}
                    
                    <div className="mt-auto">
                      <Link 
                        to={`/event/${event._id}`}
                        className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white font-medium rounded-xl hover:bg-gray-600 transition-colors duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                variants={itemVariants} 
                className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12"
              >
                <p className="text-gray-600 text-lg">No past events found.</p>
              </motion.div>
            )}
          </div>
          
          <motion.div variants={itemVariants}>
            <PaginationControls
              pagination={pastPagination}
              onPageChange={(page) => loadEvents(upcomingPagination?.page || 1, page)}
              label="Page"
            />
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Impact; 