// src/pages/SearchPage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { SearchX } from 'lucide-react';
import { Product } from '../types';
import { Skeleton } from '../components/Skeleton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // Keep original case for display
  const searchQuery = query.trim().toLowerCase(); // Use trimmed lowercase for searching

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Initially false, true only during fetch
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]); // Clear results if query is empty
      setIsLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<Product[]>(`${API_BASE_URL}/products`, {
          params: { search: searchQuery } // Pass search query to backend
        });
        setSearchResults(response.data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setError("Could not load search results.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Optional: Add debounce if you want search-as-you-type later
    fetchSearchResults();

  }, [searchQuery]); // Refetch when the search query changes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {query ? ( // Display based on original query param presence
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Search results for: <span className="text-teal-600">"{query}"</span>
          </h1>

          {/* Loading State */}
          {isLoading && (
             <>
                <p className="text-gray-600 mb-8">Searching...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                     {Array.from({ length: 8 }).map((_, index) => (
                         <Skeleton key={index} className="aspect-square rounded-lg" />
                     ))}
                 </div>
             </>
          )}

          {/* Error State */}
          {error && !isLoading && <p className="text-center text-red-600 my-8">{error}</p>}

          {/* Results Display */}
          {!isLoading && !error && (
            <>
                <p className="text-gray-600 mb-8">({searchResults.length} items found)</p>
                {searchResults.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <SearchX className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600 mb-2">No products found matching your search.</p>
                        <p className="text-gray-500 mb-6">Try searching for a different term or browse our categories.</p>
                        <Link to="/" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"> Back to Home </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {searchResults.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    </div>
                )}
            </>
          )}
        </>
      ) : (
        <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-gray-700">Please enter a search term in the bar above.</h1>
            <Link to="/" className="text-teal-600 hover:text-teal-800 mt-4 inline-block">Go back home</Link>
        </div>
      )}
    </div>
  );
}