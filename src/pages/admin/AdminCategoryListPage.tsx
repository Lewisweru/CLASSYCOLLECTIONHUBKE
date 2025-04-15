// src/pages/admin/AdminCategoryListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarLoader } from 'react-spinners';
import adminApi from '../../lib/adminApi'; // Use adminApi for all calls here
import { Category } from '../../types';
// Removed direct axios import and API_BASE_URL constant

const AdminCategoryListPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setIsLoading(true); setError(null);
        try {
            // --- FIX: Use adminApi and provide full relative path ---
            const response = await adminApi.get<Category[]>('/api/categories');
            // --- End FIX ---
            setCategories(response.data);
        } catch (err: any) {
            console.error("Failed to fetch categories:", err);
            // Error toast is likely handled by the interceptor now
            if (!err.handled) { // Check if interceptor handled it (e.g., auth error)
                 const errorMsg = err.response?.data?.message || 'Failed to fetch categories.';
                 setError(errorMsg);
                 toast.error("Could not load categories."); // Fallback toast
            }
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = async (categoryId: string, categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete "${categoryName}"? This CANNOT be undone and might fail if products use it.`)) {
            const toastId = toast.loading(`Deleting ${categoryName}...`);
            try {
                // --- Ensure path starts with /api/admin/ ---
                await adminApi.delete(`/api/admin/categories/${categoryId}`);
                // --- End Ensure ---
                toast.success(`"${categoryName}" deleted successfully.`, { id: toastId });
                setCategories(prev => prev.filter(c => c.id !== categoryId));
            } catch (err: any) {
                console.error(`Failed to delete category ${categoryId}:`, err);
                if (!err.handled) {
                    const errorMsg = err.response?.data?.message || 'Failed to delete category.';
                    toast.error(errorMsg, { id: toastId });
                    setError(errorMsg);
                } else {
                     toast.dismiss(toastId); // Auth error handled by interceptor
                }
            }
        }
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-y-3">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Categories</h1>
                <Link
                    to="/admin/categories/new"
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium btn-click-effect"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add New Category
                </Link>
            </div>

            {isLoading && <div className="flex justify-center py-10"><BarLoader color="#14B8A6" /></div>}
            {error && !isLoading && (
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.length === 0 && ( <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">No categories found.</td></tr> )}
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        <div className="text-xs text-gray-500">{category.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xl">{category.icon || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {category.subcategories && category.subcategories.length > 0
                                            ? category.subcategories.join(', ')
                                            : <span className="italic text-gray-400">None</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link to={`/admin/categories/edit/${category.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center p-1 hover:bg-indigo-50 rounded" title="Edit"><Edit className="h-4 w-4" /></Link>
                                        <button onClick={() => handleDelete(category.id, category.name)} className="text-red-600 hover:text-red-900 inline-flex items-center p-1 hover:bg-red-50 rounded" title="Delete"><Trash2 className="h-4 w-4" /></button>
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

export default AdminCategoryListPage;