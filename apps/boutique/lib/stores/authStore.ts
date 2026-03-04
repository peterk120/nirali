import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    role?: 'user' | 'admin';
    avatar?: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: UserProfile | null;
    bookingsCount: number;
    login: (userData: UserProfile) => void;
    logout: () => void;
    fetchSession: () => Promise<void>;
    fetchBookingsCount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isLoggedIn: false,
            user: null,
            bookingsCount: 0,

            login: (userData) => {
                set({ isLoggedIn: true, user: userData });
                get().fetchBookingsCount(); // Fetch counts on login
            },
            logout: () => {
                localStorage.removeItem('token');
                set({ isLoggedIn: false, user: null, bookingsCount: 0 });
            },
            fetchBookingsCount: async () => {
                const state = get();
                if (!state.isLoggedIn || !state.user?.email) return;

                const token = localStorage.getItem('token');
                if (!token) return;

                try {
                    const res = await fetch(`/api/bookings?email=${state.user.email}`, {
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
            fetchSession: async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ isLoggedIn: false, user: null });
                    return;
                }
                try {
                    const res = await fetch('/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        set({ isLoggedIn: true, user: data.data });
                        get().fetchBookingsCount(); // Fetch counts after session restoration
                    } else {
                        localStorage.removeItem('token');
                        set({ isLoggedIn: false, user: null, bookingsCount: 0 });
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
