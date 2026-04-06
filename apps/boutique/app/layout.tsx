import './globals.css';
import type { Metadata, Viewport } from 'next';
import { playfairDisplay, dmSans } from '@/lib/fonts';
import Providers from '../components/Providers';
import React from 'react';

export const viewport: Viewport = {
  themeColor: '#C0436A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Nirali Sai Boutique',
    default: 'Nirali Sai Boutique',
  },
  description: 'Discover exquisite bridal wear and traditional outfits at Nirali Sai Boutique. Premium quality and elegant designs for your special occasions.',
  keywords: ['bridal wear', 'traditional outfits', 'Indian fashion', 'wedding dresses', 'ethnic wear'],
  openGraph: {
    title: 'Nirali Sai Boutique',
    description: 'Discover exquisite bridal wear and traditional outfits at Nirali Sai Boutique. Premium quality and elegant designs for your special occasions.',
    images: ['/og-image.jpg'], // Placeholder for brand image
    type: 'website',
    url: 'https://www.niralisaiboutique.com',
  },
  // manifest: '/manifest.json', // Disabled PWA manifest to avoid 404 errors
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} theme-light`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-body antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}