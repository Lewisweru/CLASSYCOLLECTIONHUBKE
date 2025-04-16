// src/pages/admin/AdminDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Removed unused 'Users' import, added ShoppingBag if needed for itemCount display
import { Package, ListOrdered, Activity, AlertCircle, BarChart3, ShoppingBag } from 'lucide-react';
import adminApi from '../../lib/adminApi';
import { BarLoader } from 'react-spinners';

// Interface for the Order Summary part (matching what the list endpoint returns)
interface OrderSummary {
    id: string;
    merchantReference: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    itemCount?: number;
}

// Interface for the response structure of the /api/admin/orders GET endpoint
interface FetchOrdersResponse {
    orders: OrderSummary[];
    totalOrders: number;
    currentPage: number;
    totalPages: number;
}

// Combined stats interface
interface DashboardData {
    productCount: number;
    totalSalesInCents: number;
    totalOrders: number;
    paidOrders: number;
}


const AdminDashboardPage: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    // Use OrderSummary for the state type here
    const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
             setIsLoadingData(true); setError(null);
             try {
                const [statsResponse, productResponse, ordersResponse] = await Promise.all([
                     adminApi.get<DashboardData>('/api/admin/orders/stats'),
                     adminApi.get('/api/products'), // Assuming this endpoint still exists for public count
                     // Use the correct Response type here
                     adminApi.get<FetchOrdersResponse>('/api/admin/orders', { params: { limit: 5 } })
                ]);

                const statsData = statsResponse.data;
                const productCount = Array.isArray(productResponse.data) ? productResponse.data.length : 0;

                setDashboardData({
                    productCount: productCount,
                    totalSalesInCents: statsData.totalSalesInCents ?? 0,
                    totalOrders: statsData.totalOrders ?? 0,
                    paidOrders: statsData.paidOrders ?? 0,
                });

                // Ensure orders is an array before setting state
                setRecentOrders(Array.isArray(ordersResponse.data?.orders) ? ordersResponse.data.orders : []);

            } catch (err: any) {
                 console.error("Dashboard fetch error:", err);
                 if(!err.handled){ setError(err.response?.data?.message || 'Failed to load dashboard data.'); }
                 setDashboardData(null); setRecentOrders([]);
            } finally { setIsLoadingData(false); }
        };
        fetchDashboardData();
    }, []);

    // --- Helper Functions (remain the same) ---
    const formatPrice = (priceInSmallestUnit: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(priceInSmallestUnit / 100);
    const formatDate = (dateString: string) => { try { return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch (e) { return 'Invalid Date'; } };
    const getStatusColor = (status: string): string => { /* ... same switch ... */ switch (status?.toUpperCase()) { case 'PAID': return 'bg-green-100 text-green-800'; case 'PENDING': return 'bg-yellow-100 text-yellow-800'; case 'SHIPPED': return 'bg-blue-100 text-blue-800'; case 'PROCESSING': return 'bg-purple-100 text-purple-800'; case 'DELIVERED': return 'bg-indigo-100 text-indigo-800'; case 'FAILED': case 'PAYMENT_FAILED': return 'bg-red-100 text-red-800'; case 'CANCELLED': return 'bg-gray-100 text-gray-700'; default: return 'bg-gray-100 text-gray-800'; } };


    return (
        <div>
            {/* ... (JSX remains largely the same, ensure correct variable names like dashboardData) ... */}
             <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
             {isLoadingData && <div className="mb-8"><BarLoader color="#14B8A6" height={4} width={100} /></div>}
             {error && !isLoadingData && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"><strong className="font-bold">Error:</strong><span className="block sm:inline"> {error}</span></div> )}
             {!isLoadingData && !error && dashboardData && ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"><div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"><div className="p-3 rounded-full bg-green-100 text-green-600"><BarChart3 className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Total Sales (Paid)</p><p className="text-2xl font-semibold text-gray-800">{formatPrice(dashboardData.totalSalesInCents)}</p></div></div><div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"><div className="p-3 rounded-full bg-blue-100 text-blue-600"><ListOrdered className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Paid Orders</p><p className="text-2xl font-semibold text-gray-800">{dashboardData.paidOrders} / {dashboardData.totalOrders}</p></div></div><div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"><div className="p-3 rounded-full bg-teal-100 text-teal-600"><Package className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Total Products</p><p className="text-2xl font-semibold text-gray-800">{dashboardData.productCount}</p></div></div></div> )}
             <div className="bg-white p-6 rounded-lg shadow-md mb-8"><h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2><div className="flex flex-wrap gap-4"><Link to="/admin/products/new" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium btn-click-effect">Add New Product</Link><Link to="/admin/products" className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium btn-click-effect">View All Products</Link><Link to="/admin/categories/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium btn-click-effect">Add New Category</Link><Link to="/admin/categories" className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium btn-click-effect">View All Categories</Link></div></div>
             <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><ListOrdered className="h-5 w-5 mr-2 text-gray-500"/> Recent Orders</h2>{isLoadingData && <div className="flex justify-center py-4"><BarLoader color="#14B8A6" /></div>}{error && !isLoadingData && ( <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center" role="alert"><AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/> Error loading data.</div> )}{!isLoadingData && !error && recentOrders.length === 0 && ( <p className="text-gray-500 text-sm text-center py-4">No recent orders found.</p> )}{!isLoadingData && !error && recentOrders.length > 0 && ( <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th><th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th><th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th><th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th><th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th><th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{recentOrders.map((order) => ( <tr key={order.id} className="hover:bg-gray-50 transition-colors"><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(order.createdAt)}</td><td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800" title={order.merchantReference}>{order.merchantReference.substring(0, 15)}...</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.customerName}</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center"><div className='inline-flex items-center space-x-1'><ShoppingBag className='h-4 w-4 text-gray-400'/><span>{order.itemCount ?? '?'}</span></div></td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">{formatPrice(order.totalAmount)}</td><td className="px-4 py-3 whitespace-nowrap text-sm text-center"><span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></td></tr> ))}</tbody></table></div> )}{!isLoadingData && !error && <div className="mt-4 text-right"><Link to="/admin/orders" className="text-sm text-teal-600 hover:text-teal-800 font-medium">View All Orders →</Link></div>}</div>
             <div className="mt-8 bg-white p-6 rounded-lg shadow-md opacity-60"><h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><Activity className="h-5 w-5 mr-2 text-gray-400"/> Recent Activity</h2><p className="text-gray-500 text-sm">Other recent updates will appear here...</p></div>
        </div>
    );
};

export default AdminDashboardPage;