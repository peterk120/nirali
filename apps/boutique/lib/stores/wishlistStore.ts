import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  category: string;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem = {
          ...item,
          addedAt: new Date().toISOString(),
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
        syncItemWithServer('add', newItem);
      },

      removeItem: (id) => {
        const itemToRemove = get().items.find(i => i.id === id);
        set((state) => ({
          items: state.items.filter(item => item.id !== id),
        }));
        if (itemToRemove) {
          syncItemWithServer('remove', itemToRemove);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getWishlistCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'wishlist-storage', // unique name
      partialize: (state) => ({ items: state.items }), // only persist items
    }
  )
);

// API sync functions
export const syncWishlistWithServer = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // User not logged in, nothing to sync
    return;
  }

  try {
    const response = await fetch('/api/wishlist', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const serverWishlist = await response.json();

      // Merge local wishlist with server wishlist
      useWishlistStore.getState().clearWishlist();

      serverWishlist.items.forEach((item: WishlistItem) => {
        useWishlistStore.getState().addItem(item);
      });
    }
  } catch (error) {
    console.error('Failed to sync wishlist with server:', error);
  }
};

export const syncItemWithServer = async (action: 'add' | 'remove', item: WishlistItem) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // User not logged in, nothing to sync
    return;
  }

  try {
    const response = await fetch('/api/wishlist', {
      method: action === 'add' ? 'POST' : 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: item.productId }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync wishlist item with server');
    }
  } catch (error) {
    console.error('Failed to sync wishlist item with server:', error);
  }
};