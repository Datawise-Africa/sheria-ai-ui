import axios from 'axios';

const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API as string;

export const sheriaAPI = axios.create({
    baseURL: VITE_BACKEND_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
sheriaAPI.interceptors.request.use(
    (config) => {
        // Get token from localStorage (set by auth store)
        const authData = localStorage.getItem('sheria-ai-auth');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                if (parsed.state?.accessToken) {
                    config.headers.Authorization = `Bearer ${parsed.state.accessToken}`;
                }
            } catch (error) {
                console.warn('Failed to parse auth data:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
sheriaAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear auth state
            localStorage.removeItem('sheria-ai-auth');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);