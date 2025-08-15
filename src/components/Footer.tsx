'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContactSettings, SocialMediaSettings } from '../types/sanity';
import { settingsService } from '../services/sanity-client';
import { Mail, Phone, Heart, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

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

  // Social media icons mapping
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-6 h-6" />;
      case 'instagram':
        return <Instagram className="w-6 h-6" />;
      case 'linkedin':
        return <Linkedin className="w-6 h-6" />;
      case 'youtube':
        return <Youtube className="w-6 h-6" />;
      default:
        return null;
    }
  };

  // Quick links data
  const quickLinks = [
    { label: "Events & Camps", path: "/camp" },
    { label: "Gallery", path: "/gallery" },
    { label: "Donate Now", path: "/donations" },
    { label: "Contact Us", path: "/contact" }
  ];

  return (
    <footer className="relative">
      {/* Red Lines Section - positioned on top of footer */}
      <div className="relative bg-white">
        <div className="space-y-4">
          {/* Generate 8 horizontal lines with progressively fading opacity */}
          {Array.from({ length: 6 }, (_, index) => {
            const opacity = Math.max(0.05, (index + 1) * 0.12); // Start from 0.12 at top and get darker toward bottom
            return (
              <div
                key={index}
                className="w-full h-0.5 bg-red-600"
                style={{ opacity }}
              />
            );
          })}
        </div>
      </div>

      {/* Footer Content */}
      <div className="bg-red-700 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex flex-col items-center md:items-start">
              <img 
                alt="Rudhirsetu Logo" 
                className="h-24 w-auto pb-2 mb-4" 
                src="/images/logo-light.svg"
              />
              <nav className="flex gap-6 mt-4 md:mt-0">
                {quickLinks.map((link, index) => (
                  <Link 
                    key={index}
                    className="text-white hover:text-white/80 transition-colors font-medium" 
                    href={link.path}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social Media and Contact */}
            <div className="flex items-center gap-4 mt-6 md:mt-0">
              {/* Contact Info */}
              {contactSettings?.phone && (
                <a 
                  href={`tel:${contactSettings.phone}`} 
                  className="text-white hover:text-white/80 transition-colors"
                  title="Call us"
                >
                  <Phone className="w-6 h-6" />
                </a>
              )}
              {contactSettings?.email && (
                <a 
                  href={`mailto:${contactSettings.email}`} 
                  className="text-white hover:text-white/80 transition-colors"
                  title="Email us"
                >
                  <Mail className="w-6 h-6" />
                </a>
              )}
              
              {/* Social Media */}
              {socialLinks?.facebookUrl && (
                <a 
                  href={socialLinks.facebookUrl} 
                  className="text-white hover:text-white/80 transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Follow us on Facebook"
                >
                  {getSocialIcon('facebook')}
                </a>
              )}
              {socialLinks?.instagramUrl && (
                <a 
                  href={socialLinks.instagramUrl} 
                  className="text-white hover:text-white/80 transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Follow us on Instagram"
                >
                  {getSocialIcon('instagram')}
                </a>
              )}
              {socialLinks?.linkedinUrl && (
                <a 
                  href={socialLinks.linkedinUrl} 
                  className="text-white hover:text-white/80 transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Connect on LinkedIn"
                >
                  {getSocialIcon('linkedin')}
                </a>
              )}
              {socialLinks?.youtubeUrl && (
                <a 
                  href={socialLinks.youtubeUrl} 
                  className="text-white hover:text-white/80 transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Subscribe to our YouTube"
                >
                  {getSocialIcon('youtube')}
                </a>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-8 border-t border-white/10">
            {/* Copyright Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-base">
              <p className="text-white font-medium">
                &copy; {new Date().getFullYear()} Rudhirsetu Seva Sanstha. All rights reserved.
              </p>
              <a
                href="https://www.linkedin.com/in/deeptanshu-l-6868a4187/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 flex items-center gap-1 font-medium"
              >
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400" />
                <span>by Deeptanshu</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;