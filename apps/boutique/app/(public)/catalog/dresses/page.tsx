import { Metadata } from 'next';
import { Suspense } from 'react';
import DressCatalogClient from './DressCatalogClient';
import { Dress } from '@nirali-sai/types';

interface DressCatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
  const resolvedParams = await searchParams;
  
  // Construct internal API URL for server-to-server fetch
  // In Next.js App Router, we can also call the logic directly, but fetching via internal URL is common for proxy/layer isolation
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  
  const params = new URLSearchParams();
  Object.entries(resolvedParams).forEach(([k, v]) => {
    if (v) params.set(k, Array.isArray(v) ? v[0] : v);
  });
  if (!params.has('limit')) params.set('limit', '12');

  let initialData = null;
  try {
    // Note: On Vercel, this might need the full domain. For local, localhost:3001 works.
    // However, since this is a Next.js API route IN THE SAME APP, we should ideally use the internal URL or a direct function call.
    // For now, we'll try fetching from the internal products API
    const response = await fetch(`${baseUrl}/products?${params.toString()}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const result = await response.json();
    
    if (result.success) {
      const fetchedDresses: Dress[] = result.data.map((product: any) => ({
        id: product._id || product.id,
        name: product.name,
        category: product.category,
        images: [{ url: product.image }],
        colors: product.color ? [{ name: product.color }] : [],
        sizes: product.size ? [{ size: product.size }] : [],
        rentalPricePerDay: product.price,
        depositAmount: product.price * 0.2,
        isAvailable: product.stock > 0,
        rating: 4.5,
        reviewCount: 5,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tags: [product.category],
        price: product.price,
        color: product.color || '',
        size: product.size || '',
        image: product.image,
        description: product.description,
        isFavorite: false,
      }));
      
      initialData = {
        dresses: fetchedDresses,
        pagination: result.pagination
      };
    }
  } catch (error) {
    console.error('Error in SSR fetch:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading dresses...</div>}>
        <DressCatalogClient searchParams={resolvedParams as any} initialData={initialData} />
      </Suspense>
    </div>
  );
}