import { Metadata } from 'next';
import ContinuousHero from '../../components/ContinuousHero';
import NewArrivalsGrid from '../../components/catalog/NewArrivalsGrid';

export const metadata: Metadata = {
  title: 'Home - Nirali Sai Boutique',
  description: 'Luxury Indian bridal boutique experience',
};

export default function HomePage() {
  return (
    <>
      <ContinuousHero
        images={[
          '/images/dress/blue dress-1.jpg',
          '/images/dress/saree-1.jpg',
          '/images/dress/violet dress-1.jpg',
        ]}
      />
      <NewArrivalsGrid />
    </>
  );
}