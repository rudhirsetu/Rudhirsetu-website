import { useState, useEffect } from 'react';
import { QrCode, CreditCard, Heart, ArrowRight, Gift, Users } from 'lucide-react';
import { DonationSettings } from '../types/sanity';
import { settingsService } from '../services/sanity-client';
import { urlFor } from '../lib/sanity';

const Donations = () => {
  const [settings, setSettings] = useState<DonationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.fetchDonation();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        setError('Failed to load donation settings');
        console.error('Error loading donation settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const donationImpact = [
    {
      amount: "₹500",
      impact: "Provides essential medical supplies for one blood donation camp",
      icon: Heart
    },
    {
      amount: "₹1,000",
      impact: "Supports one thalassemia patient's monthly treatment",
      icon: Gift
    },
    {
      amount: "₹2,500",
      impact: "Enables free eye check-ups for 25 underprivileged individuals",
      icon: Users
    }
  ];

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
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
          <h1 className="text-4xl font-bold mb-4">Support Our Cause</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Your contribution helps us continue our mission of providing healthcare support and community services to those in need.
          </p>
        </div>

        {/* Impact Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationImpact.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.amount} className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-red-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.amount}</h3>
                  <p className="text-gray-600">{item.impact}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Donation Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* UPI Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <QrCode className="w-10 h-10 text-red-700" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">UPI Payment</h3>
            {settings?.isUpiEnabled ? (
              <>
                {settings.qrCodeImage && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <img
                      src={urlFor(settings.qrCodeImage).width(400).height(400).url()}
                      alt={settings.qrCodeImage.alt || "UPI QR Code"}
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                )}
                <p className="text-center text-gray-600 text-sm mb-4">
                  Scan to donate via any UPI app
                </p>
                <p className="text-center text-gray-800 font-medium">
                  UPI ID: {settings.upiId}
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">UPI payments are temporarily unavailable.</p>
                <p className="text-sm text-gray-500 mt-2">Please use bank transfer instead.</p>
              </div>
            )}
          </div>

          {/* Bank Transfer Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <CreditCard className="w-10 h-10 text-red-700" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">Bank Transfer</h3>
            {settings?.isBankEnabled ? (
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Account Name</p>
                  <p className="font-medium">{settings.accountName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Account Number</p>
                  <p className="font-medium">{settings.accountNumber}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">IFSC Code</p>
                  <p className="font-medium">{settings.ifscCode}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Bank & Branch</p>
                  <p className="font-medium">{settings.bankAndBranch}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Bank transfer is temporarily unavailable.</p>
                <p className="text-sm text-gray-500 mt-2">Please check back later or contact us for assistance.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tax Benefits Section */}
        <section className="bg-red-50 p-8 rounded-xl mb-16">
          <h2 className="text-2xl font-bold mb-4">Tax Benefits</h2>
          {settings?.isSection80GEnabled ? (
            <>
              <p className="text-gray-700 mb-4">
                All donations to Rudhirsetu Seva Sanstha are eligible for tax deduction under Section 80G of the Income Tax Act.
                You will receive a donation receipt that can be used for tax purposes.
              </p>
              <div className="bg-white p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Section 80G Number</p>
                    <p className="font-medium text-gray-900">{settings.section80GNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tax Deduction</p>
                    <p className="font-medium text-gray-900">{settings.taxDeductionPercentage}% of donation amount</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-red-700 font-medium">
                <span>Learn more about tax benefits</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">Tax benefit information is currently being updated.</p>
              <p className="text-sm text-gray-500 mt-2">Please contact us for the latest information about tax deductions.</p>
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-8">
            For any queries regarding donations or to discuss other ways to support us, please feel free to contact us.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
          >
            Contact Us
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </section>
      </div>
    </div>
  );
};

export default Donations; 