'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // Suppress Amplitude warnings from browser extensions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Wait for Amplitude to be loaded (if loaded by extension)
    const suppressAmplitudeWarning = () => {
      try {
        // Check if Amplitude is available (from extension or script)
        if ((window as any).amplitude) {
          const amplitude = (window as any).amplitude;
          
          // If getInstance exists, configure it
          if (amplitude.getInstance) {
            const instance = amplitude.getInstance();
            if (instance && instance._options) {
              instance._options.defaultTracking = false;
            }
          }
          
          // If init exists, configure defaultTracking
          if (amplitude.init) {
            // Override init to set defaultTracking
            const originalInit = amplitude.init;
            amplitude.init = function(apiKey: string, options?: any) {
              return originalInit.call(this, apiKey, {
                ...options,
                defaultTracking: options?.defaultTracking ?? false,
              });
            };
          }
        }
      } catch (e) {
        // Silently ignore errors
      }
    };

    // Try immediately
    suppressAmplitudeWarning();

    // Try after a short delay (in case Amplitude loads later)
    const timeout = setTimeout(suppressAmplitudeWarning, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

