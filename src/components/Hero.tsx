'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import CountUp from './CountUp';
import Iridescence from './Iridescence';

const Hero = () => {
  // Impact stats with the same settings as Home component
  const impactStats = [
    { 
      label: 'Blood Camps', 
      value: 50, 
      suffix: '+', 
      subtext: 'Annually',
      color: 'from-red-500 to-red-600', 
      duration: 0.5 
    },
    { 
      label: 'Lives Impacted', 
      value: 9800, 
      suffix: '+', 
      subtext: 'And counting', 
      color: 'from-orange-500 to-red-500', 
      duration: 0.1
    },
    {
      label: 'Eye Checkups', 
      value: 15000, 
      suffix: '+', 
      subtext: 'Completed', 
      color: 'from-emerald-500 to-emerald-600', 
      duration: 0.1
    },
    { 
      label: 'Cancer Awareness', 
      value: 20000, 
      suffix: '+', 
      subtext: 'Women reached', 
      color: 'from-indigo-500 to-indigo-600', 
      duration: 0.1 
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden md:pt-0 pt-16">
      {/* Iridescence Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Iridescence
          color={[1, 0.1, 0.1]}
          mouseReact={false}
          amplitude={1}
          speed={0.9}
        />
      </div>


      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 container mx-auto px-4 py-10 min-h-[85vh] flex flex-col justify-center"
      >
        <div className="w-full max-w-5xl mx-auto text-center items-center">
          {/* Main content */}
          <motion.div variants={itemVariants} className="mb-3 w-full">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-lg">
                <Heart className="text-red-300 w-4 h-4 animate-pulse" />
                <span className="text-white font-medium text-sm">Transforming Lives Since 2010</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight sm:leading-tight text-white mb-6 mx-auto"
            >
              <span className="block sm:inline">
                <span>Transforming </span>
                <span style={{ fontFamily: 'var(--font-pacifico), Pacifico, cursive', fontWeight: 'lighter' }}>Lives,</span>
              </span>{' '}
              <span className="text-white">
                <span style={{ fontFamily: 'var(--font-pacifico), Pacifico, cursive', fontWeight: 'lighter' }}>Empowering </span>
                <span>Communities</span>
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto mb-10"
            >
              We are a non-profit organization that provides free healthcare services to the community.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-row justify-center gap-3 sm:gap-5 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="max-w-[200px] h-[44px] sm:h-[52px] w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#9B2C2C] rounded-lg text-sm sm:text-base font-semibold hover:bg-[#FECACA] shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center gap-2 group "
              >
                <span>Get Involved</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/donations"
                className="max-w-[200px] h-[44px] sm:h-[52px] w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 inline-flex items-center justify-center gap-2 group"
              >
                <span>Donate Now</span>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-5xl mx-auto"
          >
            {impactStats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/30 shadow-lg"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index + 0.7, duration: 0.5 }}
                  className="text-3xl sm:text-4xl font-bold text-white"
                >
                  <CountUp
                    from={0}
                    to={stat.value}
                    duration={stat.duration}
                    delay={0.1 * index + 0.8}
                    separator=","
                    className="text-white"
                  />
                  {stat.suffix}
                </motion.div>
                <div className="text-sm sm:text-base text-gray-100 font-medium mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;