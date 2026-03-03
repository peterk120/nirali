import { create } from 'zustand';

interface Dress {
  id: string;
  name: string;
  category: string;
  images: string[];
  rentalPricePerDay: number;
  depositAmount: number;
  sizes: string[];
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
}

interface CompareStore {
  items: Dress[];
  addToCompare: (dress: Dress) => void;
  removeFromCompare: (id: string) => void;
  clearAll: () => void;
  getMaxItemsReached: () => boolean;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  
  addToCompare: (dress) => {
    const currentItems = get().items;
    
    // Check if dress is already in comparison
    if (currentItems.some(item => item.id === dress.id)) {
      return; // Don't add duplicates
    }
    
    // Enforce max 3 items
    if (currentItems.length >= 3) {
      return; // Max reached
    }
    
    set((state) => ({
      items: [...state.items, dress]
    }));
  },
  
  removeFromCompare: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }));
  },
  
  clearAll: () => {
    set({ items: [] });
  },
  
  getMaxItemsReached: () => {
    return get().items.length >= 3;
  },
  
  isInCompare: (id) => {
    return get().items.some(item => item.id === id);
  }
}));