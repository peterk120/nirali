'use client';

import HeroHorizontal from '../../../components/HeroHorizontal';

export default function HeroTestPage() {
  // Using placeholder images for better demonstration
  const testImages = [
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1544003484-3cd181d17917?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1920&h=1080&fit=crop'
  ];

  return (
    <div className="min-h-screen">
      <HeroHorizontal 
        images={testImages}
        heading="ETERNAL ELEGANCE"
        subtitle="where sophistication meets contemporary design"
        ctaLabel="DISCOVER MORE"
        ctaHref="#"
        duration={30}
      />
    </div>
  );
}