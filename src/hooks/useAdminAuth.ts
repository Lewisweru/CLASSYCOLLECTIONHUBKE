// src/hooks/useAdminAuth.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Use axios for the login request
import toast from 'react-hot-toast';

const STORAGE_KEY = 'admin-auth-token'; // Changed key name slightly
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export function useAdminAuth() {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Tracks initial token load
    const [isLoggingIn, setIsLoggingIn] = useState(false); // Tracks login API call

    // Load token from localStorage on initial mount
    useEffect(() => {
        const storedToken = localStorage.getItem(STORAGE_KEY);
        if (storedToken) {
            // Optional: Could add token validation here (e.g., check expiry locally if possible)
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (password: string): Promise<boolean> => {
        // Assuming a fixed username 'admin' for simplicity, matching backend
        const username = 'admin';
        setIsLoggingIn(true);
        try {
            const response = await axios.post<{ token: string }>(`${API_BASE_URL}/admin/auth/login`, {
                username,
                password, // Send plain password, backend will hash and compare
            });

            if (response.data && response.data.token) {
                const receivedToken = response.data.token;
                localStorage.setItem(STORAGE_KEY, receivedToken);
                setToken(receivedToken);
                toast.success('Admin login successful!');
                setIsLoggingIn(false);
                return true;
            } else {
                throw new Error('Invalid response from login endpoint.');
            }
        } catch (error: any) {
            console.error('Admin login failed:', error);
            const errorMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
            toast.error(errorMsg);
            localStorage.removeItem(STORAGE_KEY); // Ensure no invalid token is stored
            setToken(null);
            setIsLoggingIn(false);
            return false;
        }
    }, []); // No dependencies needed if API_BASE_URL is stable

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        toast.success('Logged out.');
        // No need to navigate here, handle navigation in the component calling logout
    }, []);

    const isAuthenticated = !!token;

    return {
        token, // Provide token if needed elsewhere (though adminApi handles it)
        isAuthenticated,
        isLoading: isLoading || isLoggingIn, // Combine loading states
        login,
        logout
    };
}