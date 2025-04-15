// src/pages/admin/AdminProductListPage.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarLoader } from 'react-spinners';
import adminApi from '../../lib/adminApi'; // Uses adminApi
import { Product, Category } from '../../types';

const AdminProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
             try {
                 // *** Use full relative path starting with /api/admin/ ***
                 const response = await adminApi.get<Category[]>('/api/admin/categories');
                 // *** End Path Correction ***
                 setCategories(response.data);
             } catch (err: any) {
                  console.error("Failed fetch categories for filter:", err);
                  if (!err.handled) { toast.error("Could not load categories for filtering."); }
             }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!isLoading) setIsLoadingProducts(true);
            setError(null);
            try {
                const params: { categoryId?: string } = {};
                if (selectedCategoryId !== 'all') {
                    params.categoryId = selectedCategoryId;
                }
                // *** Use full relative path starting with /api/admin/ ***
                const response = await adminApi.get<Product[]>('/api/admin/products', { params });
                 // *** End Path Correction ***
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (err: any) {
                 console.error("Failed fetch products:", err);
                 if (!err.handled) {
                    setError(err.response?.data?.message || 'Failed to fetch products.');
                    toast.error("Could not load products.");
                 }
                 setProducts([]);
            } finally {
                 setIsLoading(false);
                 setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategoryId]); // Removed isLoading dependency here

     const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategoryId(e.target.value);
    };

    const handleDelete = async (productId: string, productName: string) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This cannot be undone.`)) {
            const toastId = toast.loading(`Deleting ${productName}...`);
            try {
                // *** Use full relative path starting with /api/admin/ ***
                await adminApi.delete(`/api/admin/products/${productId}`);
                 // *** End Path Correction ***
                toast.success(`"${productName}" deleted successfully.`, { id: toastId });
                setProducts(prev => prev.filter(p => p.id !== productId));
            } catch (err: any) {
                console.error(`Failed to delete product ${productId}:`, err);
                if (!err.handled) {
                     const errorMsg = err.response?.data?.message || 'Failed to delete product.';
                     toast.error(errorMsg, { id: toastId });
                     setError(errorMsg);
                } else { toast.dismiss(toastId); }
            }
        }
    };

    const formatPrice = (price: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price / 100);

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Products</h1>
                 <div className="flex items-center space-x-2">
                     <Filter className="h-5 w-5 text-gray-500" /><label htmlFor="categoryFilter" className="sr-only">Filter by Category</label>
                     <select id="categoryFilter" value={selectedCategoryId} onChange={handleCategoryChange} className="form-select py-1.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" disabled={categories.length === 0 || isLoading || isLoadingProducts}>
                         <option value="all">All Categories</option>
                         {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                     </select>
                 </div>
                <Link to="/admin/products/new" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium btn-click-effect"><Plus className="h-4 w-4 mr-2" /> Add New Product</Link>
            </div>
            {(isLoading || isLoadingProducts) && ( <div className="flex justify-center py-10"><BarLoader color="#14B8A6" height={4} width={100} /></div> )}
            {error && !(isLoading || isLoadingProducts) && ( <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert"><AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0"/><div><strong className="font-bold mr-2">Error:</strong>{error}</div></div> )}
            {!(isLoading || isLoadingProducts) && !error && ( <div className="bg-white shadow-md rounded-lg overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th><th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th><th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th><th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{products.length === 0 && ( <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">No products found{selectedCategoryId !== 'all' ? ' in this category' : ''}.</td></tr> )}{products.map((product) => ( <tr key={product.id} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-4 whitespace-nowrap"><img src={(Array.isArray(product.imageUrls) && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://via.placeholder.com/40x40/e2e8f0/94a3b8?text=N/A'} alt={product.name} className="h-10 w-10 rounded-md object-cover bg-gray-100"/></td><td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{product.name}</div><div className="text-xs text-gray-500">{product.subcategory}</div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name || 'N/A'}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatPrice(product.price)}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-center">{product.featured ? ( <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"> Yes </span> ) : ( <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600"> No </span> )}</td><td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"><Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center p-1 hover:bg-indigo-50 rounded" title="Edit"><Edit className="h-4 w-4" /></Link><button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-900 inline-flex items-center p-1 hover:bg-red-50 rounded" title="Delete"><Trash2 className="h-4 w-4" /></button></td></tr> ))}</tbody></table></div> )}
        </div>
    );
};

export default AdminProductListPage;