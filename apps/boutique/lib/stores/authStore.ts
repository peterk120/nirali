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
    login: (userData: UserProfile) => void;
    logout: () => void;
    fetchSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,

            login: (userData) => set({ isLoggedIn: true, user: userData }),
            logout: () => {
                localStorage.removeItem('token');
                set({ isLoggedIn: false, user: null });
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
                    } else {
                        localStorage.removeItem('token');
                        set({ isLoggedIn: false, user: null });
                    }
                } catch (e) {
                    console.error("Failed to fetch session", e);
                }
            }
        }),
        {
            name: 'auth-storage', // name of item in localStorage
        }
    )
);
