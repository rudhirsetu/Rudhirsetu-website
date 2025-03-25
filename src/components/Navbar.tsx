import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Phone, Menu, X, Home, Share2, Image, Gift, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import { settingsService } from '../services/sanity-client';
import type { SocialMediaSettings } from '../types/sanity';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialMediaSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const data = await settingsService.fetchSocialMedia();
        setSocialLinks(data);
      } catch (err) {
        console.error('Error loading social media links:', err);
      }
    };
    loadSocialLinks();
  }, []);

  // Effect to move translate element between desktop and mobile containers
  useEffect(() => {
    const translateElement = document.getElementById('google_translate_element');
    const desktopContainer = document.getElementById('desktop_translate_container');
    const mobileContainer = document.getElementById('mobile_translate_container');

    if (translateElement && desktopContainer && mobileContainer) {
      const moveTranslateElement = () => {
        const isMobile = window.innerWidth < 768; // md breakpoint
        if (isMobile) {
          mobileContainer.appendChild(translateElement);
        } else {
          desktopContainer.appendChild(translateElement);
        }
      };

      moveTranslateElement();
      window.addEventListener('resize', moveTranslateElement);
      return () => window.removeEventListener('resize', moveTranslateElement);
    }
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/impact', label: 'Camps', icon: Heart },
    { path: '/gallery', label: 'Gallery', icon: Image },
    { path: '/donations', label: 'Donate', icon: Gift },
    { path: '/social', label: 'Socials', icon: Share2 },
    { path: '/contact', label: 'Contact', icon: Phone }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const SocialLinks = () => (
    <div className="flex items-center space-x-4">
      {socialLinks?.linkedinUrl && (
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          href={socialLinks.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#0077b5] transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-6 h-6" />
        </motion.a>
      )}
      {socialLinks?.facebookUrl && (
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          href={socialLinks.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#1877f2] transition-colors"
          aria-label="Facebook"
        >
          <Facebook className="w-6 h-6" />
        </motion.a>
      )}
      {socialLinks?.instagramUrl && (
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          href={socialLinks.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#e4405f] transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="w-6 h-6" />
        </motion.a>
      )}
      {socialLinks?.youtubeUrl && (
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          href={socialLinks.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#ff0000] transition-colors"
          aria-label="YouTube"
        >
          <Youtube className="w-6 h-6" />
        </motion.a>
      )}
    </div>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center space-x-3">
              <img
                className="h-16 w-auto"
                src="/images/logo.webp"
                alt="Rudhirsetu Logo"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-[#9B2C2C]">
                  Rudhirsetu
                </span>
                <span className="text-xs text-gray-600">
                  Seva Sanstha
                </span>
              </div>
            </Link>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive(item.path)
                        ? 'bg-[#9B2C2C] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-4">
              <SocialLinks />
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-4 md:hidden">
            <div id="mobile_translate_container" />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
              aria-label="Menu"
            >
              {!isOpen ? (
                <Menu className="w-6 h-6" />
              ) : (
                <X className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white"
          >
            <div className="px-4 py-4 space-y-2 border-t border-gray-200">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-md font-medium ${
                        isActive(item.path)
                          ? 'bg-[#9B2C2C] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex flex-col space-y-4">
                  <span className="text-sm font-medium text-gray-700">Follow us on:</span>
                  <SocialLinks />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar; 
