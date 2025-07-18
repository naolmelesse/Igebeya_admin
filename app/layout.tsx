import type { Metadata, Viewport } from 'next';
import './globals.css';
import TelegramScript from '@/components/TelegramScript';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'I-Gebeya Admin',
  description: 'I-Gebeya Admin Panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <TelegramScript />
        {children}
      </body>
    </html>
  );
}