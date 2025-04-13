// src/pages/SavedItemsPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSavedItemsStore } from '../store/savedItemsStore';
import ProductCard from '../components/ProductCard';
import { HeartOff } from 'lucide-react';
import { Product } from '../types';
import { Skeleton } from '../components/Skeleton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

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
        // Option 1: Fetch products one by one (simpler, less efficient for many items)
        // const productPromises = savedItemIds.map(id =>
        //   axios.get<Product>(`${API_BASE_URL}/products/${id}`)
        // );
        // const responses = await Promise.allSettled(productPromises);
        // const fetchedProducts = responses
        //   .filter(result => result.status === 'fulfilled')
        //   .map(result => (result as PromiseFulfilledResult<axios.AxiosResponse<Product>>).value.data);
        // setSavedProducts(fetchedProducts);

        // Option 2: Fetch all products and filter (simpler for now, inefficient for large catalogs)
        // In a real app, backend should support GET /api/products?ids=id1,id2,id3
        const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
        const allProducts = response.data;
        setSavedProducts(allProducts.filter(p => savedItemIds.includes(p.id)));

      } catch (err) {
        console.error("Failed to fetch saved products:", err);
        setError("Could not load saved items details.");
        setSavedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedProducts();
  }, [savedItemIds]); // Refetch when the list of saved IDs changes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Items ({savedItemIds.length})</h1>

      {isLoading && (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: savedItemIds.length || 4 }).map((_, index) => ( // Show skeletons based on saved count or default
                  <Skeleton key={index} className="aspect-square rounded-lg" />
              ))}
          </div>
      )}

       {error && !isLoading && <p className="text-center text-red-600 my-8">{error}</p>}

      {!isLoading && !error && savedProducts.length === 0 ? (
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