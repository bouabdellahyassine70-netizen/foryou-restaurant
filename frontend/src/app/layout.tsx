import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress Amplitude warnings if Amplitude is loaded by browser extensions
              if (typeof window !== 'undefined' && window.amplitude) {
                try {
                  if (window.amplitude.getInstance) {
                    const instance = window.amplitude.getInstance();
                    if (instance && instance._options) {
                      instance._options.defaultTracking = false;
                    }
                  }
                } catch (e) {
                  // Ignore errors
                }
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

