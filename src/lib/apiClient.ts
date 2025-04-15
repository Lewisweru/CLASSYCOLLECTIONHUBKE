// CLASSYCOLLECTIONHUBKE/src/lib/apiClient.ts
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
console.log(`[apiClient] Using Base URL: ${API_BASE_URL}`);

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// --- CORRECTED Request Interceptor ---
apiClient.interceptors.request.use(
    (config) => {
        // Ensure the final path starts with /api (relative to baseURL)
        // Only add /api if the URL doesn't already start with it.
        if (config.url && !config.url.startsWith('/api')) {
            // Ensure we handle leading slash correctly if path is like 'categories' vs '/categories'
            const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
            config.url = `/api${path}`;
        }

        console.log(`[apiClient] Requesting: ${config.method?.toUpperCase()} ${config.url}`);

        // Example: Add user token if needed
        // const userToken = localStorage.getItem('userAuthToken');
        // if (userToken) {
        //     config.headers.Authorization = `Bearer ${userToken}`;
        // }
        return config;
    },
    (error) => {
        console.error("[apiClient] Request Setup Error:", error);
        return Promise.reject(error);
    }
);
// --- END CORRECTION ---

// Response interceptor (keep your existing detailed one)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
         console.error("[apiClient] Response Error Status:", error.response?.status);
         console.error("[apiClient] Response Error Data:", error.response?.data);
         // console.error("[apiClient] Request Config:", error.config); // Optional: log config on error

         if (error.code === 'ERR_NETWORK') {
             console.error('[apiClient] Network Error - Server likely unreachable or CORS issue.');
             toast.error('Network Error: Could not connect to the server. Please check your internet connection.');
             return Promise.reject({ ...error, handled: true });
         }
         if (error.response) {
            const { status, data, config } = error.response;
            const requestUrl = config?.url || 'N/A';
            const errorMessage = data?.message || 'An error occurred on the server.';

            switch (status) {
                case 401:
                    console.warn(`[apiClient] Unauthorized (401) on ${requestUrl}.`);
                    break;
                case 403:
                    console.warn(`[apiClient] Forbidden (403) on ${requestUrl}. Check permissions or CORS.`);
                    if (errorMessage.includes('Cross-Origin Request Blocked')) {
                         toast.error('Request blocked due to security policy (CORS).');
                    } else {
                         toast.error(`Forbidden: ${errorMessage}`);
                    }
                    break;
                case 404:
                    console.error(`[apiClient] Resource not found (404) at: ${requestUrl}`);
                    toast.error(`Server resource not found: ${errorMessage}`);
                    break;
                case 409:
                     console.warn(`[apiClient] Conflict (409) on ${requestUrl}: ${errorMessage}`);
                     toast.error(`Conflict: ${errorMessage}`);
                     break;
                case 400:
                    console.warn(`[apiClient] Bad Request (400) on ${requestUrl}: ${errorMessage}`);
                    break;
                case 500:
                    console.error(`[apiClient] Internal Server Error (500) on ${requestUrl}. Check backend logs.`);
                    toast.error(`Server error: ${errorMessage}`);
                    break;
                default:
                    console.error(`[apiClient] Unexpected status (${status}) on ${requestUrl}: ${errorMessage}`);
                    toast.error(`Error ${status}: ${errorMessage}`);
            }
        } else if (error.request) {
            console.error('[apiClient] No response received:', error.request);
            toast.error('No response from server. It might be down or unreachable.');
        } else {
            console.error('[apiClient] Request Setup Error:', error.message);
            toast.error(`Request Error: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

export default apiClient;