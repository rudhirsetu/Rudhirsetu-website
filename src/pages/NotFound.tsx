'use client';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-lg mx-auto">
          {/* 404 Text */}
          <h1 className="text-9xl font-bold text-red-700 mb-4">404</h1>
          
          {/* Message */}
          <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-700 text-red-700 rounded-lg font-semibold hover:bg-red-700 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 