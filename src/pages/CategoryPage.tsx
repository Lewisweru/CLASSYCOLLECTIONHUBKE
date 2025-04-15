// src/pages/CategoryPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../lib/apiClient'; // Import apiClient
import ProductCard from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';
import { Category, Product } from '../types';
import { Skeleton } from '../components/Skeleton';

// Removed API_BASE_URL constant

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Unified error state

  useEffect(() => {
    const fetchCategoryInfo = async () => {
        if (!categoryId) {
             setIsCategoryLoading(false);
             setError("Category ID missing.");
             return;
        }
        setIsCategoryLoading(true);
        setError(null);
        setCategory(null);
        try {
            // *** Use apiClient and full relative path ***
            const response = await apiClient.get<Category>(`/api/categories/${categoryId}`);
            // *** End Path Correction ***
            setCategory(response.data);
        } catch (err: any) {
            console.error("Failed to fetch category info:", err);
            const errorMsg = err.response?.status === 404 ? "Category not found." : "Failed to load category details.";
            setError(errorMsg); // Set specific error
            setCategory(null);
            // Toast handled by interceptor
        } finally {
             setIsCategoryLoading(false);
        }
    };
    fetchCategoryInfo();
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId || isCategoryLoading) {
        setIsProductsLoading(false);
        return;
    }
    if (!category && !isCategoryLoading) {
        setIsProductsLoading(false);
        setProducts([]);
        return;
    }

    const fetchProducts = async () => {
      setIsProductsLoading(true);
      setProducts([]); // Clear previous products
      setError(null); // Clear previous errors when fetching products for a subcategory
      try {
        const params = new URLSearchParams();
        params.append('categoryId', categoryId);
        if (selectedSubcategory !== 'all') {
          params.append('subcategory', selectedSubcategory);
        }
        // *** Use apiClient and full relative path ***
        const response = await apiClient.get<Product[]>(`/api/products`, { params });
        // *** End Path Correction ***
        setProducts(response.data);
      } catch (err: any) { // Changed variable name to avoid conflict
        console.error("Failed to fetch products:", err);
        setError(err.response?.data?.message || "Could not load products."); // Set specific error
        setProducts([]);
        // Toast handled by interceptor
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, selectedSubcategory, category, isCategoryLoading]);

  const handleSubcategoryClick = (sub: string) => {
      setSelectedSubcategory(sub);
  };

  const isLoading = isCategoryLoading || isProductsLoading;

   if (!category && !isCategoryLoading && categoryId && error) { // Show error if category failed to load
       return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">{error}</h2>
            <Link to="/" className="text-teal-600 hover:text-teal-800 mt-4 inline-block">Go back home</Link>
          </div>
       );
   }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>{`${category?.name || (categoryId ? categoryId.replace(/-/g, ' ') : 'Category')} | ClassyCollectionHubKE`}</title>
        <meta name="description" content={`Shop ${category?.name || 'our products'}. ${category?.description || ''}. Quality items available online in Kenya.`} />
      </Helmet>

      {isCategoryLoading ? (
         <Skeleton className="h-28 mb-8 rounded-lg" />
      ) : category ? (
         <div className="mb-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg shadow-sm">
           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
              {category.icon && <span className="text-4xl mr-3">{category.icon}</span>} {category.name}
           </h1>
           {category.description && <p className="text-gray-600">{category.description}</p>}
         </div>
      ) : null /* Don't render header if category load failed */ }

      {category && !isCategoryLoading && category.subcategories.length > 0 && (
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-3 border-b border-gray-200">
            <button onClick={() => handleSubcategoryClick('all')} disabled={isLoading} className={`px-4 py-2 text-sm font-medium rounded-t-md whitespace-nowrap transition-colors duration-200 ${ selectedSubcategory === 'all' ? 'border-b-2 border-teal-600 text-teal-600 font-semibold' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent' } disabled:opacity-50 disabled:cursor-not-allowed`}>All</button>
            {category.subcategories.map((sub) => ( <button key={sub} onClick={() => handleSubcategoryClick(sub)} disabled={isLoading} className={`px-4 py-2 text-sm font-medium rounded-t-md whitespace-nowrap transition-colors duration-200 ${ selectedSubcategory === sub ? 'border-b-2 border-teal-600 text-teal-600 font-semibold' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent' } disabled:opacity-50 disabled:cursor-not-allowed`}>{sub}</button> ))}
          </div>
        </div>
      )}

      {/* Only show product-specific error if category loaded successfully */}
      {error && !isCategoryLoading && category && <p className="text-center text-red-600 mb-6">{error}</p>}

      {isProductsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, index) => ( <Skeleton key={index} className="h-64 md:h-80 rounded-lg" /> ))}
        </div>
      )}

      {!isProductsLoading && !error && (
          products.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
               {products.map((product) => ( <ProductCard key={product.id} product={product} /> ))}
             </div>
          ) : (
             // Show "No products" only if category finished loading successfully and no specific product error occurred
              !isCategoryLoading && category && ( <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow md:col-span-2 lg:col-span-3 xl:col-span-4">No products found in this subcategory.</div> )
          )
      )}
    </div>
  );
}