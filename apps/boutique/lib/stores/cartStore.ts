import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    productId: string;
    quantity: number;
    rentalDays: number;
    size?: string;
    // Metadata for UI
    name?: string;
    price?: number;
    image?: string;
    category?: string;
}

interface CartStore {
    items: CartItem[];
    isLoading: boolean;
    setItems: (items: CartItem[]) => void;
    fetchCart: () => Promise<void>;
    addItem: (item: CartItem) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    getCartCount: () => number;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            setItems: (items) => set({ items }),

            fetchCart: async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ items: [], isLoading: false });
                    return;
                }

                set({ isLoading: true });
                try {
                    const response = await fetch('/api/cart', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const resData = await response.json();
                    if (resData.success && resData.data) {
                        const formattedItems = resData.data.map((item: any) => ({
                            productId: item.productId._id || item.productId,
                            quantity: item.quantity,
                            rentalDays: item.rentalDays,
                            size: item.size,
                            name: item.productId.name,
                            price: item.productId.rentalPricePerDay || item.productId.price,
                            image: item.productId.image || item.productId.images?.[0],
                            category: item.productId.category
                        }));
                        set({ items: formattedItems });
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            addItem: async (item) => {
                const token = localStorage.getItem('token');
                if (!token) return;

                try {
                    await fetch('/api/cart', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            productId: item.productId,
                            quantity: item.quantity,
                            rentalDays: item.rentalDays,
                            size: item.size
                        })
                    });
                    await get().fetchCart();
                } catch (e) {
                    console.error('Failed to add to cart', e);
                }
            },

            removeItem: async (productId) => {
                const token = localStorage.getItem('token');
                if (!token) return;

                try {
                    await fetch(`/api/cart?productId=${productId}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    await get().fetchCart();
                } catch (e) {
                    console.error('Failed to remove from cart', e);
                }
            },

            getCartCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
