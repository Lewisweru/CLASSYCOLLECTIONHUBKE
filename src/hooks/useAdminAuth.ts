// src/hooks/useAdminAuth.ts
import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios'; // No longer needed for login
import adminApi from '../lib/adminApi'; // *** Import adminApi ***
import toast from 'react-hot-toast';

const STORAGE_KEY = 'admin-auth-token';
// Removed API_BASE_URL constant as adminApi handles it

export function useAdminAuth() {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Tracks initial token load
    const [isLoggingIn, setIsLoggingIn] = useState(false); // Tracks login API call

    useEffect(() => {
        const storedToken = localStorage.getItem(STORAGE_KEY);
        if (storedToken) {
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (password: string): Promise<boolean> => {
        const username = 'admin'; // Keep fixed username assumption
        setIsLoggingIn(true);
        let loginSuccess = false; // Track success state
        try {
            // *** FIX: Use adminApi and the full relative path ***
            const response = await adminApi.post<{ token: string }>('/api/admin/auth/login', {
                username,
                password,
            });
            // *** End FIX ***

            if (response.data && response.data.token) {
                const receivedToken = response.data.token;
                localStorage.setItem(STORAGE_KEY, receivedToken);
                setToken(receivedToken);
                toast.success('Admin login successful!');
                loginSuccess = true; // Set success flag
            } else {
                // This case might occur if backend sends 200 without a token
                console.error('Admin login failed: Invalid response structure from login endpoint.', response.data);
                throw new Error('Invalid response from login endpoint.');
            }
        } catch (error: any) {
            console.error('Admin login failed:', error);
            // Error toast is likely handled by the adminApi interceptor now
            // Only show a generic fallback if not handled
            if (!error.handled) {
                 const errorMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
                 toast.error(errorMsg);
            }
            localStorage.removeItem(STORAGE_KEY);
            setToken(null);
            loginSuccess = false; // Ensure success is false on error
        } finally {
             setIsLoggingIn(false); // Stop loading indicator regardless of outcome
        }
        return loginSuccess; // Return the success status
    }, []); // No dependencies needed

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        toast.success('Logged out.');
    }, []);

    const isAuthenticated = !!token;

    return {
        token,
        isAuthenticated,
        isLoading: isLoading || isLoggingIn, // Combined loading state
        login,
        logout
    };
}