import { useState, useEffect } from 'react';
import { ContactSettings } from '../types/sanity';
import { settingsService } from '../services/sanity-client';

const Footer = () => {
  const [settings, setSettings] = useState<ContactSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.fetchContact();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Error loading contact settings:', err);
      }
    };

    loadSettings();
  }, []);

  const formatAddress = (address: string) => {
    return address.split(',').map(line => line.trim());
  };

  return (
    <footer className="bg-black/90 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-400">
              Phone: <a href={`tel:${settings?.phone}`} className="hover:text-white transition-colors">
                {settings?.phone}
              </a>
            </p>
            <p className="text-gray-400">
              Email: <a href={`mailto:${settings?.email}`} className="hover:text-white transition-colors">
                {settings?.email}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Address</h3>
            {settings?.address ? (
              formatAddress(settings.address).map((line, index) => (
                <p key={index} className="text-gray-400">{line}</p>
              ))
            ) : (
              <p className="text-gray-400">Loading address...</p>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="/impact" className="text-gray-400 hover:text-white transition-colors">Our Impact</a></li>
              <li><a href="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Rudhirsetu Seva Sanstha. All rights reserved.</p>
          Made with ❤️ by <a href="https://www.linkedin.com/in/deeptanshu-l-6868a4187/" target="_blank" className="text-gray-400 hover:text-white transition-colors"><b>Deeptanshu</b></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 