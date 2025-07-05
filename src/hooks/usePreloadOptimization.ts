import { useEffect, useCallback } from 'react';

interface PreloadMetrics {
  preloadAttempts: number;
  successfulPreloads: number;
  failedPreloads: number;
  averagePreloadTime: number;
}

interface NetworkConnection {
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
}

interface ExtendedNavigator extends Navigator {
  connection?: NetworkConnection;
}

interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Global metrics tracking
const globalMetrics: PreloadMetrics = {
  preloadAttempts: 0,
  successfulPreloads: 0,
  failedPreloads: 0,
  averagePreloadTime: 0,
};

const preloadTimes: number[] = [];

export const usePreloadOptimization = () => {
  // Track performance and provide feedback
  const trackPreloadPerformance = useCallback((href: string, startTime: number, success: boolean) => {
    const endTime = performance.now();
    const preloadTime = endTime - startTime;
    
    globalMetrics.preloadAttempts++;
    
    if (success) {
      globalMetrics.successfulPreloads++;
      preloadTimes.push(preloadTime);
      
      // Keep only last 50 measurements for rolling average
      if (preloadTimes.length > 50) {
        preloadTimes.shift();
      }
      
      globalMetrics.averagePreloadTime = preloadTimes.reduce((a, b) => a + b, 0) / preloadTimes.length;
    } else {
      globalMetrics.failedPreloads++;
    }

    // Log performance data in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Preload] ${href}: ${success ? 'Success' : 'Failed'} (${preloadTime.toFixed(2)}ms)`);
    }
  }, []);

  // Enhanced preload function with metrics
  const preloadWithMetrics = useCallback(async (href: string) => {
    const startTime = performance.now();
    
    try {
      // Create link element for preloading
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      
      // Track when resource loads
      const loadPromise = new Promise<void>((resolve, reject) => {
        link.onload = () => resolve();
        link.onerror = () => reject(new Error('Failed to preload'));
        setTimeout(() => reject(new Error('Preload timeout')), 5000);
      });
      
      document.head.appendChild(link);
      await loadPromise;
      
      trackPreloadPerformance(href, startTime, true);
    } catch (error) {
      trackPreloadPerformance(href, startTime, false);
      throw error;
    }
  }, [trackPreloadPerformance]);

  // Intelligent connection-based preloading
  const getOptimalPreloadDelay = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as ExtendedNavigator).connection;
      
      if (connection) {
        // Adjust delay based on connection type
        switch (connection.effectiveType) {
          case 'slow-2g':
            return 500; // Longer delay for slow connections
          case '2g':
            return 300;
          case '3g':
            return 150;
          case '4g':
          default:
            return 100; // Faster for good connections
        }
      }
    }
    
    return 150; // Default delay
  }, []);

  // Memory usage optimization
  const shouldPreload = useCallback((priority: 'high' | 'medium' | 'low') => {
    if (typeof window === 'undefined') return false;
    
    // Check memory constraints (if available)
    if ('memory' in performance) {
      const memInfo = (performance as ExtendedPerformance).memory;
      if (memInfo) {
        const memoryUsage = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
        
        // Reduce preloading if memory usage is high
        if (memoryUsage > 0.9) return false;
        if (memoryUsage > 0.7 && priority === 'low') return false;
        if (memoryUsage > 0.8 && priority === 'medium') return false;
      }
    }
    
    // Check if user prefers reduced data usage
    if ('connection' in navigator) {
      const connection = (navigator as ExtendedNavigator).connection;
      if (connection?.saveData) {
        return priority === 'high'; // Only preload high priority on save data
      }
    }
    
    return true;
  }, []);

  // Connection monitoring
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as ExtendedNavigator).connection;
      
      if (connection) {
        const handleConnectionChange = () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Preload] Connection changed:', {
              effectiveType: connection.effectiveType,
              downlink: connection.downlink,
              saveData: connection.saveData,
            });
          }
        };
        
        connection.addEventListener?.('change', handleConnectionChange);
        
        return () => {
          connection.removeEventListener?.('change', handleConnectionChange);
        };
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any pending preload operations
      if (typeof document !== 'undefined') {
        const preloadLinks = document.querySelectorAll('link[rel="prefetch"]');
        preloadLinks.forEach(link => {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
        });
      }
    };
  }, []);

  return {
    preloadWithMetrics,
    getOptimalPreloadDelay,
    shouldPreload,
    metrics: globalMetrics,
  };
};

export default usePreloadOptimization; 