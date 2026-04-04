import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    role?: 'user' | 'admin' | 'sales';
    avatar?: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: UserProfile | null;
    token: string | null;
    bookingsCount: number;
    login: (userData: UserProfile, token: string) => void;
    logout: () => void;
    logoutAll: () => void;
    checkAuth: () => Promise<void>;
    fetchSession: () => Promise<void>;
    fetchBookingsCount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isLoggedIn: false,
            user: null,
            token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
            bookingsCount: 0,

            login: (userData, token) => {
                localStorage.setItem('token', token);
                set({ isLoggedIn: true, user: userData, token });
                get().fetchBookingsCount(); // Fetch counts on login
                
                // Merge guest cart and wishlist if user was browsing as guest
                setTimeout(async () => {
                    const [{ useCartStore }, { useWishlistStore }] = await Promise.all([
                        import('./cartStore'),
                        import('./wishlistStore')
                    ]);
                    await Promise.all([
                        useCartStore.getState().mergeGuestCart(),
                        useWishlistStore.getState().mergeGuestWishlist()
                    ]);
                }, 0);
            },
            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ isLoggedIn: false, user: null, token: null, bookingsCount: 0 });
            },
            logoutAll: async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const { logoutAll: apiLogoutAll } = await import('../api');
                        await apiLogoutAll();
                    } catch (e) {
                        console.error('Logout all failed', e);
                    }
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ isLoggedIn: false, user: null, bookingsCount: 0 });
            },
            fetchBookingsCount: async () => {
                const state = get();
                if (!state.isLoggedIn || !state.user?.email) return;

                const token = localStorage.getItem('token');
                if (!token) return;

                try {
                    const res = await fetch(`${baseUrl}/bookings?email=${state.user.email}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success) {
                        set({ bookingsCount: data.count || 0 });
                    }
                } catch (e) {
                    console.error('Failed to fetch bookings count', e);
                }
            },
            checkAuth: async () => {
                await get().fetchSession();
            },
            fetchSession: async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ isLoggedIn: false, user: null, token: null });
                    return;
                }
                try {
                    const res = await fetch(`${baseUrl}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        set({ isLoggedIn: true, user: data.data, token });
                        get().fetchBookingsCount(); // Fetch counts after session restoration
                    } else {
                        localStorage.removeItem('token');
                        set({ isLoggedIn: false, user: null, token: null, bookingsCount: 0 });
                    }
                } catch (e) {
                    console.error("Failed to fetch session", e);
                }
            }
        }),
        {
            name: 'auth-storage', // name of item in localStorage
            partialize: (state) => ({ // only persist login and user, counts are fresh
                isLoggedIn: state.isLoggedIn,
                user: state.user,
            }),
        }
    )
);
