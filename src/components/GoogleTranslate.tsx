import { useEffect } from 'react';

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

  return <div id="google_translate_element" className="translate-container" />;
};

export default GoogleTranslate; 