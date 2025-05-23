import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import apiClient from '../lib/apiClient'; // Import apiClient
import { Skeleton } from './Skeleton';

// Removed API_BASE_URL and direct axios import

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // *** Use apiClient and full relative path ***
        const response = await apiClient.get<Product[]>('/api/products?featured=true');
        // *** End Path Correction ***
        setFeaturedProducts(response.data);
      } catch (err: any) {
        console.error("Failed to fetch featured products:", err);
        if (!err.handled) {
            setError(err.response?.data?.message || "Could not load featured products.");
            // Toast potentially handled by interceptor
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Deals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products at unbeatable prices.
          </p>
        </div>

         {error && !isLoading && <p className="text-center text-red-600 mb-6">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
             Array.from({ length: 3 }).map((_, index) => ( <Skeleton key={index} className="aspect-square rounded-lg" /> ))
          ) : featuredProducts.length > 0 ? (
             featuredProducts.map((product) => ( <ProductCard key={product.id} product={product} /> ))
          ) : (
              <p className="text-center text-gray-500 sm:col-span-2 lg:col-span-3">No featured products available.</p>
          )}
        </div>
      </div>
    </section>
  );
}
