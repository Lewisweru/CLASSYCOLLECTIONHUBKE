// src/pages/admin/AdminCategoryListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarLoader } from 'react-spinners';
import adminApi from '../../lib/adminApi'; // Use adminApi for CUD, maybe public for GET
import axios from 'axios'; // Or use axios for public GET
import { Category } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const AdminCategoryListPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setIsLoading(true); setError(null);
        try {
            // Use public endpoint for fetching list
            const response = await axios.get<Category[]>(`${API_BASE_URL}/categories`);
            setCategories(response.data);
        } catch (err: any) {
            console.error("Failed to fetch categories:", err);
            setError(err.response?.data?.message || 'Failed to fetch categories.');
            toast.error("Could not load categories.");
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = async (categoryId: string, categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete "${categoryName}"? This CANNOT be undone and might fail if products use it.`)) {
            const toastId = toast.loading(`Deleting ${categoryName}...`);
            try {
                // Use admin endpoint for delete
                await adminApi.delete(`/admin/categories/${categoryId}`);
                toast.success(`"${categoryName}" deleted successfully.`, { id: toastId });
                setCategories(prev => prev.filter(c => c.id !== categoryId));
            } catch (err: any) {
                console.error(`Failed to delete category ${categoryId}:`, err);
                // Display specific error from backend if available
                const errorMsg = err.response?.data?.message || 'Failed to delete category.';
                toast.error(errorMsg, { id: toastId });
                setError(errorMsg);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Categories</h1>
                <Link to="/admin/categories/new" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 ...">
                    <Plus className="h-4 w-4 mr-2" /> Add New Category
                </Link>
            </div>

            {isLoading && <div className="flex justify-center py-10"><BarLoader color="#14B8A6" /></div>}
            {error && !isLoading && ( <div className="bg-red-50 ..."><AlertCircle/> ... {error}</div> )}

            {!isLoading && !error && (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 ...">Name</th>
                                <th scope="col" className="px-6 py-3 ...">Icon</th>
                                <th scope="col" className="px-6 py-3 ...">Subcategories</th>
                                <th scope="col" className="px-6 py-3 text-right ...">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.length === 0 && ( <tr><td colSpan={4} className="px-6 py-10 text-center ...">No categories found.</td></tr> )}
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        <div className="text-xs text-gray-500">{category.id}</div> {/* Show ID for reference */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xl">{category.icon || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {category.subcategories.length > 0
                                            ? category.subcategories.join(', ')
                                            : <span className="italic">None</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link to={`/admin/categories/edit/${category.id}`} className="text-indigo-600 hover:text-indigo-900 ..." title="Edit"><Edit className="h-4 w-4" /></Link>
                                        <button onClick={() => handleDelete(category.id, category.name)} className="text-red-600 hover:text-red-900 ..." title="Delete"><Trash2 className="h-4 w-4" /></button>
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