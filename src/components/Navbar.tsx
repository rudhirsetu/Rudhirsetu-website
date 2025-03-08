import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Phone, Menu, X, Home, Share2, Image, Gift, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import { settingsService } from '../services/sanity-client';
import type { SocialMediaSettings } from '../types/sanity';
import GoogleTranslate from './GoogleTranslate';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialMediaSettings | null>(null);
  const location = useLocation();

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
    <div className="flex items-center space-x-3">
      {socialLinks?.linkedinUrl && (
        <a
          href={socialLinks.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#0077b5] transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-10 h-10 md:w-6 md:h-6" />
        </a>
      )}
      {socialLinks?.facebookUrl && (
        <a
          href={socialLinks.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#1877f2] transition-colors"
          aria-label="Facebook"
        >
          <Facebook className="w-10 h-10 md:w-6 md:h-6" />
        </a>
      )}
      {socialLinks?.instagramUrl && (
        <a
          href={socialLinks.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#e4405f] transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="w-10 h-10 md:w-6 md:h-6" />
        </a>
      )}
      {socialLinks?.youtubeUrl && (
        <a
          href={socialLinks.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#ff0000] transition-colors"
          aria-label="YouTube"
        >
          <Youtube className="w-10 h-10 md:w-6 md:h-6" />
        </a>
      )}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-[50] bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img
                className="h-14 w-auto"
                src="/images/logo.webp"
                alt="Rudhirsetu Logo"
              />
              <div className="flex flex-col">
                <span className="md:text-2xl text-xl font-bold tracking-tight text-[#9B2C2C]">
                  Rudhirsetu
                </span>
                <span className="md:text-xs text-xs text-gray-600">
                  Seva Sanstha
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'bg-[#9B2C2C] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-4">
              <GoogleTranslate />
              <SocialLinks />
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Google Translate */}
            <div>
              <GoogleTranslate />
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
              aria-label="Menu"
            >
              {!isOpen ? (
                <Menu className="w-6 h-6" />
              ) : (
                <X className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-md font-medium ${
                    isActive(item.path)
                      ? 'bg-[#9B2C2C] text-white border-2 border-[#9B2C2C]'
                      : 'text-gray-700 border-1 border-black/60 '
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {/* Social Links in Mobile Menu */}
            <div className="border-t border-gray-900 mt-5"></div>
            <div className="px-4 py-3 flex flex-col">
              <span className="text-md text-gray-800 mb-2">Follow us on:</span>
              <div className="flex items-center space-x-3">
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 