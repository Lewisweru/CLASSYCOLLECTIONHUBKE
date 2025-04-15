
// CLASSYCOLLECTIONHUBKE/src/lib/adminApi.ts
import axios from 'axios';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'admin-auth-token';
// Use VITE_API_BASE_URL, default to localhost:5001 if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
console.log(`[adminApi] Using Base URL: ${API_BASE_URL}`); // Add log for verification

const adminApi = axios.create({
    baseURL: API_BASE_URL, // Use the variable here
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true // Needed for CORS credentials handling
});

// Request interceptor to handle API prefix and auth
adminApi.interceptors.request.use(
    (config) => {
        // Ensure all requests start with /api/admin/
        // Example: if config.url is 'products', it becomes '/api/admin/products'
        // Example: if config.url is '/categories/edit/xyz', it becomes '/api/admin/categories/edit/xyz'
        if (config.url && !config.url.startsWith('/api/admin/')) {
            // Make sure we don't double-prefix if it somehow already has /admin/
             let path = config.url.startsWith('/admin/') ? config.url :
                         config.url.startsWith('/') ? `/admin${config.url}` : `/admin/${config.url}`;

            // Prepend /api if not present
            if (!path.startsWith('/api/')) {
                 path = `/api${path}`;
            }
             config.url = path;
        } else if (config.url && !config.url.startsWith('/api/')) {
            // If it doesn't start with /api/admin/ but also doesn't start with /admin/, add /api/
            const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
            config.url = `/api${path}`;
        }

        console.log(`[adminApi] Requesting: ${config.method?.toUpperCase()} ${config.url}`); // Log the final URL

        const token = localStorage.getItem(STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // console.log('[adminApi] Token attached to request.'); // Optional log for debugging
        } else {
             // Log warning only if it's NOT the login request itself
             if (config.url !== '/api/admin/auth/login') {
                 console.warn('[adminApi] No admin token found in localStorage for protected route.');
             }
        }
        return config;
    },
    (error) => {
        console.error("[adminApi] Request Setup Error:", error);
        return Promise.reject(error);
    }
);

// Enhanced response interceptor
adminApi.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
        // Log detailed error information
        console.error("[adminApi] Response Error Status:", error.response?.status);
        console.error("[adminApi] Response Error Data:", error.response?.data);
        console.error("[adminApi] Request Config:", error.config);

        // Network errors (Server Unreachable, DNS issues, CORS block without preflight)
        if (error.code === 'ERR_NETWORK') {
            toast.error('Network Error - Could not reach the admin server. Please check connection.');
            // Mark as handled to prevent duplicate generic toasts
            return Promise.reject({ ...error, handled: true });
        }

        // Server responded with error
        if (error.response) {
            const { status, data, config } = error.response;
            const requestUrl = config?.url || 'N/A';
            // Use specific message from backend > generic message > default
            const errorMessage = data?.message || error.message || 'An error occurred on the server.';

            // Handle Authentication/Authorization Errors (401 Unauthorized, 403 Forbidden)
            if (status === 401 || status === 403) {
                console.warn(`[adminApi] Auth Error (${status}) on ${requestUrl}. Token might be invalid or expired.`);
                // Avoid redirect loop if already on login page or if it was the login attempt that failed
                if (!window.location.pathname.includes('/admin/login') && requestUrl !== '/api/admin/auth/login') {
                    localStorage.removeItem(STORAGE_KEY); // Clear invalid token
                    toast.error(`${errorMessage} Redirecting to login...`);
                    // Delay redirect slightly to allow toast to be seen
                    setTimeout(() => {
                         // Use window.location.href for a full page reload which can help clear state
                         window.location.href = '/admin/login';
                    }, 1800); // Slightly longer delay
                } else if (requestUrl === '/api/admin/auth/login') {
                    // If the login *itself* failed with 401/403, don't redirect, the login page handles the error message.
                    console.warn('[adminApi] Login attempt failed.');
                } else {
                     // On login page but got auth error from another request (shouldn't happen often)
                     toast.error(`Authentication Error: ${errorMessage}`);
                }
                // Mark as handled since we took specific action (toast/redirect)
                return Promise.reject({ ...error, handled: true });
            }

             // Handle other specific backend errors (e.g., 404, 409, 400)
             // These might be better handled by the calling component using .catch()
             // but we can log them here. We *don't* mark them as handled here by default.
             if (status === 404) {
                 console.error(`[adminApi] Resource not found (404) at: ${requestUrl}`);
                 // toast.error(`Admin resource not found: ${errorMessage}`); // Optional generic toast
             } else if (status === 409) {
                 console.warn(`[adminApi] Conflict (409) on ${requestUrl}: ${errorMessage}`);
                 // toast.error(`Conflict: ${errorMessage}`); // Optional generic toast
             } else if (status === 400) {
                 console.warn(`[adminApi] Bad Request (400) on ${requestUrl}: ${errorMessage}`);
                  // Don't toast here, validation errors handled in forms
             } else if (status >= 500) {
                 console.error(`[adminApi] Server Error (${status}) on ${requestUrl}. Check backend logs.`);
                 toast.error(`Server error: ${errorMessage}`); // Show server errors
             } else {
                 console.warn(`[adminApi] Unhandled status (${status}) on ${requestUrl}: ${errorMessage}`);
                 toast.error(`Error ${status}: ${errorMessage}`); // Show other client errors
             }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('[adminApi] No response received:', error.request);
            toast.error('No response from server. It might be down or unreachable.');
            return Promise.reject({ ...error, handled: true }); // Mark as handled
        } else {
            // Errors during request setup
            console.error('[adminApi] Request Setup Error:', error.message);
            toast.error(`Request Error: ${error.message}`);
            return Promise.reject({ ...error, handled: true }); // Mark as handled
        }

        // Pass the error down for component-level handling if not specifically handled above
        return Promise.reject(error);
    }
);

export default adminApi;