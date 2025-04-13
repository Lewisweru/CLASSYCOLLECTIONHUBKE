// src/components/AdminProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { BarLoader } from 'react-spinners';

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAdminAuth();
    const location = useLocation();

    if (isLoading) {
        // Optional: Show a full-page loader while checking auth state
        return (
            <div className="flex justify-center items-center h-screen">
                <BarLoader color="#14B8A6" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect them to the /admin/login page, but save the current location they were
        // trying to go to. This allows us to send them back after login.
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>; // Render the protected component
};

export default AdminProtectedRoute;