'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PreloadLink from './PreloadLink';
import { Heart, Phone, Menu, X, Home, Share2, Image, Gift } from 'lucide-react';
  // import { settingsService } from '../services/sanity-client';
  // import type { SocialMediaSettings } from '../types/sanity';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  // const [socialLinks, setSocialLinks] = useState<SocialMediaSettings | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check if we're on homepage and if loading screen should be shown
    const isHomepage = pathname === '/';
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    
    if (isHomepage && !hasVisited) {
      // Delay navbar animation to sync with loading screen split (2.1 seconds)
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 2100);
      return () => clearTimeout(timer);
    } else {
      // On other pages or if already visited, animate immediately
      setShouldAnimate(true);
    }
  }, [pathname]);

  // useEffect(() => {
  //   const loadSocialLinks = async () => {
  //     try {
  //       const data = await settingsService.fetchSocialMedia();
  //       setSocialLinks(data);
  //     } catch (err) {
  //       console.error('Error loading social media links:', err);
  //     }
  //   };
  //   loadSocialLinks();
  // }, []);

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

  // const SocialLinkSize = 'w-8 h-8 md:w-6 md:h-6';
  // const SocialLinks = () => (
  //   <div className="flex items-center space-x-4">
  //     {socialLinks?.linkedinUrl && (
  //       <motion.a
  //         whileHover={{ scale: 1.1 }}
  //         whileTap={{ scale: 0.95 }}
  //         href={socialLinks.linkedinUrl}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="text-gray-600 hover:text-[#0077b5] transition-colors"
  //         aria-label="LinkedIn"
  //       >
  //         <Linkedin className={SocialLinkSize} />
  //       </motion.a>
  //     )}
  //     {socialLinks?.facebookUrl && (
  //       <motion.a
  //         whileHover={{ scale: 1.1 }}
  //         whileTap={{ scale: 0.95 }}
  //         href={socialLinks.facebookUrl}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="text-gray-600 hover:text-[#1877f2] transition-colors"
  //         aria-label="Facebook"
  //       >
  //         <Facebook className={SocialLinkSize} />
  //       </motion.a>
  //     )}
  //     {socialLinks?.instagramUrl && (
  //       <motion.a
  //         whileHover={{ scale: 1.1 }}
  //         whileTap={{ scale: 0.95 }}
  //         href={socialLinks.instagramUrl}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="text-gray-600 hover:text-[#e4405f] transition-colors"
  //         aria-label="Instagram"
  //       >
  //         <Instagram className={SocialLinkSize} />
  //       </motion.a>
  //     )}
  //     {socialLinks?.youtubeUrl && (
  //       <motion.a
  //         whileHover={{ scale: 1.1 }}
  //         whileTap={{ scale: 0.95 }}
  //         href={socialLinks.youtubeUrl}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="text-gray-600 hover:text-[#ff0000] transition-colors"
  //         aria-label="YouTube"
  //       >
  //         <Youtube className={SocialLinkSize} />
  //       </motion.a>
  //     )}
  //   </div>
  // );

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={shouldAnimate ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-2 left-0 right-0 z-[50] transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-center">
          {/* Desktop Menu Island with Logo */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex items-center space-x-6 bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-gray-200/50 shadow-sm">
              {/* Logo inside island */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center"
              >
                <PreloadLink href="/" priority="high" className="flex items-center space-x-2">
                  <img
                    className="h-10 w-auto"
                    src="/images/logo-dark.svg"
                    alt="Rudhirsetu Logo"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-light tracking-tight text-[#9B2C2C]" style={{ fontFamily: 'var(--font-pacifico)', fontWeight: '400' }}>
                      Rudhirsetu
                    </span>
                    <span className="text-xs font-semibold tracking-tight text-[#9B2C2C]">
                      Seva Sanstha
                    </span>
                  </div>
                </PreloadLink>
              </motion.div>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-300/60"></div>

                            {/* Navigation Items */}
              <div className="flex items-center space-x-1 relative">
                {/* Top bar indicator */}
                <motion.div
                  className="absolute top-0 bg-[#9B2C2C] rounded-b-lg"
                  style={{
                    height: '3px',
                    zIndex: 10
                  }}
                  animate={{
                    x: navItems.findIndex(item => isActive(item.path)) * 110 + 30, // Approximate width + gap + centering
                    width: '50px',
                    opacity: navItems.some(item => isActive(item.path)) ? 1 : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    duration: 0.3
                  }}
                />
                
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      style={{ zIndex: 1 }}
                    >
                      <PreloadLink
                        href={item.path}
                        priority={item.path === '/' || item.path === '/donations' || item.path === '/camp' ? 'high' : 'medium'}
                        className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 group ${
                          isActive(item.path)
                            ? 'text-[#9B2C2C] font-semibold'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-md'
                        }`}
                      >
                        <Icon className={`w-4 h-4 transition-transform duration-300 ${
                          isActive(item.path) ? 'text-[#9B2C2C]' : 'group-hover:scale-110'
                        }`} />
                        <span className="font-semibold">{item.label}</span>
                      </PreloadLink>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Menu Island */}
          <div className="lg:hidden flex items-center justify-center w-full">
            <div className="flex items-center justify-between w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-gray-200/50 shadow-sm">
              {/* Mobile Logo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center"
              >
                <PreloadLink href="/" priority="high" className="flex items-center space-x-2">
                  <img
                    className="h-8 w-auto"
                    src="/images/logo-dark.svg"
                    alt="Rudhirsetu Logo"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-light tracking-tight text-[#9B2C2C]" style={{ fontFamily: 'var(--font-pacifico)', fontWeight: '400' }}>
                      Rudhirsetu
                    </span>
                    <span className="text-xs font-semibold tracking-tight text-[#9B2C2C]">
                      Seva Sanstha
                    </span>
                  </div>
                </PreloadLink>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100/80"
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
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden fixed top-16 left-1/2 transform -translate-x-1/2 z-40 w-[92%] max-w-sm"
            >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Header with Logo and Close Button */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-200/50">
                <div className="flex items-center space-x-2">
                  <img
                    className="h-8 w-auto"
                    src="/images/logo-dark.svg"
                    alt="Rudhirsetu Logo"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-light tracking-tight text-[#9B2C2C]" style={{ fontFamily: 'var(--font-pacifico)', fontWeight: '400' }}>
                      Rudhirsetu
                    </span>
                    <span className="text-xs font-semibold tracking-tight text-[#9B2C2C]">
                      Seva Sanstha
                    </span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Navigation Items */}
              <div className="p-5 space-y-3">
                {navItems
                  .filter(item => item.path !== '/donations' && item.path !== '/social')
                  .map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <PreloadLink
                          href={item.path}
                          priority={item.path === '/' || item.path === '/camp' ? 'high' : 'medium'}
                          className={`relative flex items-center space-x-3 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 group ${
                            isActive(item.path)
                              ? 'bg-[#9B2C2C] text-white shadow-lg shadow-red-900/25'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className={`w-5 h-5 transition-transform duration-200 ${
                            isActive(item.path) ? '' : 'group-hover:scale-110'
                          }`} />
                          <span className="font-semibold">{item.label}</span>
                        </PreloadLink>
                      </motion.div>
                    );
                  })}
              </div>

              {/* Featured Actions - Donate & Social */}
              <div className="p-5 pt-3 border-t border-gray-200/50 bg-gradient-to-b from-transparent to-red-50/30">
                <div className="grid grid-cols-2 gap-3">
                  {/* Donate Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PreloadLink
                      href="/donations"
                      priority="high"
                      className={`relative flex flex-col items-center justify-center px-4 py-4 rounded-xl font-medium transition-all duration-200 group overflow-hidden ${
                        isActive('/donations')
                          ? 'bg-[#9B2C2C] text-white shadow-lg shadow-red-900/30'
                          : 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-4 -mt-4"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 bg-white/10 rounded-full -ml-2 -mb-2"></div>
                      
                      <Gift className="w-6 h-6 mb-1 transition-transform duration-200 group-hover:scale-110" />
                      <span className="text-sm font-bold">Donate</span>
                    </PreloadLink>
                  </motion.div>

                  {/* Social Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PreloadLink
                      href="/social"
                      priority="medium"
                      className={`relative flex flex-col items-center justify-center px-4 py-4 rounded-xl font-medium transition-all duration-200 group overflow-hidden border-2 ${
                        isActive('/social')
                          ? 'bg-[#9B2C2C] text-white border-[#9B2C2C] shadow-lg shadow-red-900/30'
                          : 'bg-white text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50 shadow-sm hover:shadow-md'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-10 h-10 bg-red-100/50 rounded-full -mr-3 -mt-3"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 bg-red-100/50 rounded-full -ml-1 -mb-1"></div>
                      
                      <Share2 className="w-6 h-6 mb-1 transition-transform duration-200 group-hover:scale-110" />
                      <span className="text-sm font-bold">Socials</span>
                    </PreloadLink>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>


    </motion.nav>
  );
};

export default Navbar;
