import { Dress } from '@nirali-sai/types';
import fetcher from './api';

// Real API functions for fetching dress data
async function fetchDresses(filters?: {
  category?: string;
  priceRange?: [number, number];
  sort?: 'price-low' | 'price-high' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}): Promise<Dress[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }
  
  const queryString = params.toString();
  const endpoint = `/dresses${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetcher<Dress[]>(endpoint);
  
  if (response.success && response.data) {
    return response.data;
  }
  
  throw new Error(response.error?.message || 'Failed to fetch dresses');
}

async function fetchDressById(id: string): Promise<Dress | null> {
  const response = await fetcher<Dress>(`/dresses/${id}`);
  
  if (response.success && response.data) {
    return response.data;
  }
  
  return null;
}

/**
 * Fetches a dress by its slug
 */
export async function getDressBySlug(slug: string): Promise<Dress | null> {
  try {
    // First try to fetch by ID
    const dressById = await fetchDressById(slug);
    if (dressById) {
      return dressById;
    }
    
    // If not found by ID, fetch all dresses and search by slug
    const allDresses = await fetchDresses();
    const dressBySlug = allDresses.find(dress => 
      dress.seoMeta?.title.toLowerCase().replace(/\s+/g, '-') === slug
    );
    
    return dressBySlug || null;
  } catch (error) {
    console.error('Error fetching dress by slug:', error);
    return null;
  }
}

/**
 * Fetches related dresses based on the current dress
 */
export async function getRelatedDresses(currentDressId: string, count: number): Promise<Dress[]> {
  try {
    const currentDress = await fetchDressById(currentDressId);
    
    if (!currentDress) {
      return [];
    }
    
    // Fetch dresses with similar category
    const relatedDresses = await fetchDresses({
      category: currentDress.category,
      limit: count + 5 // Fetch extra to account for filtering out current dress
    });
    
    // Filter out the current dress and limit to requested count
    return relatedDresses
      .filter(dress => dress.id !== currentDressId)
      .slice(0, count);
  } catch (error) {
    console.error('Error fetching related dresses:', error);
    return [];
  }
}

/**
 * Fetches all dress slugs for static generation
 */
export async function getAllDressSlugs(): Promise<{ slug: string }[]> {
  try {
    const dresses = await fetchDresses({ limit: 100 }); // Fetch reasonable number for static generation
    
    return dresses
      .filter(dress => dress.isActive && dress.seoMeta?.title) // Only active dresses with SEO titles
      .map(dress => ({
        slug: dress.seoMeta.title.toLowerCase().replace(/\s+/g, '-')
      }));
  } catch (error) {
    console.error('Error fetching dress slugs:', error);
    return [];
  }
}