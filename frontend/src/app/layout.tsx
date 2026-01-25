import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'For You Restaurant',
  description: 'Order delicious food from For You Restaurant',
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable}`}>
        <Script
          id="suppress-amplitude-warning"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress Amplitude warnings if Amplitude is loaded by browser extensions
              (function() {
                function suppressAmplitudeWarning() {
                  try {
                    if (typeof window !== 'undefined' && window.amplitude) {
                      const amplitude = window.amplitude;
                      if (amplitude.getInstance) {
                        const instance = amplitude.getInstance();
                        if (instance && instance._options) {
                          instance._options.defaultTracking = false;
                        }
                      }
                    }
                  } catch (e) {
                    // Ignore errors
                  }
                }
                suppressAmplitudeWarning();
                // Try again after a delay in case Amplitude loads later
                setTimeout(suppressAmplitudeWarning, 1000);
              })();
            `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

