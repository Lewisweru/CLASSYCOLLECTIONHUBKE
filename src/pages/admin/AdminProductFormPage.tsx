// src/pages/admin/AdminProductFormPage.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BarLoader } from 'react-spinners';
import { Save, ChevronLeft, AlertCircle } from 'lucide-react';
import adminApi from '../../lib/adminApi';
import { Product, Category } from '../../types'; // Use your frontend types

interface AdminProductFormPageProps {
    mode: 'create' | 'edit';
}

interface ProductFormData {
    name: string;
    price: string;
    description: string;
    imageUrl: string;
    categoryId: string; // <-- Should always store the STRING ID
    subcategory: string;
    featured: boolean;
    rating: string;
    reviews: string;
}

const AdminProductFormPage: React.FC<AdminProductFormPageProps> = ({ mode }) => {
    const { productId } = useParams<{ productId?: string }>();
    const navigate = useNavigate();
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState<ProductFormData>({ /* ... initial state ... */
        name: '', price: '', description: '', imageUrl: '', categoryId: '',
        subcategory: '', featured: false, rating: '0', reviews: '0',
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false); // For form submission/initial load in edit
    const [isFetchingInitialData, setIsFetchingInitialData] = useState(true); // Separate state for initial data load
    const [error, setError] = useState<string | null>(null);

    // --- Fetch Categories (runs on mount) ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await adminApi.get<Category[]>('/categories');
                setCategories(response.data);
                // Set default category ONLY if creating and categories exist
                if (!isEditMode && response.data.length > 0 && !formData.categoryId) {
                    setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                toast.error("Could not load categories for dropdown.");
                // Consider setting an error state specific to categories if needed
            }
        };
        fetchCategories();
        // Intentionally not fetching product here, handled by separate effect
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode]); // Run only once essentially, unless mode changes (unlikely)


    // --- Fetch Product Data (only in edit mode) ---
    useEffect(() => {
        // Only run if in edit mode AND productId is present
        if (isEditMode && productId) {
            setIsFetchingInitialData(true);
            setError(null);
            const fetchProduct = async () => {
                try {
                    const response = await adminApi.get<Product>(`/products/${productId}`);
                    const product = response.data;
                    // Ensure product.category exists and has an id before setting
                    const fetchedCategoryId = typeof product.category === 'object' ? product.category.id : product.category;

                    setFormData({
                        name: product.name,
                        price: product.price.toString(),
                        description: product.description,
                        imageUrl: product.imageUrl,
                        categoryId: fetchedCategoryId || '', // Use fetched category ID
                        subcategory: product.subcategory,
                        featured: product.featured,
                        rating: product.rating.toString(),
                        reviews: product.reviews.toString(),
                    });
                } catch (err: any) {
                    console.error("Failed to fetch product data:", err);
                    setError(err.response?.data?.message || 'Failed to load product data.');
                    toast.error("Could not load product data.");
                } finally {
                    setIsFetchingInitialData(false);
                }
            };
            fetchProduct();
        } else {
            // If in create mode, we are done fetching initial data (just categories)
            setIsFetchingInitialData(false);
        }
    }, [isEditMode, productId]); // Dependency array is correct


    // --- Form Input Handler ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setError(null); // Clear error on input change

        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
             setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            // For select, e.target.value is directly the option's value (the ID string)
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    // --- Form Submit Handler ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous submit errors
        setIsLoading(true); // For submission process
        const toastId = toast.loading(isEditMode ? 'Updating product...' : 'Creating product...');

        // --- Validation ---
        if (!formData.name || !formData.price || !formData.description || !formData.imageUrl || !formData.categoryId || !formData.subcategory) {
            const errorMsg = 'Please fill in all required fields (Name, Price, Description, Image URL, Category, Subcategory).';
            setError(errorMsg); toast.error(errorMsg, { id: toastId }); setIsLoading(false); return;
        }
        const priceNum = parseInt(formData.price, 10); // Use parseInt for integer price
        const ratingNum = parseFloat(formData.rating);
        const reviewsNum = parseInt(formData.reviews, 10);
        if (isNaN(priceNum) || priceNum < 0 || isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5 || isNaN(reviewsNum) || reviewsNum < 0) {
            const errorMsg = 'Invalid number format/value for Price (>=0), Rating (0-5), or Reviews (>=0).';
            setError(errorMsg); toast.error(errorMsg, { id: toastId }); setIsLoading(false); return;
        }
        // --- End Validation ---

        // --- Construct Payload ---
        // Ensure categoryId is definitely a string here
        const productPayload = {
            name: formData.name,
            price: priceNum, // Send the number
            description: formData.description,
            imageUrl: formData.imageUrl,
            categoryId: formData.categoryId, // Should be the string ID from state
            subcategory: formData.subcategory,
            featured: formData.featured,
            rating: ratingNum,
            reviews: reviewsNum,
        };

        // --- DEBUGGING: Log the payload right before sending ---
        console.log('Submitting Product Payload:', productPayload);
        console.log('categoryId type:', typeof productPayload.categoryId, 'value:', productPayload.categoryId);
        // --- End Debugging ---

        try {
            if (isEditMode && productId) {
                // PUT request for editing
                await adminApi.put(`/products/${productId}`, productPayload);
                toast.success('Product updated successfully!', { id: toastId });
            } else {
                // POST request for creating
                await adminApi.post('/products', productPayload);
                toast.success('Product created successfully!', { id: toastId });
            }
            navigate('/admin/products'); // Go back to list after success

        } catch (err: any) {
            console.error("Failed to save product:", err);
            // Log the detailed error response if available
            console.error("Error Response:", err.response?.data);
            const errorMsg = err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} product. Check console for details.`;
            setError(errorMsg); // Display error message on the form
            toast.error(errorMsg, { id: toastId });
        } finally {
            setIsLoading(false); // Finish submission loading state
        }
    };

    // --- Render Loading/Error for Initial Data ---
    if (isFetchingInitialData) {
         return ( /* ... Skeleton or Loader ... */
             <div className="flex justify-center py-10">
                  <BarLoader color="#14B8A6" height={4} width={100} />
              </div>
         );
    }
    // Show error if initial product fetch failed in edit mode
     if (error && isEditMode && !isLoading) { // Use initial load error state
          return ( /* ... Error UI ... */
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold mr-2">Error:</strong>
                  <span className="block sm:inline">{error}</span>
                   <Link to="/admin/products" className="block mt-4 text-sm text-teal-600 hover:text-teal-800"> ← Back to Product List </Link>
              </div>
          );
     }

    // --- Render Form ---
    return (
        <div>
            <Link to="/admin/products" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Products
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                {isEditMode ? 'Edit Product' : 'Create New Product'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5">
                {/* Display Submission Errors */}
                {error && !isLoading && ( // Only show submit errors when not loading
                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded relative text-sm flex items-center" role="alert">
                         <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0"/>
                         <div><strong className="font-bold mr-1">Error:</strong> {error}</div>
                     </div>
                )}

                {/* Form Fields */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="form-input" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (Smallest Unit, e.g., 2499) *</label>
                        {/* Use text type to avoid browser number input issues, validate as number */}
                        <input type="text" inputMode="numeric" pattern="[0-9]*" id="price" name="price" value={formData.price} onChange={handleInputChange} required className="form-input" />
                    </div>
                     <div>
                         <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                         <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} required className="form-select disabled:bg-gray-100" disabled={categories.length === 0}>
                             <option value="" disabled={categories.length > 0}>
                                 {categories.length === 0 ? 'Loading Categories...' : 'Select Category'}
                             </option>
                             {categories.map(cat => (
                                 <option key={cat.id} value={cat.id}>{cat.name}</option>
                             ))}
                         </select>
                     </div>
                </div>

                 <div>
                     <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">Subcategory *</label>
                     <input type="text" id="subcategory" name="subcategory" value={formData.subcategory} onChange={handleInputChange} required className="form-input" />
                 </div>

                 <div>
                     <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                     <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={4} className="form-textarea"></textarea>
                 </div>

                 <div>
                     <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                     <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required className="form-input" placeholder="https://..."/>
                     {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded border"/>}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0.0-5.0)</label>
                        <input type="text" inputMode="decimal" id="rating" name="rating" value={formData.rating} onChange={handleInputChange} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="reviews" className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
                        <input type="text" inputMode="numeric" pattern="[0-9]*" id="reviews" name="reviews" value={formData.reviews} onChange={handleInputChange} className="form-input" />
                    </div>
                     <div className="flex items-center pt-6">
                         <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="form-checkbox" />
                         <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">Featured Product</label>
                     </div>
                 </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Link to="/admin/products" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                         Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed btn-click-effect"
                    >
                       {isLoading ? <BarLoader color="#fff" height={4} width={30} /> : <Save className="h-4 w-4 mr-2 inline-block" />}
                        {isEditMode ? 'Save Changes' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductFormPage;