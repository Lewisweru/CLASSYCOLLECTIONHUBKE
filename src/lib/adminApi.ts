// src/lib/adminApi.ts
import axios from 'axios';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'admin-auth-token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// Request interceptor to handle API prefix and auth
adminApi.interceptors.request.use(
    (config) => {
        // Ensure all requests are prefixed with /api
        if (!config.url?.startsWith('/api')) {
            config.url = `/api${config.url?.startsWith('/') ? '' : '/'}${config.url}`;
        }

        const token = localStorage.getItem(STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Enhanced response interceptor
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Network errors (server unreachable)
        if (error.code === 'ERR_NETWORK') {
            toast.error('Network error - please check your connection');
            return Promise.reject({ ...error, handled: true });
        }

        // Server responded with error
        if (error.response) {
            const { status, data } = error.response;

            // Handle auth errors
            if (status === 401 || status === 403) {
                // Skip redirect if already on login page
                if (!window.location.pathname.includes('/login')) {
                    localStorage.removeItem(STORAGE_KEY);
                    toast.error(data?.message || 'Session expired. Please login again.');
                    
                    // Delay redirect to allow toast to show
                    setTimeout(() => {
                        window.location.href = '/admin/login';
                    }, 1500);
                }
                return Promise.reject({ ...error, handled: true });
            }

            // Handle specific backend errors
            if (status === 404 && data.message?.includes('Not Found')) {
                console.error('API Route not found:', error.config.url);
                return Promise.reject({ 
                    ...error, 
                    message: 'Requested resource not found' 
                });
            }
        }

        // For all other errors, show generic message in production
        if (import.meta.env.PROD && !error.config?._retry) {
            toast.error('An unexpected error occurred');
        }

        return Promise.reject(error);
    }
);



export default adminApi;