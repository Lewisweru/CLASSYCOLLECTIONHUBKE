// src/pages/admin/AdminOrderDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Removed unused useNavigate
import { AlertCircle, ChevronLeft } from 'lucide-react'; // Removed unused Edit, added missing toast import below
import { BarLoader } from 'react-spinners'; // Import BarLoader correctly
import toast from 'react-hot-toast'; // *** IMPORT react-hot-toast ***
import adminApi from '../../lib/adminApi';
// *** Import types needed. Define them in types.ts if they don't exist ***
import { Product, CategoryBasic } from '../../types'; // Product is likely needed for item.product

// *** Define Order and OrderItem types locally or preferably in types.ts ***
// If these aren't in types.ts, define them here based on backend structure
interface OrderItemLocal { // Example name
  id: string;
  quantity: number;
  price: number; // Price at time of order
  productId: string;
  product: Pick<Product, 'id' | 'name' | 'imageUrls' | 'subcategory'>; // Nested product info
}

interface OrderLocal { // Example name
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  deliveryOption: string;
  totalAmount: number;
  currency: string;
  status: string;
  merchantReference: string;
  orderTrackingId?: string | null;
  paymentMethod?: string | null;
  createdAt?: string;
  updatedAt?: string;
  items: OrderItemLocal[]; // Use the defined OrderItem type
}
// *** End Type Definitions ***


// Use the locally defined or imported types for state
const AdminOrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    // const navigate = useNavigate(); // Removed unused import
    const [order, setOrder] = useState<OrderLocal | null>(null); // Use OrderLocal type
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Order ID is missing.");
            setIsLoading(false);
            return;
        }
        const fetchOrderDetails = async () => {
            setIsLoading(true); setError(null);
            try {
                 // Use OrderLocal type for the expected response
                const response = await adminApi.get<OrderLocal>(`/api/admin/orders/${orderId}`);
                setOrder(response.data);
            } catch (err: any) {
                console.error(`Failed to fetch order details for ${orderId}:`, err);
                 if (!err.handled) {
                    setError(err.response?.status === 404 ? 'Order not found.' : (err.response?.data?.message || 'Failed to load order details.'));
                 }
                 setOrder(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    // --- Helper functions (remain the same) ---
    const formatPrice = (price: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 2 }).format(price / 100);
    const formatDate = (dateString?: string) => { if (!dateString) return 'N/A'; try { return new Date(dateString).toLocaleString('en-GB'); } catch (e) { return 'Invalid Date'; } };
    const getStatusColor = (status?: string): string => { /* ... same switch ... */ switch (status?.toUpperCase()) { case 'PAID': return 'bg-green-100 text-green-800'; case 'PENDING': return 'bg-yellow-100 text-yellow-800'; case 'SHIPPED': return 'bg-blue-100 text-blue-800'; case 'PROCESSING': return 'bg-purple-100 text-purple-800'; case 'DELIVERED': return 'bg-indigo-100 text-indigo-800'; case 'FAILED': case 'PAYMENT_FAILED': return 'bg-red-100 text-red-800'; case 'CANCELLED': return 'bg-gray-100 text-gray-700'; default: return 'bg-gray-100 text-gray-800'; } };

     // --- Status Update Logic ---
     const handleStatusUpdate = async (newStatus: string) => {
          if (!order || !orderId) return;
          // Use toast function correctly
          const toastId = toast.loading(`Updating status to ${newStatus}...`);
          try {
              // Use toast function correctly
              await adminApi.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
              setOrder(prev => prev ? { ...prev, status: newStatus.toUpperCase() } : null);
              // Use toast function correctly
              toast.success(`Order status updated to ${newStatus}`, { id: toastId });
          } catch (err: any) {
               console.error("Failed to update order status:", err);
               if (!err.handled) {
                    // Use toast function correctly
                   toast.error(err.response?.data?.message || 'Failed to update status.', { id: toastId });
               } else {
                    // Use toast function correctly
                    toast.dismiss(toastId);
               }
          }
      };
     // --- End Status Update ---

    if (isLoading) { return <div className="flex justify-center py-10"><BarLoader color="#14B8A6" /></div>; }
    if (error) { return ( <div className="max-w-4xl mx-auto p-6 md:p-8"> <Link to="/admin/orders" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"><ChevronLeft className="h-4 w-4 mr-1" /> Back to Orders</Link> <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert"><AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0"/><div><strong className="font-bold mr-2">Error:</strong>{error}</div></div></div> ); }
    if (!order) { return <div className="text-center p-10">Order data not available.</div>; }


    return (
        // --- (JSX structure remains the same, just ensure it uses the 'order' state variable correctly) ---
        <div>
            <Link to="/admin/orders" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"><ChevronLeft className="h-4 w-4 mr-1" /> Back to Orders</Link>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Order Details</h1>
            <p className="text-sm text-gray-500 mb-6">Reference: {order.merchantReference}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md space-y-4 h-fit">
                     <h2 className="text-lg font-semibold border-b pb-2 mb-3">Order Summary</h2>
                     <div className="text-sm space-y-1.5">
                         <p><strong>Status:</strong> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span></p>
                         <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                         <p><strong>Total Amount:</strong> <span className="font-semibold">{formatPrice(order.totalAmount)}</span></p>
                         <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
                         <p><strong>Tracking ID:</strong> {order.orderTrackingId || 'N/A'}</p>
                     </div>
                      <div className="pt-4 border-t">
                          <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                          <select id="orderStatus" value={order.status} onChange={(e) => handleStatusUpdate(e.target.value)} className="form-select text-sm py-1.5">
                              <option value="PENDING">Pending</option><option value="PAID">Paid</option><option value="PROCESSING">Processing</option><option value="SHIPPED">Shipped</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option><option value="FAILED">Failed</option><option value="PAYMENT_FAILED">Payment Failed</option><option value="REFUNDED">Refunded</option>
                          </select>
                      </div>
                 </div>
                 <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4">
                      <h2 className="text-lg font-semibold border-b pb-2 mb-3">Customer & Shipping</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p><strong>Name:</strong> {order.customerName}</p><p><strong>Email:</strong> {order.customerEmail}</p><p><strong>Phone:</strong> {order.customerPhone}</p><p><strong>City:</strong> {order.shippingCity}</p><p className="sm:col-span-2"><strong>Address:</strong> {order.shippingAddress}</p><p className="sm:col-span-2"><strong>Delivery:</strong> {order.deliveryOption}</p>
                      </div>
                 </div>
                 <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold border-b pb-2 mb-3">Items Ordered ({order.items.length})</h2>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4 border-b last:border-b-0 py-3">
                                <div className="flex items-center gap-3">
                                     <img src={item.product.imageUrls?.[0] || 'https://via.placeholder.com/64x64/e2e8f0/94a3b8?text=N/A'} alt={item.product.name} className="h-12 w-12 rounded object-cover bg-gray-100 flex-shrink-0"/>
                                     <div><Link to={`/product/${item.productId}`} target="_blank" className="text-sm font-medium text-gray-800 hover:text-teal-600">{item.product.name}</Link><p className="text-xs text-gray-500">{item.product.subcategory}</p></div>
                                </div>
                                <div className="text-sm text-right"><p>{formatPrice(item.price)} x {item.quantity}</p><p className="font-semibold">{formatPrice(item.price * item.quantity)}</p></div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage;