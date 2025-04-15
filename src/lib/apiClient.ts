import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
console.log(`[apiClient] Configured Base URL: ${API_BASE_URL}`); // Verify this is WITHOUT /api

const apiClient = axios.create({
    // baseURL: API_BASE_URL, // REMOVED baseURL from instance config
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// --- Interceptor Now Constructs Full URL ---
apiClient.interceptors.request.use(
    (config) => {
        let relativePath = config.url || '';
        console.log(`[apiClient] Initial relativePath: ${relativePath}`);

        // Ensure relativePath starts with '/' if not empty
        if (relativePath && !relativePath.startsWith('/')) {
            relativePath = `/${relativePath}`;
        }
        // --> Important: We still expect calls like apiClient.get('/api/categories')

        // Construct the full URL manually
        config.url = `${API_BASE_URL}${relativePath}`; // Prepend the BASE_URL

        console.log(`[apiClient] Final Full URL: ${config.url}`);

        return config;
    },
    (error) => {
        console.error("[apiClient] Request Setup Error:", error);
        toast.error(`Request setup failed: ${error.message}`);
        return Promise.reject(error);
    }
);
// --- End Interceptor Update ---

// --- Response Interceptor (Keep As Is) ---
apiClient.interceptors.response.use(
    (response) => response,
    (error) => { /* ... existing response error handling ... */
        console.error("[apiClient] Response Error Status:", error.response?.status);
        console.error("[apiClient] Response Error Data:", error.response?.data);
        console.error("[apiClient] Request Config:", error.config);
        const requestInfo = `${error.config?.method?.toUpperCase()} ${error.config?.url}`; // URL is now absolute

        if (error.code === 'ERR_NETWORK') {
            console.error(`[apiClient] Network Error for ${requestInfo} - Server likely unreachable or CORS issue.`);
            toast.error('Network Error: Could not connect to the server. Please check your internet connection.');
            return Promise.reject({ ...error, handled: true });
        }
        if (error.response) {
            const { status, data } = error.response;
            const errorMessage = data?.message || 'An error occurred on the server.';
            switch (status) {
                case 401: console.warn(`[apiClient] Unauthorized (401) on ${requestInfo}.`); break;
                case 403: console.warn(`[apiClient] Forbidden (403) on ${requestInfo}. Check permissions or CORS.`); if (errorMessage.includes('Cross-Origin Request Blocked')) { toast.error('Request blocked due to security policy (CORS).'); } else { toast.error(`Forbidden: ${errorMessage}`); } break;
                case 404: console.error(`[apiClient] Resource not found (404) at: ${requestInfo}`); toast.error(`Server resource not found: ${errorMessage}`); break;
                case 409: console.warn(`[apiClient] Conflict (409) on ${requestInfo}: ${errorMessage}`); toast.error(`Conflict: ${errorMessage}`); break;
                case 400: console.warn(`[apiClient] Bad Request (400) on ${requestInfo}: ${errorMessage}`); break;
                case 500: console.error(`[apiClient] Internal Server Error (500) on ${requestInfo}. Check backend logs.`); toast.error(`Server error: ${errorMessage}`); break;
                default: console.error(`[apiClient] Unexpected status (${status}) on ${requestInfo}: ${errorMessage}`); toast.error(`Error ${status}: ${errorMessage}`);
            }
        } else if (error.request) { console.error('[apiClient] No response received:', error.request); toast.error('No response from server. It might be down or unreachable.');
        } else { console.error('[apiClient] Request Error:', error.message); if (!error.handled) { toast.error(`Request Error: ${error.message}`); } }
        return Promise.reject(error);
    }
);
// --- End Response Interceptor ---

export default apiClient;