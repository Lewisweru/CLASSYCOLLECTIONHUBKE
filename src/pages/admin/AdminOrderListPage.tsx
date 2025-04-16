// src/pages/admin/AdminOrderListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, AlertCircle, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarLoader } from 'react-spinners';
import adminApi from '../../lib/adminApi';
import { Order } from '../../types'; // Assuming Order type includes basic fields

// Interface for the fetched data structure from backend (includes pagination)
interface FetchOrdersResponse {
    orders: OrderSummary[];
    totalOrders: number;
    currentPage: number;
    totalPages: number;
}

// Simplified Order type for the list view
interface OrderSummary {
    id: string;
    merchantReference: string;
    customerName: string;
    totalAmount: number; // Smallest unit
    status: string;
    createdAt: string; // ISO Date string
    itemCount?: number;
}

const ITEMS_PER_PAGE = 15;

const AdminOrderListPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchOrders = async (page: number) => {
        setIsLoading(true); setError(null);
        try {
            const response = await adminApi.get<FetchOrdersResponse>('/api/admin/orders', {
                params: {
                    page: page,
                    limit: ITEMS_PER_PAGE
                }
            });
            setOrders(response.data.orders);
            setTotalOrders(response.data.totalOrders);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (err: any) {
            console.error("Failed to fetch orders:", err);
            if (!err.handled) {
                setError(err.response?.data?.message || 'Failed to fetch orders.');
                toast.error("Could not load orders.");
            }
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchOrders(currentPage); }, [currentPage]); // Refetch when page changes

    const formatPrice = (price: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(price / 100);
    const formatDate = (dateString: string) => { try { return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return 'Invalid Date'; } };

    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };

    const getStatusColor = (status: string): string => {
         switch (status?.toUpperCase()) {
             case 'PAID': return 'bg-green-100 text-green-800';
             case 'PENDING': return 'bg-yellow-100 text-yellow-800';
             case 'SHIPPED': return 'bg-blue-100 text-blue-800';
             case 'PROCESSING': return 'bg-purple-100 text-purple-800';
             case 'DELIVERED': return 'bg-indigo-100 text-indigo-800';
             case 'FAILED': case 'PAYMENT_FAILED': return 'bg-red-100 text-red-800';
             case 'CANCELLED': return 'bg-gray-100 text-gray-700';
             default: return 'bg-gray-100 text-gray-800';
         }
     };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Orders ({totalOrders})</h1>
                {/* Maybe add filtering options later */}
            </div>

            {isLoading && <div className="flex justify-center py-10"><BarLoader color="#14B8A6" /></div>}
            {error && !isLoading && ( <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert"><AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0"/><div><strong className="font-bold mr-2">Error:</strong>{error}</div></div> )}

            {!isLoading && !error && (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.length === 0 && ( <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">No orders found.</td></tr> )}
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-800" title={order.merchantReference}>{order.merchantReference}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{order.customerName}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{order.itemCount ?? '?'}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">{formatPrice(order.totalAmount)}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-center"><span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></td>
                                        <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center p-1 hover:bg-indigo-50 rounded" title="View Details"><Eye className="h-4 w-4" /></Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage <= 1 || isLoading}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </button>
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages || isLoading}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminOrderListPage;