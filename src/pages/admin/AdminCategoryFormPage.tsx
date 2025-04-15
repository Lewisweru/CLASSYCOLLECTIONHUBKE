// src/pages/admin/AdminCategoryFormPage.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BarLoader } from 'react-spinners';
import { Save, ChevronLeft, AlertCircle, Plus, X } from 'lucide-react';
import adminApi from '../../lib/adminApi'; // Uses adminApi for PUT/POST
import apiClient from '../../lib/apiClient'; // Use apiClient for public GET
import { Category } from '../../types';
import { Skeleton } from '../../components/Skeleton';

interface AdminCategoryFormPageProps { mode: 'create' | 'edit'; }
interface CategoryFormData { id: string; name: string; icon: string; imageUrl: string; description: string; subcategories: string[]; }

const AdminCategoryFormPage: React.FC<AdminCategoryFormPageProps> = ({ mode }) => {
    const { categoryId } = useParams<{ categoryId?: string }>();
    const navigate = useNavigate();
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState<CategoryFormData>({ id: '', name: '', icon: '', imageUrl: '', description: '', subcategories: [], });
    const [newSubcategory, setNewSubcategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingInitialData, setIsFetchingInitialData] = useState(isEditMode);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode && categoryId) {
            setIsFetchingInitialData(true); setError(null);
            const fetchCategory = async () => {
                try {
                    // *** Use apiClient and full relative path ***
                    const response = await apiClient.get<Category>(`/api/categories/${categoryId}`);
                     // *** End Path Correction ***
                    const cat = response.data;
                    setFormData({ id: cat.id || '', name: cat.name || '', icon: cat.icon || '', imageUrl: cat.imageUrl || '', description: cat.description || '', subcategories: Array.isArray(cat.subcategories) ? cat.subcategories : [], });
                } catch (err: any) {
                    console.error("Failed to fetch category data:", err);
                    if (!err.handled) { setError(err.response?.data?.message || 'Failed to load category data.'); toast.error("Could not load category data."); }
                } finally { setIsFetchingInitialData(false); }
            };
            fetchCategory();
        } else { setIsFetchingInitialData(false); }
    }, [isEditMode, categoryId]);

    // --- (Input handlers remain the same) ---
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); setError(null); };
    const handleAddSubcategory = () => { const trimmedSub = newSubcategory.trim(); if (trimmedSub && !formData.subcategories.includes(trimmedSub)) { setFormData(prev => ({ ...prev, subcategories: [...prev.subcategories, trimmedSub] })); setNewSubcategory(''); setError(null); } else if (formData.subcategories.includes(trimmedSub)) { toast.error(`Subcategory "${trimmedSub}" already exists.`); } };
    const handleSubcategoryInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubcategory(); } };
    const handleRemoveSubcategory = (subToRemove: string) => { setFormData(prev => ({ ...prev, subcategories: prev.subcategories.filter(sub => sub !== subToRemove) })); setError(null); };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); setError(null); setIsLoading(true);
        const toastId = toast.loading(isEditMode ? 'Updating category...' : 'Creating category...');
        if (!formData.name) { const msg = 'Category Name is required.'; setError(msg); toast.error(msg, { id: toastId }); setIsLoading(false); return; }
        if (!isEditMode && formData.id && !/^[a-z0-9-]+$/.test(formData.id)) { const msg = 'Category ID can only contain lowercase letters, numbers, and hyphens.'; setError(msg); toast.error(msg, { id: toastId }); setIsLoading(false); return; }

        const categoryPayload = { ...( !isEditMode && formData.id && { id: formData.id } ), name: formData.name, icon: formData.icon || null, imageUrl: formData.imageUrl || null, description: formData.description || null, subcategories: formData.subcategories, };
        console.log("Submitting Payload:", categoryPayload);

        try {
            if (isEditMode && categoryId) {
                // *** Use adminApi and full relative path ***
                await adminApi.put(`/api/admin/categories/${categoryId}`, categoryPayload);
                 // *** End Path Correction ***
                toast.success('Category updated!', { id: toastId });
            } else {
                // *** Use adminApi and full relative path ***
                await adminApi.post('/api/admin/categories', categoryPayload);
                 // *** End Path Correction ***
                toast.success('Category created!', { id: toastId });
            }
            navigate('/admin/categories');
        } catch (err: any) {
            console.error("Failed to save category:", err);
            if (!err.handled) { const errorMsg = err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} category.`; setError(errorMsg); toast.error(errorMsg, { id: toastId }); }
            else { toast.dismiss(toastId); }
        } finally { setIsLoading(false); }
    };

    // --- (Render logic remains the same) ---
    if (isFetchingInitialData) { return ( <div className="p-6 md:p-8 space-y-4 animate-pulse"><Skeleton className="h-6 w-32 rounded mb-4" /><Skeleton className="h-8 w-1/2 rounded mb-6" /><div className="bg-white p-6 rounded-lg shadow-md space-y-5"><Skeleton className="h-10 w-full rounded" /><Skeleton className="h-10 w-full rounded" /><Skeleton className="h-24 w-full rounded" /><Skeleton className="h-20 w-full rounded" /></div></div> ); }
    if (error && !isLoading && isFetchingInitialData === false && formData.name === '') { return ( <div className="max-w-xl mx-auto p-6 md:p-8"><Link to="/admin/categories" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"><ChevronLeft className="h-4 w-4 mr-1" /> Back to Categories</Link><div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert"><AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0"/><div><strong className="font-bold mr-2">Error:</strong>{error}</div></div></div> ); }
    return ( <div> <Link to="/admin/categories" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"><ChevronLeft className="h-4 w-4 mr-1" /> Back to Categories</Link> <h1 className="text-2xl font-semibold text-gray-800 mb-6">{isEditMode ? `Edit Category: ${formData.name || '...'}` : 'Create New Category'}</h1> <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5"> {error && !isLoading && ( <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded relative text-sm flex items-center" role="alert"><AlertCircle className="h-4 w-4 mr-2 flex-shrink-0"/><div><strong className="font-bold mr-1">Error:</strong> {error}</div></div> )} {!isEditMode && ( <div><label htmlFor="id" className="form-label">Category ID (Optional)</label><input type="text" id="id" name="id" value={formData.id} onChange={handleInputChange} className="form-input" placeholder="Leave blank to auto-generate (e.g., home-living)"/><p className="text-xs text-gray-500 mt-1">Use lowercase letters, numbers, hyphens only.</p></div> )} <div><label htmlFor="name" className="form-label">Name *</label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="form-input" /></div> <div><label htmlFor="icon" className="form-label">Icon (Emoji)</label><input type="text" id="icon" name="icon" value={formData.icon} onChange={handleInputChange} className="form-input" maxLength={5} placeholder="e.g., 🛋️"/></div> <div><label htmlFor="imageUrl" className="form-label">Image URL</label><input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="form-input" placeholder="https://..."/>{formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded border"/>}</div> <div><label htmlFor="description" className="form-label">Description</label><textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="form-textarea"></textarea></div> <div> <label className="form-label">Subcategories</label> <div className="flex items-center gap-2 mb-2"> <input type="text" value={newSubcategory} onChange={(e) => setNewSubcategory(e.target.value)} onKeyDown={handleSubcategoryInputKeyDown} className="form-input flex-grow" placeholder="Enter name and press Enter or Add"/> <button type="button" onClick={handleAddSubcategory} className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium btn-click-effect"><Plus className="h-4 w-4 mr-1"/> Add</button> </div> <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border border-gray-200 rounded bg-gray-50"> {formData.subcategories.length === 0 && <span className="text-xs text-gray-400 italic">No subcategories added yet.</span>} {formData.subcategories.map((sub) => ( <span key={sub} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">{sub}<button type="button" onClick={() => handleRemoveSubcategory(sub)} className="ml-1.5 flex-shrink-0 text-teal-500 hover:text-teal-700 focus:outline-none" aria-label={`Remove ${sub}`}><X className="h-3 w-3" /></button></span> ))} </div> </div> <div className="flex justify-end space-x-3 pt-4"> <Link to="/admin/categories" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</Link> <button type="submit" disabled={isLoading} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed btn-click-effect">{isLoading ? <BarLoader color="#fff" height={4} width={30} /> : <Save className="h-4 w-4 mr-2 inline-block" />}{isEditMode ? 'Save Changes' : 'Create Category'}</button> </div> </form> </div> );
};

export default AdminCategoryFormPage;