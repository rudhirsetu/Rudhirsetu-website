'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 1800; // 2 seconds
    const startTime = Date.now();

    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Easing function for smooth, natural progress
      // Using ease-out quad for faster start, slower end
      const easedProgress = rawProgress < 100 
        ? 100 - Math.pow(100 - rawProgress, 0.8) 
        : 100;
      
      setProgress(Math.floor(easedProgress));

      if (rawProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Wait a moment at 100% before starting the split animation
        setTimeout(() => {
          setIsComplete(true);
          // Wait for split animation to complete before calling onComplete
          setTimeout(onComplete, 1000);
        }, 100);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[9999] flex flex-col">
        {/* Top Section */}
        <motion.div
          className="relative flex-1 bg-white flex flex-col items-center justify-end pb-8"
          initial={{ y: 0 }}
          animate={isComplete ? { y: '-100%' } : { y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center">
            <Image
              src="/images/logo-dark.svg"
              alt="Rudhirsetu Logo"
              width={160}
              height={160}
              priority
              className="w-32 h-32 md:w-40 md:h-40"
            />
          </div>
          
          {/* Top half of progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-red-600"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="relative flex-1 bg-white flex flex-col items-center justify-start pt-8"
          initial={{ y: 0 }}
          animate={isComplete ? { y: '100%' } : { y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Bottom half of progress bar */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-red-600"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
          
          <div className="flex flex-col items-center">
            <motion.div
              className="text-5xl md:text-6xl font-bold text-gray-800 tabular-nums"
              key={progress}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
            >
              {progress}%
            </motion.div>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Loading...
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoadingScreen;

