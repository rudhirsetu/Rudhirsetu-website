import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import { Event } from '../types/sanity';
import { eventService } from '../services/sanity-client';
import { urlFor } from '../lib/sanity';
import { format } from 'date-fns';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.fetchUpcoming(1, 3); // Fetch only 3 upcoming events
        if (data) {
          setUpcomingEvents(data.data);
        }
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const keyAreas = [
    {
      title: 'Blood Donation',
      description: 'Monthly camps and emergency support with blood centers & hospitals',
      icon: '🩸',
    },
    {
      title: 'Thalassemia Support',
      description: 'Free testing camps and comprehensive patient support for 68+ patients',
      icon: '🏥',
    },
    {
      title: 'Eye Care',
      description: 'Free eye checkups, cataract screening & operations',
      icon: '👁️',
    },
    {
      title: 'Cancer Awareness',
      description: 'Focus on cervical and breast cancer awareness with free testing camps',
      icon: '🎗️',
    },
  ];

  const impactStats = [
    { label: 'Blood Donation Camps', value: '50+', subtext: 'Annually' },
    { label: 'Emergencies Supported', value: '9800+', subtext: 'And counting' },
    { label: 'Eye Checkups', value: '15,000+', subtext: 'Completed' },
    { label: 'Cancer Awareness', value: '20,000+', subtext: 'Women reached' },
  ];

  return (
    <div className="space-y-16">
      <Hero />
      
      {/* Key Focus Areas */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Key Focus Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {keyAreas.map((area) => (
            <div key={area.title} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{area.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
              <p className="text-gray-600">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events & Camps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join us in our upcoming events and be a part of our mission to serve the community.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {event.image && (
                    <div className="relative h-64">
                      <img
                        src={urlFor(event.image).width(600).height(400).url()}
                        alt={event.title}
                        className="w-full h-full object-top object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.shortDesc || event.desc}</p>
                    <Link
                      to={`/event/${event._id}`}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-500 font-medium rounded-xl transition-colors duration-300"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/impact"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-red-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-red-700 mb-2">{stat.value}</div>
                <div className="text-xl font-semibold mb-1">{stat.label}</div>
                <div className="text-gray-600">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 text-center py-16">
        <h2 className="text-3xl font-bold mb-6">Join Us in Making a Difference!</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Whether you want to donate, volunteer, or partner with us, your support can help transform lives.
        </p>
        <div className="space-x-4">
          <Link
            to="/contact"
            className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/donations"
            className="inline-block border-2 border-red-700 text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 hover:text-white transition-colors"
          >
            Donate Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 