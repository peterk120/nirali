'use client';

import ContinuousHero from '../../../components/ContinuousHero';

export default function HeroDemoPage() {
  return (
    <div className="min-h-screen">
      <ContinuousHero 
        images={['/images/dress/blue dress-1.jpg', '/images/dress/saree-1.jpg', '/images/dress/violet dress-1.jpg']}
        heading="ELEGANT COLLECTION"
        subtitle="Discover our curated bridal and ethnic wear"
        ctaLabel="VIEW CATALOG"
        ctaHref="/catalog"
        duration={30}
      />
    </div>
  );
}