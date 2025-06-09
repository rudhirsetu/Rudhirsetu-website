import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationItem {
  label: string;
  href: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Donations',
    href: '/donations',
    description: 'Support our blood donation and healthcare initiatives',
    priority: 'high'
  },
  {
    label: 'Our Impact',
    href: '/impact',
    description: 'See the difference we are making in communities',
    priority: 'high'
  },
  {
    label: 'Contact Us',
    href: '/contact',
    description: 'Get in touch with our team',
    priority: 'high'
  },
  {
    label: 'Gallery',
    href: '/gallery',
    description: 'View photos from our events and initiatives',
    priority: 'medium'
  },
  {
    label: 'Social Media',
    href: '/social',
    description: 'Follow us on social platforms',
    priority: 'medium'
  }
];

const SiteNavigation: React.FC = () => {
  return (
    <nav className="site-navigation" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item) => (
            <div key={item.href} className="navigation-item">
              <Link
                to={item.href}
                className={`block p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                  item.priority === 'high' ? 'border-red-200 hover:border-red-300' : 'border-gray-200'
                }`}
                aria-describedby={`desc-${item.href.replace('/', '')}`}
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.label}
                </h3>
                <p 
                  id={`desc-${item.href.replace('/', '')}`}
                  className="text-gray-600 text-sm"
                >
                  {item.description}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SiteNavigation; 