// src/pages/admin/AdminProductFormPage.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BarLoader } from 'react-spinners';
import { Save, ChevronLeft, AlertCircle, PlusCircle, Trash2 } from 'lucide-react';
import adminApi from '../../lib/adminApi'; // Uses adminApi
import apiClient from '../../lib/apiClient'; // Use apiClient for public GETs
import { Product as ProductType, Category } from '../../types';
import { z } from 'zod';

interface AdminProductFormPageProps { mode: 'create' | 'edit'; }

interface ProductFormData {
    name: string; price: string; description: string; imageUrls: string[];
    categoryId: string; subcategory: string; featured: boolean; rating: string; reviews: string;
}

const MAX_IMAGES = 5;

const productFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    price: z.string().regex(/^\d+$/, "Price must be a whole number").min(1, { message: "Price is required" }).transform(Number),
    description: z.string().min(1, { message: "Description is required" }),
    imageUrls: z.array(z.string().url({ message: "Each image URL must be valid" }).min(1, { message: "Image URL cannot be empty" }))
                  .min(1, { message: "At least one image URL is required" })
                  .max(MAX_IMAGES, { message: `A maximum of ${MAX_IMAGES} image URLs are allowed` }),
    categoryId: z.string().min(1, { message: "Category is required" }),
    subcategory: z.string().min(1, { message: "Subcategory is required" }),
    featured: z.boolean(),
    rating: z.string().regex(/^(?:[0-4](\.\d{1,2})?|5(\.0{1,2})?)$/, "Rating must be between 0.0 and 5.0").transform(Number),
    reviews: z.string().regex(/^\d+$/, "Reviews must be a non-negative whole number")
              .min(1, { message: "Reviews count is required"})
              .transform(Number)
});

const AdminProductFormPage: React.FC<AdminProductFormPageProps> = ({ mode }) => {
    const { productId } = useParams<{ productId?: string }>();
    const navigate = useNavigate();
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState<ProductFormData>({
        name: '', price: '', description: '', imageUrls: [''], categoryId: '',
        subcategory: '', featured: false, rating: '0.0', reviews: '0',
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingInitialData, setIsFetchingInitialData] = useState(isEditMode);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData | '_errors', string | string[] | undefined>>>({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // *** Use apiClient and full relative path ***
                const response = await apiClient.get<Category[]>('/api/categories');
                 // *** End Path Correction ***
                setCategories(response.data);
                if (!isEditMode && response.data.length > 0 && !formData.categoryId) {
                    setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
                }
            } catch (err: any) {
                 console.error("Failed fetch categories for form:", err);
                 if (!err.handled) toast.error("Could not load categories.");
            }
        };
        fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode]);

    useEffect(() => {
        if (isEditMode && productId) {
            setIsFetchingInitialData(true); setError(null); setFormErrors({});
            const fetchProduct = async () => {
                 try {
                     // *** Use apiClient and full relative path ***
                    const response = await apiClient.get<ProductType>(`/api/products/${productId}`);
                     // *** End Path Correction ***
                    const product = response.data;
                    const fetchedCategoryId = typeof product.category === 'object' ? product.category.id : product.category;
                    setFormData({
                        name: product.name, price: product.price.toString(), description: product.description,
                        imageUrls: Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls : [''],
                        categoryId: fetchedCategoryId || '', subcategory: product.subcategory, featured: product.featured,
                        rating: product.rating.toString(), reviews: product.reviews.toString(),
                    });
                } catch (err: any) {
                     console.error("Failed fetch product:", err);
                     if (!err.handled) {
                         setError(err.response?.data?.message || 'Failed load product.');
                         toast.error("Could not load product data.");
                     }
                } finally { setIsFetchingInitialData(false); }
            };
            fetchProduct();
        } else {
            setIsFetchingInitialData(false);
        }
    }, [isEditMode, productId]);

    // --- (Input handlers remain the same) ---
    const handleImageUrlChange = (index: number, value: string) => { const newImageUrls = [...formData.imageUrls]; newImageUrls[index] = value; setFormData(prev => ({ ...prev, imageUrls: newImageUrls })); setFormErrors(prev => ({ ...prev, imageUrls: undefined, _errors: undefined })); setError(null); };
    const addImageUrlInput = () => { if (formData.imageUrls.length < MAX_IMAGES) { setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] })); } else { toast.error(`Maximum of ${MAX_IMAGES} images allowed.`); } };
    const removeImageUrlInput = (index: number) => { if (formData.imageUrls.length > 1) { const newImageUrls = formData.imageUrls.filter((_, i) => i !== index); setFormData(prev => ({ ...prev, imageUrls: newImageUrls })); setFormErrors(prev => ({ ...prev, imageUrls: undefined, _errors: undefined })); } else { toast.error("At least one image URL is required."); } };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { const { name, value, type } = e.target; setError(null); setFormErrors(prev => ({...prev, [name]: undefined })); if (type === 'checkbox') { setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked })); } else { setFormData(prev => ({ ...prev, [name]: value })); } };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null); setIsLoading(true); setFormErrors({});
        const toastId = toast.loading(isEditMode ? 'Updating...' : 'Creating...');

        const dataToValidate = { ...formData, imageUrls: formData.imageUrls.filter(url => url.trim() !== '') };
        const validationResult = productFormSchema.safeParse(dataToValidate);

        if (!validationResult.success) { /* ... validation error handling ... */
            const flatErrors = validationResult.error.flatten(); const formattedErrors: typeof formErrors = {}; Object.entries(flatErrors.fieldErrors).forEach(([key, value]) => { if(value) formattedErrors[key as keyof ProductFormData] = value; }); if (flatErrors.formErrors.length > 0) formattedErrors._errors = flatErrors.formErrors; console.log("Validation Errors:", formattedErrors); setFormErrors(formattedErrors); setError("Please fix the errors highlighted below."); toast.error("Validation failed. Check form.", { id: toastId }); setIsLoading(false); return;
        }

        const productPayload = validationResult.data;
        console.log('Submitting Payload:', productPayload);

        try {
            if (isEditMode && productId) {
                 // *** Use full relative path starting with /api/admin/ ***
                await adminApi.put(`/api/admin/products/${productId}`, productPayload);
                 // *** End Path Correction ***
                toast.success('Product updated!', { id: toastId });
            } else {
                 // *** Use full relative path starting with /api/admin/ ***
                await adminApi.post('/api/admin/products', productPayload);
                 // *** End Path Correction ***
                toast.success('Product created!', { id: toastId });
            }
            navigate('/admin/products');
        } catch (err: any) {
            console.error("Failed save product:", err);
             if (!err.handled) {
                 const errorMsg = err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} product.`;
                 setError(errorMsg);
                 toast.error(errorMsg, { id: toastId });
             } else { toast.dismiss(toastId); }
        } finally { setIsLoading(false); }
    };

    // --- (Render logic remains the same) ---
    if (isFetchingInitialData) { return <div className="flex justify-center py-10"><BarLoader color="#14B8A6" height={4} width={100} /></div>; }
    if (error && isEditMode && formData.name === '') { return ( <div className="max-w-xl mx-auto p-6 md:p-8"><Link to="/admin/products" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"><ChevronLeft className="h-4 w-4 mr-1" /> Back to Products</Link><div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert"><AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0"/><div><strong className="font-bold mr-2">Error:</strong>{error}</div></div></div> ); }
    return ( <div> <Link to="/admin/products" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"><ChevronLeft className="h-4 w-4 mr-1" /> Back to Products</Link> <h1 className="text-2xl font-semibold text-gray-800 mb-6">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1> <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5"> {error && !isLoading && ( <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm flex items-center" role="alert"><AlertCircle className="h-4 w-4 mr-2 flex-shrink-0"/><div><strong className="font-bold mr-1">Error:</strong> {error}</div></div> )} <div><label htmlFor="name" className="form-label">Name *</label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className={`form-input ${formErrors.name ? 'border-red-500' : ''}`} />{formErrors.name && typeof formErrors.name === 'string' && <p className="form-error">{formErrors.name}</p>}</div> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div><label htmlFor="price" className="form-label">Price (Smallest Unit, e.g., 2499) *</label><input type="text" inputMode="numeric" pattern="[0-9]*" id="price" name="price" value={formData.price} onChange={handleInputChange} required className={`form-input ${formErrors.price ? 'border-red-500' : ''}`} />{formErrors.price && typeof formErrors.price === 'string' && <p className="form-error">{formErrors.price}</p>}</div> <div><label htmlFor="categoryId" className="form-label">Category *</label><select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} required className={`form-select disabled:bg-gray-100 ${formErrors.categoryId ? 'border-red-500' : ''}`} disabled={categories.length === 0}><option value="" disabled>{categories.length === 0 ? 'Loading...' : 'Select Category'}</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select>{formErrors.categoryId && typeof formErrors.categoryId === 'string' && <p className="form-error">{formErrors.categoryId}</p>}</div> </div> <div><label htmlFor="subcategory" className="form-label">Subcategory *</label><input type="text" id="subcategory" name="subcategory" value={formData.subcategory} onChange={handleInputChange} required className={`form-input ${formErrors.subcategory ? 'border-red-500' : ''}`} />{formErrors.subcategory && typeof formErrors.subcategory === 'string' && <p className="form-error">{formErrors.subcategory}</p>}</div> <div><label htmlFor="description" className="form-label">Description *</label><textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={4} className={`form-textarea ${formErrors.description ? 'border-red-500' : ''}`}></textarea>{formErrors.description && typeof formErrors.description === 'string' && <p className="form-error">{formErrors.description}</p>}</div> <div> <label className="form-label">Image URLs (Min 1, Max {MAX_IMAGES}) *</label> {Array.isArray(formErrors._errors) && formErrors._errors.length > 0 && ( <p className="form-error mb-1">{formErrors._errors.join('. ')}</p> )} {typeof formErrors.imageUrls === 'string' && ( <p className="form-error mb-1">{formErrors.imageUrls}</p> )} <div className="space-y-2"> {formData.imageUrls.map((url, index) => ( <div key={index}> <div className="flex items-center gap-2"> <input type="url" value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} required={index === 0} className={`form-input flex-grow ${Array.isArray(formErrors.imageUrls) && formErrors.imageUrls[index] ? 'border-red-500' : ''}`} placeholder={`https://... Image ${index + 1}`}/> <button type="button" onClick={() => removeImageUrlInput(index)} disabled={formData.imageUrls.length <= 1} className="p-2 text-red-500 hover:bg-red-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Remove Image URL" ><Trash2 className="h-4 w-4" /></button> </div> {Array.isArray(formErrors.imageUrls) && formErrors.imageUrls[index] && ( <p className="form-error text-xs ml-1 mt-1">{formErrors.imageUrls[index]}</p> )} </div> ))} {formData.imageUrls.length < MAX_IMAGES && ( <button type="button" onClick={addImageUrlInput} className="mt-2 inline-flex items-center px-3 py-1 border border-dashed border-gray-400 rounded text-sm font-medium text-gray-600 hover:bg-gray-50" ><PlusCircle className="h-4 w-4 mr-1" /> Add Another Image URL</button> )} </div> <div className="mt-3 flex flex-wrap gap-2"> {formData.imageUrls.filter(url => url?.trim()).map((url, index) => ( <img key={`preview-${index}`} src={url} alt={`Preview ${index + 1}`} className="h-16 w-16 object-cover rounded border" onError={(e) => (e.target as HTMLImageElement).style.display='none'} onLoad={(e) => (e.target as HTMLImageElement).style.display='inline-block'}/> ))} </div> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div><label htmlFor="rating" className="form-label">Rating (0.0-5.0)</label><input type="text" inputMode="decimal" id="rating" name="rating" value={formData.rating} onChange={handleInputChange} className={`form-input ${formErrors.rating ? 'border-red-500' : ''}`} />{formErrors.rating && typeof formErrors.rating === 'string' && <p className="form-error">{formErrors.rating}</p>}</div> <div><label htmlFor="reviews" className="form-label">Reviews Count *</label><input type="text" inputMode="numeric" pattern="[0-9]*" id="reviews" name="reviews" value={formData.reviews} onChange={handleInputChange} required className={`form-input ${formErrors.reviews ? 'border-red-500' : ''}`} />{formErrors.reviews && typeof formErrors.reviews === 'string' && <p className="form-error">{formErrors.reviews}</p>}</div> <div className="flex items-center pt-6"><input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="form-checkbox" /><label htmlFor="featured" className="ml-2 block text-sm text-gray-900">Featured Product</label></div> </div> <div className="flex justify-end space-x-3 pt-4"> <Link to="/admin/products" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</Link> <button type="submit" disabled={isLoading} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed btn-click-effect" >{isLoading ? <BarLoader color="#fff" height={4} width={30} /> : <Save className="h-4 w-4 mr-2 inline-block" />}{isEditMode ? 'Save Changes' : 'Create Product'}</button> </div> </form> </div> );
};

export default AdminProductFormPage;