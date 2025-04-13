// src/components/Categories.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { Category } from '../types'; // Use your defined Category type
import { Skeleton } from './Skeleton'; // Assuming a simple Skeleton component exists

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<Category[]>(`${API_BASE_URL}/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Could not load categories.");
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

        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Show skeletons while loading
            Array.from({ length: 3 }).map((_, index) => (
               <Skeleton key={index} className="aspect-w-3 aspect-h-2 rounded-lg" />
            ))
          ) : categories.length > 0 ? (
             categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  aria-label={`Shop ${category.name}`}
                >
                  <div className="aspect-w-3 aspect-h-2">
                    <img
                      // Use fallback image if imageUrl is null/missing
                      src={category.imageUrl || 'https://via.placeholder.com/400x267/e2e8f0/94a3b8?text=No+Image'}
                      alt={category.name}
                      loading="lazy" // Lazy load images
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 bg-gray-200" // Added bg color
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
          ) : (
             <p className="text-center text-gray-500 md:col-span-2 lg:col-span-3">No categories found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

// Add a simple Skeleton component (e.g., src/components/Skeleton.tsx)
// export const Skeleton = ({ className }: { className?: string }) => (
//   <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
// );
// Remember to create and export this or use a library.