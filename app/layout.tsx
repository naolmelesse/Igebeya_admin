import type { Metadata, Viewport } from 'next';
import { Merriweather } from 'next/font/google';
import './globals.css';
import TelegramScript from '@/components/TelegramScript';
import DevConfig from '@/components/DefConfig';

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// Separate viewport export (NEW in Next.js 14+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// Metadata export (without viewport)
export const metadata: Metadata = {
  title: 'I-Gebeya Admin',
  description: 'I-Gebeya Admin Panel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={merriweather.className}>
        <TelegramScript />
        {/* Add top padding in development mode for the dev banner */}
        <div className={isDevelopment ? 'pt-8' : ''}>
          {children}
        </div>
        <DevConfig isDevelopment={isDevelopment} />
      </body>
    </html>
  );
}
