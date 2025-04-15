// src/pages/SearchPage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../lib/apiClient'; // Import apiClient
import ProductCard from '../components/ProductCard';
import { SearchX } from 'lucide-react';
import { Product } from '../types';
import { Skeleton } from '../components/Skeleton';

// Removed API_BASE_URL and direct axios import

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const searchQuery = query.trim().toLowerCase();

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
         // *** Use apiClient and full relative path ***
        const response = await apiClient.get<Product[]>('/api/products', {
          params: { search: searchQuery }
        });
         // *** End Path Correction ***
        setSearchResults(response.data);
      } catch (err: any) {
        console.error("Failed to fetch search results:", err);
        setError(err.response?.data?.message || "Could not load search results.");
        setSearchResults([]);
         // Toast handled by interceptor
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();

  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {query ? (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search results for: <span className="text-teal-600">"{query}"</span></h1>
          {isLoading && ( <> <p className="text-gray-600 mb-8">Searching...</p> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">{Array.from({ length: 8 }).map((_, index) => ( <Skeleton key={index} className="aspect-square rounded-lg" /> ))}</div> </> )}
          {error && !isLoading && <p className="text-center text-red-600 my-8">{error}</p>}
          {!isLoading && !error && (
            <>
                <p className="text-gray-600 mb-8">({searchResults.length} items found)</p>
                {searchResults.length === 0 ? ( <div className="text-center py-12 bg-white rounded-lg shadow"><SearchX className="h-16 w-16 mx-auto text-gray-400 mb-4" /><p className="text-xl text-gray-600 mb-2">No products found matching your search.</p><p className="text-gray-500 mb-6">Try searching for a different term or browse our categories.</p><Link to="/" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"> Back to Home </Link></div> )
                 : ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">{searchResults.map((product) => ( <ProductCard key={product.id} product={product} /> ))}</div> )}
            </>
          )}
        </>
      ) : ( <div className="text-center py-12"><h1 className="text-2xl font-semibold text-gray-700">Please enter a search term in the bar above.</h1><Link to="/" className="text-teal-600 hover:text-teal-800 mt-4 inline-block">Go back home</Link></div> )}
    </div>
  );
}