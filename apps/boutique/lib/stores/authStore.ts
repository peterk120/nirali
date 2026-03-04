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
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,

            login: (userData) => set({ isLoggedIn: true, user: userData }),
            logout: () => set({ isLoggedIn: false, user: null }),
        }),
        {
            name: 'auth-storage', // name of item in localStorage
        }
    )
);
