import { Metadata } from "next";
import Link from 'next/link';
import { Heart, Home, Search, Users } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org';

export const metadata: Metadata = {
  title: 'Page Not Found - 404',
  description: 'The page you are looking for could not be found. Explore our blood donation drives, healthcare camps, and community initiatives instead.',
  openGraph: {
    title: 'Page Not Found | Rudhirsetu Seva Sanstha',
    description: 'This page could not be found. Discover our life-saving blood donation and healthcare initiatives instead.',
    url: `${baseUrl}/404`,
    type: 'website',
    siteName: 'Rudhirsetu Seva Sanstha',
    locale: 'en_US',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Page Not Found')}&description=${encodeURIComponent('Discover our life-saving initiatives instead')}&route=home`,
        width: 1200,
        height: 630,
        alt: 'Rudhirsetu Seva Sanstha - Page Not Found',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rudhirsetu',
    title: 'Page Not Found | Rudhirsetu Seva Sanstha',
    description: 'This page could not be found. Discover our life-saving healthcare initiatives instead.',
    images: [`${baseUrl}/api/og?title=${encodeURIComponent('Page Not Found')}&description=${encodeURIComponent('Discover our initiatives')}&route=home`],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="relative mx-auto w-48 h-48 mb-8">
            {/* Large 404 text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl font-bold text-red-100 select-none">404</span>
            </div>
            {/* Heart icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-6 shadow-lg border-4 border-red-200">
                <Heart className="w-16 h-16 text-red-600 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            The page you&apos;re looking for seems to have moved or doesn&apos;t exist. 
            But don&apos;t worry – our mission to save lives continues! 
            Let&apos;s get you back to making a difference.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Back to Home</span>
          </Link>
          
          <Link
            href="/camp"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all duration-300 group"
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>View Camps</span>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Link
            href="/gallery"
            className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-red-500"
          >
            <div className="text-red-600 mb-3">
              <Search className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
              Photo Gallery
            </h3>
            <p className="text-gray-600 text-sm">
              See our impact through photos from camps and events
            </p>
          </Link>

          <Link
            href="/contact"
            className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-red-500"
          >
            <div className="text-red-600 mb-3">
              <Heart className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
              Get Involved
            </h3>
            <p className="text-gray-600 text-sm">
              Join our mission and help save lives in your community
            </p>
          </Link>

          <Link
            href="/donations"
            className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-red-500"
          >
            <div className="text-red-600 mb-3">
              <Users className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
              Support Us
            </h3>
            <p className="text-gray-600 text-sm">
              Your donation helps us continue our life-saving work
            </p>
          </Link>
        </div>

        {/* Encouraging Message */}
        <div className="mt-16 p-6 bg-red-50 rounded-2xl border border-red-200 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-red-600" />
            <span className="font-semibold text-red-800">Every Visit Matters</span>
          </div>
          <p className="text-red-700">
            Just like every blood donation saves lives, every visitor to our site helps spread awareness about our mission. 
            Thank you for being part of our life-saving community!
          </p>
        </div>
      </div>
    </div>
  );
} 