import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ChevronDown } from 'lucide-react';

const Hero = () => {
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
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
  };

  // Parallax effect for scrolling
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center">
      {/* Background with overlay gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 via-red-800/90 to-red-700/80" />
      </div>

      {/* Overlay pattern */}
      <div className="absolute inset-0 z-[1] bg-black opacity-50 mix-blend-overlay pattern-grid-lg" />

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 container mx-auto px-4 py-10 min-h-[85vh] flex flex-col justify-center"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Main content */}
          <motion.div variants={itemVariants} className="mb-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-red-200/20 shadow-lg">
                <Heart className="text-red-200 w-4 h-4 animate-pulse" />
                <span className="text-white/90 font-medium text-sm">Transforming Lives Since 2010</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white mb-6"
            >
              Transforming Lives,{' '}
              <span className="relative">
                <span className="relative z-10 text-[#FECACA]">Empowering Communities</span>
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-100/90 leading-relaxed max-w-3xl mx-auto mb-10"
            >
              Join us in our mission to make a difference through blood donation, healthcare support, and community service.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-5 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                className="w-full sm:w-auto text-center px-8 py-4 bg-white text-[#9B2C2C] rounded-lg font-semibold hover:bg-[#FECACA] shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center gap-2 group"
              >
                <span>Get Involved</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/donations"
                className="w-full sm:w-auto text-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 inline-flex items-center justify-center gap-2 group"
              >
                <span>Donate Now</span>
                <Heart className="w-5 h-5 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-5xl mx-auto"
          >
            {[
              { count: '50+', label: 'Blood Camps' },
              { count: '9800+', label: 'Lives Impacted' },
              { count: '15K+', label: 'Eye Checkups' },
              { count: '20K+', label: 'People Reached' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20 shadow-lg"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index + 0.7, duration: 0.5 }}
                  className="text-3xl sm:text-4xl font-bold text-[#FECACA]"
                >
                  {stat.count}
                </motion.div>
                <div className="text-sm sm:text-base text-gray-100 font-medium mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={handleScroll}
        className="absolute bottom-16 hidden md:block left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center"
        >
          <span className="text-white/70 text-sm mb-2">Scroll Down</span>
          <ChevronDown className="text-white/70 w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero; 