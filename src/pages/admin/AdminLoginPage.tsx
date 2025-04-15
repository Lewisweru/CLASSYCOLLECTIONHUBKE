// src/pages/admin/AdminLoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Lock, Loader2 } from 'lucide-react'; // Added Loader2

const AdminLoginPage: React.FC = () => {
    const [password, setPassword] = useState(''); // Changed state from 'secret' to 'password'
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading } = useAdminAuth(); // Get login function and loading state

    // Get the page user tried to access before being redirected here
    const from = location.state?.from?.pathname || "/admin";

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Basic validation - can be enhanced
        if (!password) {
            setError('Password is required.');
            return;
        }

        // Attempt login using the hook's login function which now calls the API
        const loggedIn = await login(password); // Pass password

        if (loggedIn) {
            // Send them back to the page they tried to visit or the dashboard
            navigate(from, { replace: true });
        } else {
            // Error handling is now mostly done within the useAdminAuth hook via toast
            // But we can set a local error state too if needed, though it might be redundant
             if (!isLoading) { // Only set error if not already loading
                  setError('Login failed. Please check your password.');
             }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username could be added if needed, but using fixed 'admin' for now */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password" // Changed id and name
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Enter Admin Password" // Updated placeholder
                                disabled={isLoading} // Disable input while logging in
                            />
                        </div>
                    </div>

                    {error && !isLoading && ( // Only show specific error if not loading
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading} // Disable button while logging in
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 btn-click-effect disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <> <Loader2 className="animate-spin h-5 w-5 mr-2" /> Logging in... </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;