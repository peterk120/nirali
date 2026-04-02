import type { Metadata } from 'next';
import { cormorantGaramond, dmSans } from '@/lib/fonts';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import AnnouncementBar from '../components/AnnouncementBar';
import BackToTop from '../components/BackToTop';
import Providers from '../components/Providers';

export const metadata: Metadata = {
  title: {
    default: 'Sashti Sparkle | Premium Imitation Jewellery',
    template: '%s | Sashti Sparkle'
  },
  description: 'Look Royal. Pay Less. Premium imitation & costume jewellery for every occasion. Tarnish-resistant, nickel-free, and skin-friendly.',
  keywords: ['imitation jewellery', 'costume jewellery', 'fashion jewellery', 'bridal jewellery', 'kundan', 'oxidised', 'temple jewellery', 'sashti sparkle'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${dmSans.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-body bg-white text-brand-dark min-h-screen flex flex-col">
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}