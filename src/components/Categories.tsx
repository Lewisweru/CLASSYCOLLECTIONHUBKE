// src/components/Categories.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../lib/apiClient'; // *** IMPORT apiClient ***
import { Category } from '../types';
import { Skeleton } from './Skeleton';

// *** REMOVE direct axios import and API_BASE_URL constant ***
// import axios from 'axios';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // *** FIX: Use apiClient and the correct relative path ***
        const response = await apiClient.get<Category[]>('/api/categories');
        // *** END FIX ***
        setCategories(response.data);
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        // Let the interceptor handle the toast/logging
        if (!err.handled) { // Set local error state if not handled by interceptor
            setError(err.response?.data?.message || "Could not load categories.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []); // Fetch only once on mount

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">Shop by Category</h2>

        {/* Display error message if fetch failed */}
        {error && !isLoading && (
             <div className="text-center text-red-600 mb-6 bg-red-50 p-4 rounded border border-red-200">
                <p>Could not load categories.</p>
                {/* Optionally show the error message for debugging: <p className="text-sm">{error}</p> */}
             </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Show skeletons while loading
            Array.from({ length: 3 }).map((_, index) => (
               <Skeleton key={index} className="aspect-w-3 aspect-h-2 rounded-lg" />
            ))
          ) : !error && categories.length > 0 ? ( // Only render categories if no error and categories exist
             categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  aria-label={`Shop ${category.name}`}
                >
                  <div className="aspect-w-3 aspect-h-2">
                    <img
                      src={category.imageUrl || 'https://via.placeholder.com/400x267/e2e8f0/94a3b8?text=No+Image'}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 bg-gray-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-semibold text-white mb-2 drop-shadow">
                      {category.icon && <span className="mr-2">{category.icon}</span>}{category.name}
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-1 hidden sm:block">
                      {category.subcategories.slice(0, 3).map((sub, index) => (
                        <li key={index} className="overflow-hidden overflow-ellipsis whitespace-nowrap">{sub}</li>
                      ))}
                      {category.subcategories.length > 3 && <li className='opacity-70'>...</li>}
                    </ul>
                  </div>
                </Link>
              ))
          ) : !error && categories.length === 0 && !isLoading ? ( // Only show "No categories" if loading is done and no error
             <p className="text-center text-gray-500 md:col-span-2 lg:col-span-3">No categories found.</p>
          ) : null /* Don't render anything if there was an error and isLoading is false */ }
        </div>
      </div>
    </section>
  );
}