import { notFound } from 'next/navigation';
import { DressDetailClient } from './DressDetailClient';

interface DressDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function DressDetailPage({ params, searchParams }: DressDetailPageProps) {
  const { id } = params;

  // Validate the ID format
  if (!id || typeof id !== 'string') {
    notFound();
  }

  try {
    // Fetch the dress from the API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products/${id}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      notFound();
    }

    const product = result.data;

    return <DressDetailClient product={product} searchParams={searchParams} />;
  } catch (error) {
    console.error('Error fetching dress:', error);
    notFound();
  }
}