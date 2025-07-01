'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ContactSettings, SocialMediaSettings } from '../types/sanity';
import { settingsService } from '../services/sanity-client';
import { Mail, Phone, MapPin, Heart, ArrowRight, ExternalLink } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const Footer = () => {
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialMediaSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [contactData, socialData] = await Promise.all([
          settingsService.fetchContact(),
          settingsService.fetchSocialMedia()
        ]);
        
        setContactSettings(contactData);
        setSocialLinks(socialData);
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    };

    loadSettings();
  }, []);

  const formatAddress = (address: string) => {
    return address.split(',').map(line => line.trim());
  };

  // Social media icons mapping
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
          </svg>
        );
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  // Quick links data
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Events & Camps", path: "/camp" },
    { label: "Gallery", path: "/gallery" },
    { label: "Donate Now", path: "/donations" },
    { label: "Contact Us", path: "/contact" },
    { label: "Social Media", path: "/social" }
  ];

  // SEO-focused links for search engine discovery
  const seoLinks = [
    { label: "Sitemap", path: "/sitemap.xml", external: true },
    // { label: "Privacy Policy", path: "/privacy-policy" },
    // { label: "Terms of Service", path: "/terms" }
  ];

  return (
    <motion.footer 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="text-white py-8 md:py-16 relative overflow-hidden rounded-t-4xl mx-0 md:mx-20"
    >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(/rudhirsetu-bg.webp)',
                transform: 'rotate(180deg)'
              }}
            >
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/40" />
            </div>


            
            {/* Content with relative positioning to appear above background */}
            <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-between">
              {/* Main Footer Sections */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12"
              >
                {/* About & Logo Section */}
                <motion.div variants={itemVariants} className="md:col-span-3 space-y-5">
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex items-center space-x-3"
                  >
                    <img 
                      src="/images/logo-light.svg" 
                      alt="Rudhirsetu Logo" 
                      className="h-50 w-auto"
                    />
                  </motion.div>
                  
                  {/* Social Media Links */}
                  <motion.div 
                    variants={containerVariants}
                    className="flex space-x-4"
                  >
                    {socialLinks?.facebookUrl && (
                      <a 
                        href={socialLinks.facebookUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Follow us on Facebook"
                        className="text-white/80 hover:text-white transition-colors h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                      >
                        {getSocialIcon('facebook')}
                      </a>
                    )}
                    {socialLinks?.instagramUrl && (
                      <a 
                        href={socialLinks.instagramUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Follow us on Instagram"
                        className="text-white/80 hover:text-white transition-colors h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                      >
                        {getSocialIcon('instagram')}
                      </a>
                    )}
                    {socialLinks?.linkedinUrl && (
                      <a 
                        href={socialLinks.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Connect with us on LinkedIn"
                        className="text-white/80 hover:text-white transition-colors h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                      >
                        {getSocialIcon('linkedin')}
                      </a>
                    )}
                    {socialLinks?.youtubeUrl && (
                      <a 
                        href={socialLinks.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Subscribe to our YouTube channel"
                        className="text-white/80 hover:text-white transition-colors h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                      >
                        {getSocialIcon('youtube')}
                      </a>
                    )}
                  </motion.div>
                </motion.div>
                
                {/* Quick Links Section */}
                <motion.div variants={itemVariants} className="md:col-span-3 space-y-4">
                  <motion.h3 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg font-bold border-b border-white/20 pb-2 mb-4"
                  >
                    Quick Links
                  </motion.h3>
                  <ul className="space-y-2.5">
                    {quickLinks.map((link, index) => (
                      <motion.li 
                        key={index}
                        variants={linkVariants}
                        custom={index}
                      >
                        <Link 
                          href={link.path} 
                          className="text-white/80 hover:text-white transition-colors inline-flex items-center group"
                        >
                          <motion.span 
                            className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ x: 3 }}
                          >
                            <ArrowRight className="w-3 h-3" />
                          </motion.span>
                          <span className="relative">
                            {link.label}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* SEO & Legal Links Section */}
                <motion.div variants={itemVariants} className="md:col-span-2 space-y-4">
                  <motion.h3 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-lg font-bold border-b border-white/20 pb-2 mb-4"
                  >
                    Site Info
                  </motion.h3>
                  <ul className="space-y-2.5">
                    {seoLinks.map((link, index) => (
                      <motion.li 
                        key={index}
                        variants={linkVariants}
                        custom={index}
                      >
                        {link.external ? (
                          <a 
                            href={link.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 hover:text-white transition-colors inline-flex items-center group"
                          >
                            <motion.span 
                              className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ x: 3 }}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </motion.span>
                            <span className="relative">
                              {link.label}
                            </span>
                          </a>
                        ) : (
                          <Link 
                            href={link.path} 
                            className="text-white/80 hover:text-white transition-colors inline-flex items-center group"
                          >
                            <motion.span 
                              className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ x: 3 }}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </motion.span>
                            <span className="relative">
                              {link.label}
                            </span>
                          </Link>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                
                {/* Contact Section */}
                <motion.div variants={itemVariants} className="md:col-span-4 space-y-4">
                  <motion.h3 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-lg font-bold border-b border-white/20 pb-2 mb-4"
                  >
                    Contact Us
                  </motion.h3>
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-3">
                      {contactSettings?.phone && (
                        <motion.a 
                          whileHover={{ x: 5 }}
                          href={`tel:${contactSettings.phone}`} 
                          className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors"
                        >
                          <div className="p-2 bg-white/10 rounded-full">
                            <Phone className="w-4 h-4" />
                          </div>
                          <span>{contactSettings.phone}</span>
                        </motion.a>
                      )}
                      {contactSettings?.email && (
                        <motion.a 
                          whileHover={{ x: 5 }}
                          href={`mailto:${contactSettings.email}`} 
                          className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors"
                        >
                          <div className="p-2 bg-white/10 rounded-full">
                            <Mail className="w-4 h-4" />
                          </div>
                          <span>{contactSettings.email}</span>
                        </motion.a>
                      )}
                      {contactSettings?.address && (
                        <motion.div 
                          variants={linkVariants}
                          className="flex items-start space-x-3 text-white/80"
                        >
                          <div className="p-2 bg-white/10 rounded-full flex-shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            {formatAddress(contactSettings.address).map((line, index) => (
                              <p key={index} className="leading-snug">{line}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Divider */}
              <div className="h-px bg-white/20 my-8" />
              
              {/* Bottom Footer */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                className="flex flex-col md:flex-row justify-between items-center text-white text-lg"
              >
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="mb-4 md:mb-0 text-center text-md"
                >
                  <p>&copy; {new Date().getFullYear()} Rudhirsetu Seva Sanstha. All rights reserved.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="flex items-center justify-center"
                >
                  <a
                    href="https://www.linkedin.com/in/deeptanshu-l-6868a4187/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white flex items-center gap-1.5 font-medium hover:underline transition-colors duration-300 group"
                  >
                    <span>Made with</span>
                    <Heart className="w-4 h-4 text-white transition-colors duration-300" />
                    <span>by Deeptanshu</span>
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </motion.footer>
  );
};

export default Footer;