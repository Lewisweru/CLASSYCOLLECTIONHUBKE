// src/lib/adminApi.ts
import axios from 'axios';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'admin-auth-token'; // MUST match the key used in useAdminAuth.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Request interceptor to add the JWT Authorization header
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add the Bearer token
        } else {
            // Handle case where token is missing (user should ideally be logged out/redirected)
            console.warn('Admin API request initiated without auth token.');
            // Optionally cancel request: return Promise.reject(new Error('Admin token missing'));
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common auth errors globally
adminApi.interceptors.response.use(
    (response) => response, // Simply return successful responses
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            // If 401 (Unauthorized) or 403 (Forbidden) occurs,
            // it likely means the token is invalid or expired.
            // We should log the user out and potentially redirect them.
            if (status === 401 || status === 403) {
                console.error(`Admin API Error (${status}):`, data?.message || 'Authentication/Authorization failed');
                toast.error(data?.message || `Session expired or invalid. Please login again. (${status})`);

                // Clear the stored token
                localStorage.removeItem(STORAGE_KEY);

                // Redirect to login page - Use window.location for simplicity here,
                // or implement a more sophisticated solution using context/router state.
                // Adding a small delay can sometimes help ensure the toast is seen.
                setTimeout(() => {
                   if (!window.location.pathname.endsWith('/admin/login')) { // Avoid redirect loop
                       window.location.href = '/admin/login';
                   }
                }, 500);


                // Prevent further processing of this error by returning a specific Promise rejection
                // This helps avoid duplicate error handling in the calling components.
                 return Promise.reject({ ...error, handled: true });

            }
        }
        // Propagate other errors to be handled by the calling function
        return Promise.reject(error);
    }
);


export default adminApi;