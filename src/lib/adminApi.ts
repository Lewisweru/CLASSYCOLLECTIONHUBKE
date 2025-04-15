// CLASSYCOLLECTIONHUBKE/src/lib/adminApi.ts
import axios from 'axios';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'admin-auth-token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
console.log(`[adminApi] Using Base URL: ${API_BASE_URL}`);

const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// --- CORRECTED Request Interceptor ---
adminApi.interceptors.request.use(
    (config) => {
        // Ensure the final path starts with /api (relative to baseURL)
        // Only add /api if the URL doesn't already start with it.
        if (config.url && !config.url.startsWith('/api')) {
             // Ensure we handle leading slash correctly if path is like 'admin/products' vs '/admin/products'
            const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
            config.url = `/api${path}`;
        }

        console.log(`[adminApi] Requesting: ${config.method?.toUpperCase()} ${config.url}`); // Log the final URL

        // --- Auth Token Logic (Keep as is) ---
        const token = localStorage.getItem(STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
             // Log warning only if it's NOT the login request itself
             if (config.url !== '/api/admin/auth/login') { // Check against the final prefixed URL
                 console.warn('[adminApi] No admin token found in localStorage for protected route.');
             }
        }
        // --- End Auth Token Logic ---

        return config;
    },
    (error) => {
        console.error("[adminApi] Request Setup Error:", error);
        return Promise.reject(error);
    }
);
// --- END CORRECTION ---


// Response interceptor (Keep your existing detailed one)
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("[adminApi] Response Error Status:", error.response?.status);
        console.error("[adminApi] Response Error Data:", error.response?.data);
        // console.error("[adminApi] Request Config:", error.config); // Optional

        if (error.code === 'ERR_NETWORK') {
            toast.error('Network Error - Could not reach the admin server. Please check connection.');
            return Promise.reject({ ...error, handled: true });
        }
        if (error.response) {
            const { status, data, config } = error.response;
            const requestUrl = config?.url || 'N/A';
            const errorMessage = data?.message || error.message || 'An error occurred on the server.';

            if (status === 401 || status === 403) {
                console.warn(`[adminApi] Auth Error (${status}) on ${requestUrl}. Token might be invalid or expired.`);
                if (!window.location.pathname.includes('/admin/login') && requestUrl !== '/api/admin/auth/login') {
                    localStorage.removeItem(STORAGE_KEY);
                    toast.error(`${errorMessage} Redirecting to login...`);
                    setTimeout(() => {
                         window.location.href = '/admin/login';
                    }, 1800);
                } else if (requestUrl === '/api/admin/auth/login') {
                    console.warn('[adminApi] Login attempt failed.');
                    // Login page should show the error from its own catch block
                } else {
                     toast.error(`Authentication Error: ${errorMessage}`);
                }
                return Promise.reject({ ...error, handled: true });
            }

             if (status === 404) {
                 console.error(`[adminApi] Resource not found (404) at: ${requestUrl}`);
             } else if (status === 409) {
                 console.warn(`[adminApi] Conflict (409) on ${requestUrl}: ${errorMessage}`);
             } else if (status === 400) {
                 console.warn(`[adminApi] Bad Request (400) on ${requestUrl}: ${errorMessage}`);
             } else if (status >= 500) {
                 console.error(`[adminApi] Server Error (${status}) on ${requestUrl}. Check backend logs.`);
                 toast.error(`Server error: ${errorMessage}`);
             } else {
                 console.warn(`[adminApi] Unhandled status (${status}) on ${requestUrl}: ${errorMessage}`);
                 toast.error(`Error ${status}: ${errorMessage}`);
             }
        } else if (error.request) {
            console.error('[adminApi] No response received:', error.request);
            toast.error('No response from server. It might be down or unreachable.');
            return Promise.reject({ ...error, handled: true });
        } else {
            console.error('[adminApi] Request Setup Error:', error.message);
            toast.error(`Request Error: ${error.message}`);
            return Promise.reject({ ...error, handled: true });
        }
        return Promise.reject(error);
    }
);

export default adminApi;