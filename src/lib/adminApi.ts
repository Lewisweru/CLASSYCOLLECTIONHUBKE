// src/lib/adminApi.ts
import axios from 'axios';

const STORAGE_KEY = 'admin-secret-key'; // Same key as in useAdminAuth

// Get the base URL from environment variables or default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const adminApi = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the admin secret header
adminApi.interceptors.request.use(
    (config) => {
        const adminKey = sessionStorage.getItem(STORAGE_KEY);
        if (adminKey) {
            config.headers['X-Admin-Secret'] = adminKey;
        } else {
            // Optionally handle the case where the key is missing
            // Could redirect to login or throw an error depending on strategy
            console.warn('Admin secret key not found in sessionStorage.');
            // You might want to cancel the request here if the key is mandatory
            // return Promise.reject(new Error('Admin key missing'));
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Optional: Add response interceptor for global error handling
adminApi.interceptors.response.use(
    (response) => response, // Simply return successful responses
    (error) => {
         // Handle specific error codes (e.g., 403 Forbidden might mean key expired/invalid)
         if (error.response?.status === 403) {
             console.error('Admin request forbidden (403). Invalid/missing key?');
             // Optionally clear the stored key and redirect to login
             // sessionStorage.removeItem(STORAGE_KEY);
             // window.location.href = '/admin/login'; // Force reload/redirect
         }
         return Promise.reject(error); // Propagate the error
    }
);


export default adminApi;