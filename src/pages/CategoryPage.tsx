// src/pages/CategoryPage.tsx
import { useState, useEffect } from 'react'; // Keep React import if using React.FC (or remove if not strictly needed)
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';
import { Category, Product } from '../types'; // Import your types
import { Skeleton } from '../components/Skeleton'; // Assuming Skeleton component exists

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  // Separate loading states
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Consolidated error state

  // Fetch Category Info (Only depends on categoryId)
  useEffect(() => {
    const fetchCategoryInfo = async () => {
        if (!categoryId) {
             setIsCategoryLoading(false);
             setError("Category ID missing."); // Set error if no ID
             return;
        }
        setIsCategoryLoading(true);
        setError(null); // Clear previous errors
        setCategory(null);
        try {
            const response = await axios.get<Category>(`${API_BASE_URL}/categories/${categoryId}`);
            setCategory(response.data);
        } catch (err: any) {
            console.error("Failed to fetch category info:", err);
            const errorMsg = err.response?.status === 404 ? "Category not found." : "Failed to load category details.";
            setError(errorMsg);
            setCategory(null);
        } finally {
             setIsCategoryLoading(false);
        }
    };
    fetchCategoryInfo();
  }, [categoryId]);


  // Fetch Products (Depends on categoryId AND selectedSubcategory)
  useEffect(() => {
    // Only fetch products if we have a valid categoryId and category loading is done
    if (!categoryId || isCategoryLoading) {
        setIsProductsLoading(false); // Don't show product loading if category isn't ready
        return;
    }
    // If category fetch failed, don't try to fetch products
    if (!category && !isCategoryLoading) {
        setIsProductsLoading(false);
        setProducts([]); // Ensure products are empty
        return;
    }


    const fetchProducts = async () => {
      setIsProductsLoading(true);
      // setError(null); // Decide if filtering should clear general errors
      setProducts([]); // Clear previous products for this subcategory
      try {
        const params = new URLSearchParams();
        params.append('categoryId', categoryId);
        if (selectedSubcategory !== 'all') {
          params.append('subcategory', selectedSubcategory);
        }

        const response = await axios.get<Product[]>(`${API_BASE_URL}/products`, { params });
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load products."); // Overwrite previous errors if product fetch fails
        setProducts([]);
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, selectedSubcategory, category, isCategoryLoading]); // Re-run when these change


  // Click handler is now used
  const handleSubcategoryClick = (sub: string) => {
      setSelectedSubcategory(sub);
      // Set product loading true immediately for better UX feedback (optional)
      // setIsLoadingProducts(true);
  }

  // Combined loading check
  const isLoading = isCategoryLoading || isProductsLoading;


   // Handle case where category fetch finished but category wasn't found
   if (!category && !isCategoryLoading && categoryId) {
       return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            {/* Display the specific error if available */}
            <h2 className="text-2xl font-semibold text-red-700 mb-4">{error || "Category could not be loaded."}</h2>
            <Link to="/" className="text-teal-600 hover:text-teal-800 mt-4 inline-block">Go back home</Link>
          </div>
       );
   }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>{`${category?.name || (categoryId ? categoryId.replace('-', ' ') : 'Category')} | ClassyCollectionHubKE`}</title>
        <meta name="description" content={`Shop ${category?.name || 'our products'}. ${category?.description || ''}. Quality items available online in Kenya.`} />
      </Helmet>

      {/* Category Header - Show skeleton while category loads */}
      {isCategoryLoading ? (
         <Skeleton className="h-28 mb-8 rounded-lg" />
      ) : category ? (
         <div className="mb-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg shadow-sm">
           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
              {category.icon && <span className="text-4xl mr-3">{category.icon}</span>} {category.name}
           </h1>
           {category.description && <p className="text-gray-600">{category.description}</p>}
         </div>
      ) : null}


      {/* Subcategory Filter Tabs - Only show if category exists and finished loading */}
      {category && !isCategoryLoading && category.subcategories.length > 0 && (
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-3 border-b border-gray-200">
            {/* --- "All" Button --- */}
            <button
              onClick={() => handleSubcategoryClick('all')}
              disabled={isLoading} // Disable if category OR products are loading
              className={`px-4 py-2 text-sm font-medium rounded-t-md whitespace-nowrap transition-colors duration-200 ${
                selectedSubcategory === 'all'
                  ? 'border-b-2 border-teal-600 text-teal-600 font-semibold' // Make active bold
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              All
            </button>
             {/* --- Subcategory Buttons --- */}
            {category.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubcategoryClick(sub)} // *** onClick ADDED HERE ***
                disabled={isLoading} // Disable if category OR products are loading
                className={`px-4 py-2 text-sm font-medium rounded-t-md whitespace-nowrap transition-colors duration-200 ${
                  selectedSubcategory === sub
                    ? 'border-b-2 border-teal-600 text-teal-600 font-semibold' // Make active bold
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display for product loading errors */}
      {error && !isCategoryLoading && <p className="text-center text-red-600 mb-6">{error}</p>}

      {/* Loading Skeletons for Products */}
      {isProductsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
                 <Skeleton key={index} className="h-64 md:h-80 rounded-lg" /> // Adjusted height
             ))}
        </div>
      )}

      {/* Product Grid - Show only when products are not loading and there was no error */}
      {!isProductsLoading && !error && (
          products.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
               {products.map((product) => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
          ) : (
              // Show "No products" only if category finished loading successfully
              !isCategoryLoading && category && (
                   <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
                       No products found in this subcategory.
                   </div>
              )
          )
      )}
    </div>
  );
}