// src/pages/admin/AdminDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ListOrdered, Activity, AlertCircle, ShoppingBag } from 'lucide-react'; // Added ShoppingBag
import adminApi from '../../lib/adminApi';
import { BarLoader } from 'react-spinners';

interface RecentOrder {
    id: string; merchantReference: string; customerName: string; totalAmount: number;
    status: string; createdAt: string; itemCount?: number; // itemCount is already included
}
interface DashboardStats { productCount: number; }

const AdminDashboardPage: React.FC = () => {
    // ... (useState, useEffect hooks remain the same) ...
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [ordersError, setOrdersError] = useState<string | null>(null);

    useEffect(() => { /* ... fetchStats ... */
         const fetchStats = async () => { setIsLoadingStats(true); setStatsError(null); try { const productResponse = await adminApi.get('/api/products'); setStats({ productCount: Array.isArray(productResponse.data) ? productResponse.data.length : 0 }); } catch (err: any) { console.error("Stats fetch error:", err); if(!err.handled){ setStatsError(err.response?.data?.message || 'Failed to load dashboard stats.'); } setStats(null); } finally { setIsLoadingStats(false); } }; fetchStats(); }, []);
    useEffect(() => { /* ... fetchOrders ... */
        const fetchOrders = async () => { setIsLoadingOrders(true); setOrdersError(null); try { const response = await adminApi.get<RecentOrder[]>('/api/admin/orders', { params: { limit: 5 } }); setRecentOrders(Array.isArray(response.data) ? response.data : []); } catch (err: any) { console.error("Orders fetch error:", err); if (!err.handled) { setOrdersError(err.response?.data?.message ||'Failed to load recent orders.'); } setRecentOrders([]); } finally { setIsLoadingOrders(false); } }; fetchOrders(); }, []);
    const formatPrice = (priceInSmallestUnit: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(priceInSmallestUnit / 100);
    const formatDate = (dateString: string) => { try { return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch (e) { return 'Invalid Date'; } };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
             {/* ... Stats Section ... */}
             {isLoadingStats && <div className="mb-8"><BarLoader color="#14B8A6" height={4} width={100} /></div>} {statsError && !isLoadingStats && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"><strong className="font-bold">Stats Error:</strong><span className="block sm:inline"> {statsError}</span></div> )} {!isLoadingStats && !statsError && stats && ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"><div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"><div className="p-3 rounded-full bg-teal-100 text-teal-600"><Package className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Total Products</p><p className="text-2xl font-semibold text-gray-800">{stats.productCount}</p></div></div><div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 opacity-60"><div className="p-3 rounded-full bg-blue-100 text-blue-600"><ListOrdered className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-semibold text-gray-800">N/A</p></div></div><div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 opacity-60"><div className="p-3 rounded-full bg-indigo-100 text-indigo-600"><Users className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Total Users</p><p className="text-2xl font-semibold text-gray-800">N/A</p></div></div></div> )}
             {/* ... Quick Actions ... */}
             <div className="bg-white p-6 rounded-lg shadow-md mb-8"><h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2><div className="flex flex-wrap gap-4"><Link to="/admin/products/new" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium btn-click-effect">Add New Product</Link><Link to="/admin/products" className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium btn-click-effect">View All Products</Link><Link to="/admin/categories/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium btn-click-effect">Add New Category</Link><Link to="/admin/categories" className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium btn-click-effect">View All Categories</Link></div></div>

            {/* Recent Orders Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><ListOrdered className="h-5 w-5 mr-2 text-gray-500"/> Recent Orders</h2>
                 {isLoadingOrders && <div className="flex justify-center py-4"><BarLoader color="#14B8A6" /></div>}
                 {ordersError && !isLoadingOrders && ( <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center" role="alert"><AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/> Error: {ordersError}</div> )}
                 {!isLoadingOrders && !ordersError && recentOrders.length === 0 && ( <p className="text-gray-500 text-sm text-center py-4">No recent orders found.</p> )}
                 {!isLoadingOrders && !ordersError && recentOrders.length > 0 && (
                     <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                 <tr>
                                     <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                     <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                                     <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                     {/* *** ADDED Items Column *** */}
                                     <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                     {/* *** END ADDED *** */}
                                     <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                     <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                 </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                 {recentOrders.map((order) => (
                                     <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800" title={order.merchantReference}>{order.merchantReference.length > 15 ? order.merchantReference.substring(0, 15) + '...' : order.merchantReference}</td>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.customerName}</td>
                                          {/* *** ADDED Items Cell *** */}
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                             <div className='inline-flex items-center space-x-1'>
                                                  <ShoppingBag className='h-4 w-4 text-gray-400'/>
                                                  <span>{order.itemCount ?? '?'}</span>
                                             </div>
                                         </td>
                                         {/* *** END ADDED *** */}
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">{formatPrice(order.totalAmount)}</td>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-center"><span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${ order.status === 'PAID' ? 'bg-green-100 text-green-800' : order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : order.status === 'DELIVERED' ? 'bg-indigo-100 text-indigo-800' : order.status === 'FAILED' || order.status.includes('FAIL') || order.status.includes('ERROR') ? 'bg-red-100 text-red-800' : order.status === 'CANCELLED' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-800' }`}>{order.status}</span></td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 )}
            </div>
             {/* ... Recent Activity Placeholder ... */}
             <div className="mt-8 bg-white p-6 rounded-lg shadow-md opacity-60"><h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><Activity className="h-5 w-5 mr-2 text-gray-400"/> Recent Activity</h2><p className="text-gray-500 text-sm">Other recent updates will appear here...</p></div>
        </div>
    );
};

export default AdminDashboardPage;