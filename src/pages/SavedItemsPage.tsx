// src/pages/SavedItemsPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Use the public API client for this public page feature
import apiClient from '../lib/apiClient'; // Corrected import
import { useSavedItemsStore } from '../store/savedItemsStore';
import ProductCard from '../components/ProductCard';
import { HeartOff } from 'lucide-react';
import { Product } from '../types';
import { Skeleton } from '../components/Skeleton';

// No need for API_BASE_URL here if using apiClient

export default function SavedItemsPage() {
  const { savedItemIds } = useSavedItemsStore(); // Get the list of IDs
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (savedItemIds.length === 0) {
      setSavedProducts([]);
      setIsLoading(false);
      return; // No need to fetch if no items are saved
    }

    const fetchSavedProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- Use the new batch endpoint ---
        const response = await apiClient.get<Product[]>('/products/batch', {
            params: {
                ids: savedItemIds.join(',') // Send IDs as comma-separated string
            }
        });
        // Ensure the response data is an array before setting state
        setSavedProducts(Array.isArray(response.data) ? response.data : []);

      } catch (err: any) {
        console.error("Failed to fetch saved products:", err);
        const errorMsg = err.response?.data?.message || 'Could not load saved items details.';
        setError(errorMsg);
        setSavedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedProducts();
  }, [savedItemIds]); // Refetch when the list of saved IDs changes

  // Rest of the component remains the same...
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Items ({savedItemIds.length})</h1>

      {isLoading && (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: savedItemIds.length || 4 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
              ))}
          </div>
      )}

       {error && !isLoading && <p className="text-center text-red-600 my-8">{error}</p>}

      {!isLoading && !error && savedProducts.length === 0 && savedItemIds.length > 0 ? (
           // This case handles when savedItemIds exist but fetching failed or returned empty
           <div className="text-center py-12 bg-white rounded-lg shadow">
               <HeartOff className="h-16 w-16 mx-auto text-gray-400 mb-4" />
               <p className="text-xl text-gray-600 mb-2">Could not load your saved items.</p>
               <p className="text-gray-500 mb-6">Please try again later or contact support.</p>
               <Link to="/" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"> Continue Shopping </Link>
           </div>
       ) : null}

      {!isLoading && !error && savedProducts.length === 0 && savedItemIds.length === 0 ? (
        // This case handles when there are genuinely no saved items
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <HeartOff className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 mb-2">You haven't saved any items yet.</p>
          <p className="text-gray-500 mb-6">Click the heart icon on products you like to save them here.</p>
          <Link to="/" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"> Continue Shopping </Link>
        </div>
      ) : null}

      {!isLoading && !error && savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}