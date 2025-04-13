// src/lib/apiClient.ts
import axios from 'axios';

// Get the base URL from environment variables or default to local development URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true // Include if you need to send cookies
});

// Request interceptor for adding auth tokens or other headers
apiClient.interceptors.request.use(
    (config) => {
        // You can modify requests here (e.g., add auth token)
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle different HTTP status codes
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized (e.g., redirect to login)
                    break;
                case 403:
                    // Handle forbidden
                    break;
                case 404:
                    // Handle not found
                    break;
                case 500:
                    // Handle server error
                    break;
                default:
                    // Handle other errors
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;