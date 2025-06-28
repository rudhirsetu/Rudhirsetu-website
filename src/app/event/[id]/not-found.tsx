'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';

export default function EventNotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-16 bg-gradient-to-b from-red-50 to-white flex items-center justify-center"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="bg-white p-8 rounded-2xl shadow-xl inline-block max-w-md mx-auto border border-red-100"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <X className="w-12 h-12 text-red-500" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Event Not Found</h1>
          <p className="text-red-700 text-lg mb-8">
            We couldn&apos;t find the event you&apos;re looking for. It may have been removed or is temporarily unavailable.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/impact"
              className="inline-flex items-center px-6 py-3 bg-red-900 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
} 