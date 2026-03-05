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
    mergeGuestCart: () => Promise<void>; // New method to merge guest cart on login
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

                // Guest cart handling - store locally until login
                if (!token) {
                    console.warn('Guest cart addition: Item added to local store.');
                    const currentItems = get().items;
                    const existingIndex = currentItems.findIndex(i => i.productId === item.productId);

                    if (existingIndex > -1) {
                        const updatedItems = [...currentItems];
                        updatedItems[existingIndex].quantity = Math.min(
                            updatedItems[existingIndex].quantity + (item.quantity || 1),
                            10
                        );
                        set({ items: updatedItems });
                    } else {
                        set({ items: [...currentItems, { ...item, quantity: item.quantity || 1 }] });
                    }
                    
                    // Force re-render by triggering a state update
                    setTimeout(() => set({ items: [...get().items] }), 0);
                    return;
                }

                try {
                    const response = await fetch('/api/cart', {
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

                    if (!response.ok) throw new Error('Failed to add to backend cart');

                    // Immediately refresh cart to sync with backend
                    await get().fetchCart();
                    
                    // Small delay to ensure UI updates
                    setTimeout(() => set({ items: [...get().items] }), 100);
                } catch (e) {
                    console.error('Failed to add to cart', e);
                    // Fallback: Update local state even if API fails
                    const currentItems = get().items;
                    const existingIndex = currentItems.findIndex(i => i.productId === item.productId);
                    if (existingIndex > -1) {
                        const updatedItems = [...currentItems];
                        updatedItems[existingIndex].quantity = Math.min(
                            updatedItems[existingIndex].quantity + (item.quantity || 1),
                            10
                        );
                        set({ items: updatedItems });
                    } else {
                        set({ items: [...currentItems, { ...item, quantity: item.quantity || 1 }] });
                    }
                    
                    // Force re-render
                    setTimeout(() => set({ items: [...get().items] }), 0);
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

            mergeGuestCart: async () => {
                // Merge guest cart items into authenticated cart on login
                const token = localStorage.getItem('token');
                if (!token) return;

                const guestItems = get().items;
                if (guestItems.length === 0) return;

                try {
                    // Add each guest item to the backend cart
                    for (const item of guestItems) {
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
                    }

                    // Clear local guest cart and fetch from backend
                    set({ items: [] });
                    await get().fetchCart();
                    console.log('Guest cart merged successfully');
                } catch (e) {
                    console.error('Failed to merge guest cart', e);
                }
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
