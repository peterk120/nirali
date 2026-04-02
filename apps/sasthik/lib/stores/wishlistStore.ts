import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
  fetchWishlist: () => Promise<void>;
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

        const currentItems = get().items;
        if (currentItems.some(i => i.productId === item.productId)) return;

        set((state) => ({
          items: [...state.items, newItem],
        }));
        syncItemWithServer('add', newItem);
      },

      removeItem: (productId) => {
        const itemToRemove = get().items.find(i => i.productId === productId);
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId),
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

      fetchWishlist: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        try {
          const response = await fetch(`${baseUrl}/wishlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const resData = await response.json();
          if (resData.success && resData.data) {
             const formattedItems = resData.data.map((item: any) => ({
                id: item._id || item.id,
                productId: item.productId._id || item.productId,
                name: item.productId.name,
                image: item.productId.image || item.productId.images?.[0],
                price: item.productId.price,
                category: item.productId.category,
                addedAt: item.addedAt
             }));
             set({ items: formattedItems });
          }
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      }
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
    const response = await fetch(`${baseUrl}/wishlist`, {
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
    const url = action === 'add' ? `${baseUrl}/wishlist` : `${baseUrl}/wishlist?productId=${item.productId}`;
    const response = await fetch(url, {
      method: action === 'add' ? 'POST' : 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: action === 'add' ? JSON.stringify({ productId: item.productId }) : undefined,
    });

    if (!response.ok) {
      throw new Error('Failed to sync wishlist item with server');
    }
  } catch (error) {
    console.error('Failed to sync wishlist item with server:', error);
  }
};