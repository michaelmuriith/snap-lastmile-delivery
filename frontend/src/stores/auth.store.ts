import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, AuthState, AuthUser, LoginForm, RegisterForm, User } from '../types';
import { apiService } from '../services/api';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: LoginForm) => {
        set({ isLoading: true });
        try {
          const user = await apiService.login(credentials);

          console.log('Logged in user:', user);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterForm) => {
        set({ isLoading: true });
        try {
          await apiService.register(userData);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiService.logout();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshProfile: async () => {
        try {
          const userData = await apiService.getProfile();
          // Merge with existing tokens
          const currentUser = get().user;
          const user: User = {
            ...userData,
          };
          set({ user });
        } catch (error) {
          // If profile fetch fails, logout
          get().logout();
          throw error;
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          await get().refreshProfile();
          set({ isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);