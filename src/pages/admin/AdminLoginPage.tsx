// src/pages/admin/AdminLoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Lock } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
    const [secret, setSecret] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAdminAuth();

    // Get the page user tried to access before being redirected here
    const from = location.state?.from?.pathname || "/admin";

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Simple validation - replace with backend check ideally
        if (secret.length < 10) { // Basic check matching hook logic
            setError('Invalid secret key.');
            return;
        }

        // Attempt login using the hook's logic
        const loggedIn = login(secret);

        if (loggedIn) {
            // Send them back to the page they tried to visit or the dashboard
            navigate(from, { replace: true });
        } else {
            // This branch might not be hit often with current hook logic,
            // but keep for robustness / future backend validation
            setError('Login failed. Please check your secret key.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="secret" className="block text-sm font-medium text-gray-700 sr-only">
                            Secret Key
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="secret"
                                name="secret"
                                type="password"
                                required
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Enter Admin Secret Key"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 btn-click-effect"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;