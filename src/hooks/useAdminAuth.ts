// src/hooks/useAdminAuth.ts
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'admin-secret-key';

export function useAdminAuth() {
    const [adminKey, setAdminKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load key from sessionStorage on initial mount
        const storedKey = sessionStorage.getItem(STORAGE_KEY);
        setAdminKey(storedKey);
        setIsLoading(false);
    }, []);

    const login = (key: string): boolean => {
        // In a real app, you'd ideally verify this key against a backend endpoint
        // For this simple example, we assume the entered key IS the correct one if validation passes elsewhere
        // Basic check: ensure the ADMIN_SECRET_KEY from .env was entered
        // THIS IS NOT HIGH SECURITY - just keeps non-admins out easily
        if (key && key.length > 10) { // Simple validation
            sessionStorage.setItem(STORAGE_KEY, key);
            setAdminKey(key);
            return true;
        }
        return false;
    };

    const logout = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setAdminKey(null);
    };

    const isAuthenticated = !!adminKey;

    return { adminKey, isAuthenticated, isLoading, login, logout };
}