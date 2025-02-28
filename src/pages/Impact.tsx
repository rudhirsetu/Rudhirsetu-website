import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Heart, Activity, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchUpcomingEvents, fetchPastEvents, Event, Pagination } from '../services/strapi';
import { format } from 'date-fns';

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
        fetchUpcomingEvents(upcomingPage),
        fetchPastEvents(pastPage)
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

  const impactStats = [
    {
      title: 'Lives Impacted',
      value: '9,800+',
      icon: Heart,
      description: 'Through various healthcare initiatives'
    },
    {
      title: 'Blood Units Collected',
      value: '5,000+',
      icon: Activity,
      description: 'From our blood donation camps'
    },
    {
      title: 'Volunteers',
      value: '200+',
      icon: Users,
      description: 'Active community members'
    }
  ];

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

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Impact</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Together, we're making a difference in our community through various healthcare initiatives and awareness programs.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.title} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
                  <IconComponent className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</h4>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Upcoming Camps & Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-gradient-to-br from-white to-red-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-red-100">
                <div className="flex items-start space-x-4">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-red-900">{event.title}</h3>
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">Upcoming</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-2 text-red-600" />
                        <span className="font-medium">{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-2 text-red-600" />
                        <span>{format(new Date(event.date), 'h:mm a')}</span>
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
                      <p className="mt-4 text-gray-600 border-t border-red-100 pt-4">{event.desc}</p>
                    )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">Completed</span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{format(new Date(event.date), 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{event.location}</span>
                  </div>
                  {event.desc && (
                    <div className="flex items-start text-gray-600 border-t border-gray-100 pt-4 mt-4">
                      <Heart className="w-5 h-5 mr-2 mt-1 text-gray-500" />
                      <span>{event.desc}</span>
                    </div>
                  )}
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

        {/* Call to Action */}
        <div className="mt-16 text-center bg-red-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Want to Make a Difference?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in our upcoming events and help us create a positive impact in our community.
          </p>
          <div className="space-x-4">
            <a
              href="/contact"
              className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              Register for Events
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-red-700 text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 hover:text-white transition-colors"
            >
              Become a Volunteer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact; 