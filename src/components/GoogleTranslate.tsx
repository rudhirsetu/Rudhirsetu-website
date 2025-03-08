import { useEffect } from 'react';
import { Languages } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          new (config: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          }, element: string): void;
          InlineLayout: {
            HORIZONTAL: number;
            SIMPLE: number;
            VERTICAL: number;
          };
        };
      };
    };
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,mr',
          layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };
  }, []);

  return (
    <div className="fixed bottom-4 border-1 border-gray-800 rounded-lg right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
        <Languages className="w-5 h-5 text-gray-600" />
        <div id="google_translate_element" className="translate-container" />
      </div>
    </div>
  );
};

export default GoogleTranslate; 