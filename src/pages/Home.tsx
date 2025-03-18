import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Calendar, MapPin, Users, ExternalLink, Activity, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }
    }
  };

  const keyAreas = [
    {
      title: 'Blood Donation',
      description: 'Monthly camps and emergency support with blood centers & hospitals',
      icon: <Heart className="w-10 h-10 text-red-500" />,
      color: 'bg-red-50',
      accentColor: 'border-red-200'
    },
    {
      title: 'Thalassemia Support',
      description: 'Free testing camps and comprehensive patient support for 68+ patients',
      icon: <Activity className="w-10 h-10 text-emerald-500" />,
      color: 'bg-emerald-50',
      accentColor: 'border-emerald-200'
    },
    {
      title: 'Eye Care',
      description: 'Free eye checkups, cataract screening & operations',
      icon: <Zap className="w-10 h-10 text-blue-500" />,
      color: 'bg-blue-50',
      accentColor: 'border-blue-200'
    },
    {
      title: 'Cancer Awareness',
      description: 'Focus on cervical and breast cancer awareness with free testing camps',
      icon: <Award className="w-10 h-10 text-purple-500" />,
      color: 'bg-purple-50',
      accentColor: 'border-purple-200'
    },
  ];

  const impactStats = [
    { label: 'Blood Donation Camps', value: '50+', subtext: 'Annually', color: 'from-red-500 to-red-600' },
    { label: 'Emergencies Supported', value: '9,800+', subtext: 'And counting', color: 'from-orange-500 to-red-500' },
    { label: 'Eye Checkups', value: '15,000+', subtext: 'Completed', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Cancer Awareness', value: '20,000+', subtext: 'Women reached', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <div className="space-y-0">
      <Hero />
      
      {/* Key Focus Areas */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="container mx-auto px-4 py-24 bg-white"
      >
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <span className="px-4 py-1.5 bg-red-100 text-red-900 text-sm font-medium rounded-full mb-6 inline-flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            Our Focus
          </span>
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Key Focus Areas</h2>
          <p className="text-xl text-gray-600">
            We're dedicated to creating positive impact through these key initiatives, each designed to address critical community needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {keyAreas.map((area) => (
            <motion.div 
              key={area.title}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border-b-2 border-red-900"
            >
              <div className="mb-6 text-red-900">{area.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{area.title}</h3>
              <p className="text-gray-700">{area.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Upcoming Events Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <span className="px-4 py-1.5 bg-red-100 text-red-900 text-sm font-medium rounded-full mb-6 inline-flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming Events
            </span>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Upcoming Events & Camps</h2>
            <p className="text-xl text-gray-600">
              Join us in our upcoming events and be a part of our mission to serve the community.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="h-64 bg-gray-200" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <motion.div 
                  key={event._id} 
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-xl shadow-md overflow-hidden group"
                >
                  {event.image && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={urlFor(event.image).width(600).height(400).url()}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1.5 bg-red-900 text-white text-sm font-medium rounded-full inline-flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </span>
                        {event.location && (
                          <span className="px-3 py-1.5 bg-black/50 text-white text-sm font-medium rounded-full inline-flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-red-900 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-2 text-base">{event.shortDesc || event.desc}</p>
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/event/${event._id}`}
                        className="inline-flex items-center font-medium text-red-900 group-hover:text-red-700 transition-colors duration-300"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                      
                      {event.expectedParticipants && (
                        <span className="inline-flex items-center text-gray-500 text-sm">
                          <Users className="w-4 h-4 mr-1.5" />
                          {event.expectedParticipants} expected
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            variants={itemVariants}
            className="text-center mt-16"
          >
            <Link
              to="/impact"
              className="inline-flex items-center justify-center px-8 py-4 bg-red-900 text-white rounded-lg font-semibold shadow-md hover:bg-red-800 transition-all duration-300 group"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Statistics */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 bg-red-900 text-white"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <span className="px-4 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full mb-6 inline-flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Our Impact
            </span>
            <h2 className="text-4xl font-bold mb-6">The Change We're Making</h2>
            <p className="text-xl text-white/90">
              With your support, we've achieved significant milestones in our mission to transform lives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat) => (
              <motion.div 
                key={stat.label} 
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all h-full">
                  <h3 className="text-4xl sm:text-5xl font-bold mb-3 text-white">
                    {stat.value}
                  </h3>
                  <div className="text-xl font-semibold mb-1 text-white">{stat.label}</div>
                  <div className="text-white/70">{stat.subtext}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>


      {/* Call to Action */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="container mx-auto px-4 py-24"
      >
        <motion.div 
          variants={fadeInUpVariants}
          className="relative z-10 max-w-4xl mx-auto bg-white border border-gray-100 p-12 md:p-16 rounded-2xl shadow-lg text-center"
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Join Us in Making a Difference!</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Whether you want to donate, volunteer, or partner with us, your support can help transform lives and empower communities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-900 text-white rounded-lg font-semibold shadow-md hover:bg-red-800 transition-all duration-200 gap-2 group"
              >
                <span>Contact Us</span>
                <ExternalLink className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/donations"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-red-900 text-red-900 hover:bg-red-900 hover:text-white rounded-lg font-semibold transition-all duration-200 gap-2 group"
              >
                <span>Donate Now</span>
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Home; 