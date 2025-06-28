'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Calendar, ExternalLink, Activity, Zap, Award, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import { Event, GalleryImage } from '../types/sanity';
import { eventService } from '../services/sanity-client';
import { FeaturedCarousel, ImageLightbox } from '../components/GalleryComponents';
import { client } from '../lib/sanity';
import { QUERIES } from '../lib/sanity';
import EventCard from '../components/EventCard';

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, imagesData] = await Promise.all([
          eventService.fetchUpcoming(1, 3), // Fetch only 3 upcoming events
          client.fetch(QUERIES.featuredImages)
        ]);
        
        if (eventsData) {
          setUpcomingEvents(eventsData.data);
        }
        
        if (imagesData) {
          setFeaturedImages(imagesData || []);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
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
      transition: { duration: 0.6 }
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
      title: 'Cancer Awareness',
      description: 'Focus on cervical and breast cancer awareness with free testing camps',
      icon: <Award className="w-10 h-10 text-purple-500" />,
      color: 'bg-purple-50',
      accentColor: 'border-purple-200'
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
    }
  ];

  const impactStats = [
    { label: 'Blood Donation Camps', value: '50+', subtext: 'Annually', color: 'from-red-500 to-red-600' },
    { label: 'Emergencies Supported', value: '9,800+', subtext: 'And counting', color: 'from-orange-500 to-red-500' },
    { label: 'Eye Checkups', value: '15,000+', subtext: 'Completed', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Cancer Awareness', value: '20,000+', subtext: 'Women reached', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <div className="space-y-0 overflow-x-hidden">
      <Hero />
      
      {/* Key Focus Areas */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto px-4 py-32 bg-gradient-to-br from-slate-50 via-white to-red-50/30 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100/40 to-transparent rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-100/40 to-transparent rounded-full blur-3xl translate-y-20 -translate-x-20"></div>
        
        <div className="relative z-10">
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-red-200/50 rounded-2xl mb-8 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-red-800 font-semibold text-sm tracking-wide uppercase">Our Focus</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-gray-900 tracking-tight">
              <span className="bg-black bg-clip-text text-transparent">
                Key Focus Areas
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl">
              We&apos;re dedicated to creating positive impact through these key initiatives, each designed to address critical community needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {keyAreas.map((area) => (
              <motion.div 
                key={area.title}
                variants={itemVariants}
                whileHover={{ 
                  y: -12, 
                  scale: 1.02,
                  transition: { duration: 0.4, ease: "easeOut" } 
                }}
                className="group relative"
              >
                <div className="relative h-full bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-gray-200/50 hover:border-red-300/60 transition-all duration-500 overflow-hidden">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className="mb-6 relative">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                        <div className="text-white">
                          {area.icon}
                        </div>
                      </div>
                      {/* Floating decoration */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-red-800 transition-colors duration-300">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {area.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Impact Statistics */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 py-24 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div 
            variants={itemVariants}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mb-8">
              <Activity className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm tracking-wide uppercase">Our Impact</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Making a Real Difference
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Numbers that reflect our commitment to transforming lives and strengthening communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <div className="text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                      {stat.subtext}
                    </div>
                  </div>
                  <p className="text-gray-300 font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-24 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              variants={itemVariants}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16"
            >
              <div className="mb-8 lg:mb-0">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-50 border border-red-200 rounded-2xl mb-6">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-semibold text-sm tracking-wide uppercase">Upcoming</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                  Join Our Events
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Be part of our mission to create positive change in communities across India
                </p>
              </div>
              
              <Link 
                href="/social"
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-colors duration-300 group"
              >
                View All Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.slice(0, 3).map((event) => (
                <motion.div key={event._id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Featured Gallery */}
      {featuredImages.length > 0 && (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-24 bg-gradient-to-br from-slate-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              variants={itemVariants}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16"
            >
              <div className="mb-8 lg:mb-0">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl mb-6">
                  <Image className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800 font-semibold text-sm tracking-wide uppercase">Gallery</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                  Moments of Impact
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Witness the stories of hope, transformation, and community spirit through our gallery
                </p>
              </div>
              
              <Link 
                href="/gallery"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-colors duration-300 group"
              >
                View Gallery
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <FeaturedCarousel 
                featuredImages={featuredImages.slice(0, 10)} 
                onImageClick={(image, index) => {
                  setSelectedImage(image);
                  setSelectedImageIndex(index);
                }}
              />
            </motion.div>
          </div>

          {/* Image Lightbox */}
          {selectedImage && (
            <ImageLightbox
              selectedImage={selectedImage}
              images={featuredImages}
              selectedIndex={selectedImageIndex}
              onClose={() => setSelectedImage(null)}
              onPrev={() => {
                const prevIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : featuredImages.length - 1;
                setSelectedImageIndex(prevIndex);
                setSelectedImage(featuredImages[prevIndex]);
              }}
              onNext={() => {
                const nextIndex = selectedImageIndex < featuredImages.length - 1 ? selectedImageIndex + 1 : 0;
                setSelectedImageIndex(nextIndex);
                setSelectedImage(featuredImages[nextIndex]);
              }}
            />
          )}
        </motion.section>
      )}
    </div>
  );
} 