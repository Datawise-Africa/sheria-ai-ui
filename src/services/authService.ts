import { sheriaAPI } from '../lib/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  user_role: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await sheriaAPI.post<AuthResponse>('/auth/login/', {
        email,
        password
      });

      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = (error as { response: { data: ApiError } }).response.data;
        throw new Error(apiError.message || 'Login failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      // Split the name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await sheriaAPI.post<AuthResponse>('/auth/register/', {
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });

      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = (error as { response: { data: ApiError } }).response.data;
        if (apiError.errors) {
          // Handle validation errors
          const errorMessages = Object.values(apiError.errors).flat();
          throw new Error(errorMessages.join(', '));
        }
        throw new Error(apiError.message || 'Registration failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  async logout(): Promise<void> {
    try {
      await sheriaAPI.post('/auth/logout/');
    } catch {
      // Even if logout fails on server, we should clear local state
      console.warn('Logout request failed');
    }
  },

  async refreshToken(): Promise<string> {
    try {
      const response = await sheriaAPI.post<{ access: string }>('/auth/refresh/', {
        refresh: localStorage.getItem('refresh_token')
      });
      return response.data.access;
    } catch {
      throw new Error('Token refresh failed');
    }
  },

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await sheriaAPI.get<AuthResponse>('/auth/me/');
      return response.data;
    } catch {
      throw new Error('Failed to get user information');
    }
  },

  async updateProfile(userData: Partial<AuthResponse>): Promise<AuthResponse> {
    try {
      const response = await sheriaAPI.patch<AuthResponse>('/auth/profile/', userData);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = (error as { response: { data: ApiError } }).response.data;
        throw new Error(apiError.message || 'Profile update failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await sheriaAPI.post('/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = (error as { response: { data: ApiError } }).response.data;
        throw new Error(apiError.message || 'Password change failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await sheriaAPI.post('/auth/forgot-password/', { email });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = (error as { response: { data: ApiError } }).response.data;
        throw new Error(apiError.message || 'Password reset request failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await sheriaAPI.post('/auth/reset-password/', {
        token,
        password: newPassword
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = (error as { response: { data: ApiError } }).response.data;
        throw new Error(apiError.message || 'Password reset failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }
};
