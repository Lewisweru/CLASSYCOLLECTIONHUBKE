import axios from 'axios';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'admin-auth-token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
console.log(`[adminApi] Configured Base URL: ${API_BASE_URL}`); // Verify this is WITHOUT /api

const adminApi = axios.create({
    // baseURL: API_BASE_URL, // REMOVED baseURL from instance config
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// --- Interceptor Now Constructs Full URL ---
adminApi.interceptors.request.use(
    (config) => {
        let relativePath = config.url || '';
        console.log(`[adminApi] Initial relativePath: ${relativePath}`);

        // Ensure relativePath starts with '/' if not empty
        if (relativePath && !relativePath.startsWith('/')) {
            relativePath = `/${relativePath}`;
        }
        // --> Important: We still expect calls like adminApi.get('/api/admin/orders')

        // Construct the full URL manually
        config.url = `${API_BASE_URL}${relativePath}`; // Prepend the BASE_URL

        console.log(`[adminApi] Final Full URL: ${config.url}`);

        // Add Auth token
        const token = localStorage.getItem(STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // Only warn if NOT the login request itself
            if (!config.url.endsWith('/api/admin/auth/login')) { // Check the final URL
                 console.warn('[adminApi] No admin token found in localStorage for protected route.');
            }
        }
        return config;
    },
    (error) => {
        console.error("[adminApi] Request Setup Error:", error);
        toast.error(`Admin request setup failed: ${error.message}`);
        return Promise.reject(error);
    }
);
// --- End Interceptor Update ---

// --- Response Interceptor (Keep As Is) ---
adminApi.interceptors.response.use(
    (response) => response,
    (error) => { /* ... existing response error handling ... */
        console.error("[adminApi] Response Error Status:", error.response?.status);
        console.error("[adminApi] Response Error Data:", error.response?.data);
        console.error("[adminApi] Request Config:", error.config);
        const requestInfo = `${error.config?.method?.toUpperCase()} ${error.config?.url}`; // URL is now absolute

        if (error.code === 'ERR_NETWORK') {
            toast.error('Network Error - Could not reach the admin server. Please check connection.');
            return Promise.reject({ ...error, handled: true });
        }
        if (error.response) {
            const { status, data } = error.response;
            const errorMessage = data?.message || error.message || 'An error occurred on the server.';
            if (status === 401 || status === 403) {
                console.warn(`[adminApi] Auth Error (${status}) on ${requestInfo}. Token might be invalid or expired.`);
                const isLoginRequest = error.config?.url?.endsWith('/api/admin/auth/login');
                if (!window.location.pathname.includes('/admin/login') && !isLoginRequest ) {
                    localStorage.removeItem(STORAGE_KEY);
                    toast.error(`${errorMessage}. Redirecting to login...`);
                    setTimeout(() => { window.location.href = '/admin/login'; }, 1800);
                } else if (isLoginRequest) { console.warn('[adminApi] Login attempt failed (handled by login page).'); }
                else { toast.error(`Authentication Error: ${errorMessage}`); }
                return Promise.reject({ ...error, handled: true });
            }
            if (status === 404) { console.error(`[adminApi] Resource not found (404) at: ${requestInfo}`);
            } else if (status === 409) { console.warn(`[adminApi] Conflict (409) on ${requestInfo}: ${errorMessage}`);
            } else if (status === 400) { console.warn(`[adminApi] Bad Request (400) on ${requestInfo}: ${errorMessage}`);
            } else if (status >= 500) { console.error(`[adminApi] Server Error (${status}) on ${requestInfo}. Check backend logs.`); toast.error(`Server error: ${errorMessage}`);
            } else { console.warn(`[adminApi] Unhandled status (${status}) on ${requestInfo}: ${errorMessage}`); toast.error(`Error ${status}: ${errorMessage}`); }
        } else if (error.request) { console.error('[adminApi] No response received:', error.request); toast.error('No response from server. It might be down or unreachable.'); return Promise.reject({ ...error, handled: true });
        } else { console.error('[adminApi] Request Setup Error:', error.message); if (!error.handled) { toast.error(`Request Error: ${error.message}`); } return Promise.reject({ ...error, handled: true }); }
        return Promise.reject(error);
    }
);
// --- End Response Interceptor ---

export default adminApi;