import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { ContactSettings } from '../types/sanity';
import { settingsService } from '../services/sanity-client';
import { StructuredData } from '../components/StructuredData';
import { ContactPageData } from '../lib/structured-data';

const Contact = () => {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.fetchContact();
        setSettings(data);
      } catch (err) {
        setError('Failed to load contact settings');
        console.error('Error loading contact settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-[400px] bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
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
    <>
      <StructuredData data={ContactPageData} id="contact-page-structured-data" />
      <div className="py-12 pt-[100px]">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
          <span className="px-4 py-1.5 bg-red-50 text-[#9B2C2C] text-sm font-medium rounded-full mb-4 inline-flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact
            </span>
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
              Get in touch with us to learn more about our services, volunteer opportunities, or how you can support our cause.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Map Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Find Us</h2>
              <div className="aspect-[4/3] w-full mb-6">
                {settings?.googleMapsUrl ? (
                  <div className="relative w-full h-full">
                    <iframe
                      src={settings.googleMapsUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map not available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-red-700 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {settings?.address || 'Address not available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-red-700 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a 
                        href={`tel:${settings?.phone}`}
                        className="text-gray-600 hover:text-red-700"
                      >
                        {settings?.phone || 'Phone not available'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-red-700 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a 
                        href={`mailto:${settings?.email}`}
                        className="text-gray-600 hover:text-red-700"
                      >
                        {settings?.email || 'Email not available'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Emergency Contact</h2>
                <p className="text-gray-600 mb-4">
                  For emergency blood requirements or immediate assistance, please contact our 24/7 helpline.
                </p>
                <div className="flex items-center justify-center bg-red-50 p-4 rounded-lg">
                  <Phone className="w-6 h-6 text-red-700 mr-2" />
                  <a 
                    href={`tel:${settings?.phone}`}
                    className="text-xl font-bold text-red-700 hover:text-red-800"
                  >
                    {settings?.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact; 