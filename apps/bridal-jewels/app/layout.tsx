import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nirali Sai Bridal Jewels | Luxury Indian Bridal Jewellery Rental',
  description: 'Premium 22K gold, diamond & Kundan bridal jewellery sets for rent. 100% original, fully insured delivery.',
  keywords: 'bridal jewellery, indian wedding jewellery, kundan jewellery, gold jewellery rental, bridal sets',
  themeColor: '#4a1e04',
  openGraph: {
    title: 'Nirali Sai Bridal Jewels',
    description: 'Premium 22K gold, diamond & Kundan bridal jewellery sets for rent.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — curated trio used across all pages */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/globals.css" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
