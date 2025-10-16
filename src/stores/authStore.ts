import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { authService } = await import('../services/authService');
          const response = await authService.login(email, password);
          
          // Transform API response to User format
          const user: User = {
            id: response.id,
            email: response.email,
            name: `${response.first_name} ${response.last_name}`,
            firstName: response.first_name,
            lastName: response.last_name,
            isVerified: response.is_verified,
            role: response.user_role,
            createdAt: new Date()
          };
          
          set({
            user,
            accessToken: response.access,
            refreshToken: response.refresh,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed'
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { authService } = await import('../services/authService');
          const response = await authService.register(name, email, password);
          
          // Transform API response to User format
          const user: User = {
            id: response.id,
            email: response.email,
            name: `${response.first_name} ${response.last_name}`,
            firstName: response.first_name,
            lastName: response.last_name,
            isVerified: response.is_verified,
            role: response.user_role,
            createdAt: new Date()
          };
          
          set({
            user,
            accessToken: response.access,
            refreshToken: response.refresh,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed'
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },

      setLoading: (loading: boolean) => 
        set({ isLoading: loading }),

      setError: (error: string | null) => 
        set({ error }),

      clearError: () => 
        set({ error: null }),

      updateUser: (userData: Partial<User>) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),
    }),
    {
      name: 'sheria-ai-auth',
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// Selector functions for components to use
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);
export const useAccessToken = () => useAuthStore(state => state.accessToken);
export const useRefreshToken = () => useAuthStore(state => state.refreshToken);
