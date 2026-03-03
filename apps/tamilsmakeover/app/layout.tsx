import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import Providers from '../components/Providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import React from 'react';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Tamilsmakeover',
    default: 'Tamilsmakeover',
  },
  description: 'Professional makeup and beauty services at Tamilsmakeover. Expert artists for your special occasions.',
  keywords: ['beauty services', 'makeup artists', 'bridal makeup', 'party makeup', 'professional artists'],
  openGraph: {
    title: 'Tamilsmakeover',
    description: 'Professional makeup and beauty services at Tamilsmakeover. Expert artists for your special occasions.',
    images: ['/og-image.jpg'], // Placeholder for brand image
    type: 'website',
    url: 'https://www.tamilsmakeover.com',
  },
  themeColor: '#6B2D8B', // brand-plum
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  manifest: '/manifest.json', // Placeholder for PWA manifest
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
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}