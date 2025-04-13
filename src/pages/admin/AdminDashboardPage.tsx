// src/pages/admin/AdminDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ListOrdered, Activity } from 'lucide-react'; // Example icons
import adminApi from '../../lib/adminApi';

interface DashboardStats {
    productCount: number;
    // Add more stats later, e.g., orderCount, userCount
}

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Example: Fetch product count (adjust endpoint if needed)
                // You might need a dedicated backend endpoint for stats: GET /api/admin/stats
                // For now, we can just count products from the existing endpoint
                const productResponse = await adminApi.get('/products'); // Fetch all products
                setStats({
                    productCount: productResponse.data.length
                    // Initialize other stats to 0 or fetch them
                });
            } catch (err: any) {
                console.error("Failed to fetch dashboard stats:", err);
                setError(err.response?.data?.message || 'Failed to load dashboard data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);


    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

            {isLoading && <p className="text-gray-500">Loading dashboard data...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {!isLoading && !error && stats && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Product Count Stat Box */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-teal-100 text-teal-600">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-semibold text-gray-800">{stats.productCount}</p>
                        </div>
                    </div>

                    {/* Placeholder for Order Count */}
                     <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 opacity-50">
                         <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                             <ListOrdered className="h-6 w-6" />
                         </div>
                         <div>
                             <p className="text-sm text-gray-500">Total Orders</p>
                             <p className="text-2xl font-semibold text-gray-800">N/A</p>
                         </div>
                     </div>

                     {/* Placeholder for User Count */}
                      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 opacity-50">
                          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                              <Users className="h-6 w-6" />
                          </div>
                          <div>
                              <p className="text-sm text-gray-500">Total Users</p>
                              <p className="text-2xl font-semibold text-gray-800">N/A</p>
                          </div>
                      </div>
                 </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/admin/products/new"
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium btn-click-effect"
                    >
                        Add New Product
                    </Link>
                     <Link
                        to="/admin/products"
                        className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium btn-click-effect"
                    >
                        View All Products
                    </Link>
                     {/* Add links to orders, categories etc. when implemented */}
                </div>
            </div>

             {/* Placeholder for Recent Activity */}
             <div className="mt-8 bg-white p-6 rounded-lg shadow-md opacity-50">
                 <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><Activity className="h-5 w-5 mr-2 text-gray-400"/> Recent Activity</h2>
                 <p className="text-gray-500 text-sm">Recent orders and updates will appear here...</p>
                 {/* Later: Fetch and display recent orders or product updates */}
             </div>

        </div>
    );
};

export default AdminDashboardPage;