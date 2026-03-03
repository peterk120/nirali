import { Metadata } from 'next';
import { Suspense } from 'react';
import DressCatalogClient from './DressCatalogClient';

interface DressCatalogPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ searchParams }: DressCatalogPageProps): Promise<Metadata> {
  const title = "Bridal Dress Rental — Nirali Sai Boutique";
  const description = "Browse our exquisite collection of bridal dresses for rent. Find the perfect traditional and contemporary bridal wear for your special occasion.";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: '/images/hero-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Nirali Sai Boutique Bridal Dresses Collection',
        },
      ],
    },
  };
}

export default async function DressCatalogPage({ searchParams }: DressCatalogPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading dresses...</div>}>
        <DressCatalogClient searchParams={searchParams} />
      </Suspense>
    </div>
  );
}