// src/pages/admin/AdminDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ListOrdered, Activity, AlertCircle } from 'lucide-react';
import adminApi from '../../lib/adminApi';
import { BarLoader } from 'react-spinners';

// Define Order Type (matching backend response structure)
interface RecentOrder {
    id: string;
    merchantReference: string;
    customerName: string;
    totalAmount: number; // Smallest unit
    status: string;
    createdAt: string; // ISO Date string
    itemCount?: number; // Added from backend transformation
    // Include items if not removed in backend, otherwise remove here too
    // items: { quantity: number; price: number; product: { name: string } }[];
}

interface DashboardStats {
    productCount: number;
    // Add other stats later if needed
    // orderCount?: number;
}

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [ordersError, setOrdersError] = useState<string | null>(null);

    // Fetch Stats
    useEffect(() => {
        const fetchStats = async () => {
             setIsLoadingStats(true); setStatsError(null);
             try {
                // Fetching product count - consider a dedicated /api/admin/stats endpoint later
                const productResponse = await adminApi.get('/products'); // Using public route temporarily
                setStats({ productCount: Array.isArray(productResponse.data) ? productResponse.data.length : 0 });
            } catch (err: any) {
                 if(!err.handled){
                    setStatsError('Failed to load dashboard stats.');
                 }
                 console.error("Stats fetch error:", err);
                 setStats(null); // Reset stats on error
            } finally {
                 setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    // Fetch Recent Orders
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoadingOrders(true); setOrdersError(null);
            try {
                // Use the new admin orders endpoint
                const response = await adminApi.get<RecentOrder[]>('/admin/orders', {
                    params: { limit: 5 } // Fetch latest 5 orders
                });
                setRecentOrders(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
            } catch (err: any) {
                 if (!err.handled) {
                     setOrdersError('Failed to load recent orders.');
                 }
                 console.error("Orders fetch error:", err);
                 setRecentOrders([]); // Clear orders on error
            } finally {
                setIsLoadingOrders(false);
            }
        };
        fetchOrders();
    }, []);

    // Helper Functions
    const formatPrice = (priceInSmallestUnit: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0
        }).format(priceInSmallestUnit / 100); // Divide by 100 for display
    };
    const formatDate = (dateString: string) => {
        try {
           return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

            {/* Stats Section */}
            {isLoadingStats && <div className="mb-8"><BarLoader color="#14B8A6" height={4} width={100} /></div>}
            {statsError && <p className="text-red-600 mb-4">Error loading stats: {statsError}</p>}
            {!isLoadingStats && !statsError && stats && (
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
                     <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 opacity-60">
                         <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                             <ListOrdered className="h-6 w-6" />
                         </div>
                         <div>
                             <p className="text-sm text-gray-500">Total Orders</p>
                             <p className="text-2xl font-semibold text-gray-800">N/A</p>
                         </div>
                     </div>

                     {/* Placeholder for User Count */}
                      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 opacity-60">
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
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
                     <Link
                        to="/admin/categories/new" // Link to create category
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium btn-click-effect"
                    >
                        Add New Category
                    </Link>
                     <Link
                        to="/admin/categories" // Link to view categories
                        className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium btn-click-effect"
                    >
                        View All Categories
                    </Link>
                    {/* Add links to orders page later */}
                </div>
            </div>


            {/* Recent Orders Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><ListOrdered className="h-5 w-5 mr-2 text-gray-500"/> Recent Orders</h2>
                 {isLoadingOrders && <div className="flex justify-center py-4"><BarLoader color="#14B8A6" /></div>}
                 {ordersError && (
                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center" role="alert">
                         <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/> Error: {ordersError}
                     </div>
                 )}
                  {!isLoadingOrders && !ordersError && recentOrders.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">No recent orders found.</p>
                  )}
                 {!isLoadingOrders && !ordersError && recentOrders.length > 0 && (
                     <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                 <tr>
                                     <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                     <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                                     <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                     <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                     <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                     {/* Add Actions column later if needed */}
                                     {/* <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                                 </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                 {recentOrders.map((order) => (
                                     <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800" title={order.merchantReference}>
                                             {order.merchantReference.length > 15 ? order.merchantReference.substring(0, 15) + '...' : order.merchantReference}
                                         </td>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.customerName}</td>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">{formatPrice(order.totalAmount)}</td>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                             <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                 order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                 order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                 order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                 order.status === 'DELIVERED' ? 'bg-indigo-100 text-indigo-800' :
                                                 order.status === 'FAILED' || order.status.includes('FAIL') || order.status.includes('ERROR') ? 'bg-red-100 text-red-800' :
                                                 order.status === 'CANCELLED' ? 'bg-gray-100 text-gray-700' :
                                                 'bg-gray-100 text-gray-800' // Default/Unknown
                                             }`}>
                                                 {order.status}
                                             </span>
                                         </td>
                                         {/* Add View Details link/button later */}
                                         {/* <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                             <Link to={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                                         </td> */}
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 )}
                 {/* Link to full orders page (to be created later) */}
                 {/* {!isLoadingOrders && !ordersError && <Link to="/admin/orders" className="text-sm text-teal-600 hover:text-teal-800 mt-4 inline-block">View All Orders →</Link>} */}
            </div>

             {/* Placeholder for Recent Activity */}
             <div className="mt-8 bg-white p-6 rounded-lg shadow-md opacity-60">
                 <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><Activity className="h-5 w-5 mr-2 text-gray-400"/> Recent Activity</h2>
                 <p className="text-gray-500 text-sm">Other recent updates will appear here...</p>
             </div>

        </div>
    );
};

export default AdminDashboardPage;