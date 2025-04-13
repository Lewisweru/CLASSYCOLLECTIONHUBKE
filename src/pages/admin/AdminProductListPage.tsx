// src/pages/admin/AdminProductListPage.tsx
import React, { useState, useEffect } from 'react'; // Keep React import if using React.FC
import { Link } from 'react-router-dom';
// Removed AlertCircle from here initially, will add back if used
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react'; // Keep needed icons, ADD AlertCircle back
import toast from 'react-hot-toast';
import { BarLoader } from 'react-spinners';
import adminApi from '../../lib/adminApi';
// Remove unused Category import, keep Product
import { Product } from '../../types'; // Use the main Product type directly

// No longer need ProductWithCategory if Product type includes category: {id, name}
// interface ProductWithCategory extends Product {
//     category: { name: string }; // Backend now sends { id, name } matching Product type's CategoryBasic
// }

const AdminProductListPage: React.FC = () => {
    // Use the main Product type now
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Expect the API to return data matching the Product[] type
            const response = await adminApi.get<Product[]>('/products');
            setProducts(response.data);
        } catch (err: any) {
            console.error("Failed to fetch products:", err);
            setError(err.response?.data?.message || 'Failed to fetch products. Is the backend running?');
            toast.error("Could not load products.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId: string, productName: string) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This cannot be undone.`)) {
            const toastId = toast.loading(`Deleting ${productName}...`);
            try {
                await adminApi.delete(`/products/${productId}`);
                toast.success(`"${productName}" deleted successfully.`, { id: toastId });
                setProducts(prev => prev.filter(p => p.id !== productId));
            } catch (err: any) {
                console.error(`Failed to delete product ${productId}:`, err);
                const errorMsg = err.response?.data?.message || 'Failed to delete product.';
                toast.error(errorMsg, { id: toastId });
                setError(errorMsg);
            }
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Products</h1>
                <Link
                    to="/admin/products/new"
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium btn-click-effect"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                </Link>
            </div>

            {isLoading && (
                <div className="flex justify-center py-10">
                    <BarLoader color="#14B8A6" height={4} width={100} />
                </div>
            )}

            {error && !isLoading && (
                 // Use AlertCircle icon here
                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
                     <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0"/>
                     <div><strong className="font-bold mr-2">Error:</strong>{error}</div>
                 </div>
            )}

            {!isLoading && !error && (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        <div className="text-xs text-gray-500">{product.subcategory}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {/* Access category name safely */}
                                        {product.category?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {product.featured ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"> Yes </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600"> No </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit">
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminProductListPage;