'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Phone, Menu, X, Home, Share2, Image, Gift, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import { settingsService } from '../services/sanity-client';
import type { SocialMediaSettings } from '../types/sanity';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialMediaSettings | null>(null);
  const pathname = usePathname();

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

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/camp', label: 'Camps', icon: Heart },
    { path: '/gallery', label: 'Gallery', icon: Image },
    { path: '/donations', label: 'Donate', icon: Gift },
    { path: '/social', label: 'Socials', icon: Share2 },
    { path: '/contact', label: 'Contact', icon: Phone }
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const SocialLinkSize = 'w-8 h-8 md:w-6 md:h-6';
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
          <Linkedin className={SocialLinkSize} />
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
          <Facebook className={SocialLinkSize} />
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
          <Instagram className={SocialLinkSize} />
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
          <Youtube className={SocialLinkSize} />
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
            <Link href="/" className="flex items-center space-x-3">
              <img
                className="h-12 w-auto"
                src="/images/logo-dark.svg"
                alt="Rudhirsetu Logo"
              />
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight text-[#9B2C2C]">
                  Rudhirsetu
                </span>
                <span className="text-sm font-bold tracking-tight text-[#9B2C2C]">
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
                    href={item.path}
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
            animate={{ opacity: 1, height: 'calc(60vh + 2rem)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-20 bg-white shadow-lg z-40 flex flex-col"
            style={{ overflowY: 'auto' }}
          >
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.path}
                        className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium ${
                          isActive(item.path)
                            ? 'bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white shadow-md">
              <div className="flex flex-col space-y-2">
                <span className="text-md font-medium text-gray-500">Follow us on:</span>
                <div className="flex gap-4">
                  <SocialLinks />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          body {
            overflow: ${isOpen ? 'hidden' : 'auto'};
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
