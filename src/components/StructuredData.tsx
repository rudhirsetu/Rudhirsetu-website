import { useEffect } from 'react';

interface StructuredDataProps {
  data: object;
  id?: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data, id }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id || `structured-data-${Date.now()}`;
    script.textContent = JSON.stringify(data);
    
    // Remove existing script with same ID if it exists
    if (id) {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptElement = document.getElementById(script.id);
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [data, id]);

  return null;
};


 