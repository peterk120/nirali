export interface Dress {
  id: string;
  name: string;
  category: string;
  images: string[];
  rentalPricePerDay: number;
  depositAmount: number;
  sizes: string[];
  availableSizes: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  slug: string;
  tags: string[];
  description?: string;
  fabric?: string;
  weight?: string;
  embroidery?: string;
  colors?: string[];
  // Additional fields for boutique app
  price?: number;
  color?: string;
  size?: string;
  image?: string;
  isFavorite?: boolean;
}