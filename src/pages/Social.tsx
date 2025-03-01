import { useState, useEffect } from 'react';
import { Linkedin, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { SocialMediaSettings } from '../types/sanity';
import { settingsService } from '../services/sanity-client';

const SocialMedia = () => {
  const [settings, setSettings] = useState<SocialMediaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.fetchSocialMedia();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        setError('Failed to load social media settings');
        console.error('Error loading social media settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: settings?.linkedinUrl,
      color: 'bg-[#0077B5]',
      hoverColor: 'hover:bg-[#006399]',
      description: 'Connect with us on LinkedIn for professional updates and networking.'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: settings?.facebookUrl,
      color: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#1666D9]',
      description: 'Follow us on Facebook for event updates and community stories.'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: settings?.instagramUrl,
      color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]',
      hoverColor: 'hover:opacity-90',
      description: 'Join our Instagram community for visual stories and daily inspiration.'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: settings?.youtubeUrl,
      color: 'bg-[#FF0000]',
      hoverColor: 'hover:bg-[#E60000]',
      description: 'Subscribe to our YouTube channel for event recordings and impact stories.'
    }
  ];

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 p-4 rounded-lg inline-block">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Connect With Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            {settings?.description || 'Follow us on social media to stay updated with our latest events, initiatives, and community stories.'}
          </p>
        </div>

        {/* Social Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {socialLinks.map((platform) => (
            platform.url && (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${platform.color} text-white`}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <platform.icon className="w-8 h-8" />
                    <ExternalLink className="w-5 h-5 opacity-75 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{platform.name}</h2>
                  <p className="text-white/90">{platform.description}</p>
                </div>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${platform.hoverColor}`}></div>
              </a>
            )
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow us on social media to stay connected and be part of our journey in making a difference.
          </p>
          <a
            href="/contact"
            className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
          >
            Get Involved
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia; 