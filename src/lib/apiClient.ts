
// CLASSYCOLLECTIONHUBKE/src/lib/apiClient.ts
import axios from 'axios';
import toast from 'react-hot-toast'; // Import toast for potential error messages

// Use VITE_API_BASE_URL, default to localhost:5001 if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
console.log(`[apiClient] Using Base URL: ${API_BASE_URL}`); // Log for verification

const apiClient = axios.create({
    baseURL: API_BASE_URL, // Use the variable here
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true // Important for cookies/sessions if needed, harmless otherwise
});

// Request interceptor (Example: adding a generic token if you had user auth)
apiClient.interceptors.request.use(
    (config) => {
        // Ensure all requests start with /api/
        // Example: if config.url is 'categories', it becomes '/api/categories'
        // Example: if config.url is '/products/batch', it becomes '/api/products/batch'
        if (config.url && !config.url.startsWith('/api/')) {
            // Ensure leading slash is handled correctly
            const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
            config.url = `/api${path}`;
        }
        console.log(`[apiClient] Requesting: ${config.method?.toUpperCase()} ${config.url}`); // Log the final URL

        // Example: If you had a separate user token system
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

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
         // Log detailed error information
         console.error("[apiClient] Response Error Status:", error.response?.status);
         console.error("[apiClient] Response Error Data:", error.response?.data);
         console.error("[apiClient] Request Config:", error.config);

         // Handle Network Errors (Server Unreachable, DNS issues, CORS block without preflight)
         if (error.code === 'ERR_NETWORK') {
             console.error('[apiClient] Network Error - Server likely unreachable or CORS issue.');
             // Show a user-friendly message
             toast.error('Network Error: Could not connect to the server. Please check your internet connection.');
             // Mark as potentially handled (though component might still want to catch)
             return Promise.reject({ ...error, handled: true });
         }

         // Handle Server Response Errors (4xx, 5xx)
         if (error.response) {
            const { status, data, config } = error.response;
            const requestUrl = config?.url || 'N/A';
            const errorMessage = data?.message || 'An error occurred on the server.'; // Use backend message if available

            switch (status) {
                case 401:
                    // Handle unauthorized (e.g., for user sessions, not typically admin here)
                    console.warn(`[apiClient] Unauthorized (401) on ${requestUrl}.`);
                    // toast.error('Authentication failed.'); // Example toast
                    break;
                case 403:
                    console.warn(`[apiClient] Forbidden (403) on ${requestUrl}. Check permissions or CORS.`);
                    // Check if it's the specific CORS error message from the backend
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
                case 409: // Conflict
                     console.warn(`[apiClient] Conflict (409) on ${requestUrl}: ${errorMessage}`);
                     toast.error(`Conflict: ${errorMessage}`);
                     break;
                case 400: // Bad Request / Validation
                    console.warn(`[apiClient] Bad Request (400) on ${requestUrl}: ${errorMessage}`);
                    // Often handled more specifically in the component's catch block
                    // toast.error(`Invalid request: ${errorMessage}`);
                    break;
                case 500:
                    console.error(`[apiClient] Internal Server Error (500) on ${requestUrl}. Check backend logs.`);
                    toast.error(`Server error: ${errorMessage}`);
                    break;
                default:
                    // Handle other unexpected statuses
                    console.error(`[apiClient] Unexpected status (${status}) on ${requestUrl}: ${errorMessage}`);
                    toast.error(`Error ${status}: ${errorMessage}`);
            }
        } else if (error.request) {
            // The request was made but no response was received
             console.error('[apiClient] No response received:', error.request);
             toast.error('No response from server. It might be down or unreachable.');
        } else {
            // Errors during request setup
            console.error('[apiClient] Request Setup Error:', error.message);
            toast.error(`Request Error: ${error.message}`);
        }

        // Reject the promise so downstream .catch() blocks in components can handle it further if needed
        // We add 'handled' primarily for network/auth errors where we showed a clear toast
        return Promise.reject(error);
    }
);

export default apiClient;