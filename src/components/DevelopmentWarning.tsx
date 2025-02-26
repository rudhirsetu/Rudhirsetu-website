import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

const DevelopmentWarning = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 shadow-md" style={{ zIndex: 9999 }}>
      <div className="container mx-auto px-4">
        <div className="py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-12 text-yellow-950" />
            <p className="text-m font-medium text-yellow-950">
              Development Version: Data shown is for testing purposes only. THIS IS NOT THE OFFICIAL WEBSITE.
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-950 hover:text-yellow-900 focus:outline-none"
            aria-label="Close warning"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentWarning; 