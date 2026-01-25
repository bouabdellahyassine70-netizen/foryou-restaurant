// Type definitions for Amplitude (if loaded by browser extensions)
declare global {
  interface Window {
    amplitude?: {
      getInstance?: () => {
        _options?: {
          defaultTracking?: boolean;
        };
      };
      init?: (apiKey: string, options?: { defaultTracking?: boolean }) => void;
    };
  }
}

export {};
