// src/components/Hero.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '../lib/apiClient'; // *** Import apiClient ***
import { Category } from '../types'; // *** Import Category type ***
// import { categories as hardcodedCategories } from '../data/categories'; // *** REMOVE static import ***

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  // --- State for fetched categories ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // --- End State ---

  // --- Fetch Categories ---
  useEffect(() => {
    const fetchHeroCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<Category[]>('/api/categories');
        // Filter categories that have an imageUrl, as the hero relies on it
        const categoriesWithImages = (response.data || []).filter(cat => cat.imageUrl);
        setCategories(categoriesWithImages);
        // Reset slide index if fetched categories are different
        setCurrentSlide(0);
      } catch (err: any) {
        console.error("Hero: Failed to fetch categories", err);
        setError("Could not load hero slides.");
        setCategories([]); // Clear categories on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroCategories();
  }, []); // Fetch only once on mount
  // --- End Fetch Categories ---

  // --- Automatic slide transition ---
  useEffect(() => {
    // Only start timer if we have categories to show
    if (categories.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % categories.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(timer); // Clear timer on component unmount or categories change
    }
  }, [categories.length]); // Re-run effect if the number of categories changes
  // --- End Automatic slide ---

  // --- Navigation handlers ---
  const nextSlide = () => {
    if (categories.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % categories.length);
    }
  };

  const prevSlide = () => {
     if (categories.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
     }
  };
  // --- End Navigation ---

  // --- Render Logic ---
  // Handle loading state
  if (isLoading) {
     return (
        <div className="relative bg-gray-200 animate-pulse overflow-hidden">
             <div className="max-w-7xl mx-auto">
                 <div className="relative h-[400px] md:h-[500px] lg:h-[550px]"></div> {/* Placeholder height */}
             </div>
         </div>
     );
  }

  // Handle error state or no categories with images
  if (error || categories.length === 0) {
      return (
          <div className="relative bg-gray-100 overflow-hidden">
              <div className="max-w-7xl mx-auto">
                  <div className="relative flex items-center justify-center h-[400px] md:h-[500px] lg:h-[550px] px-4 text-center">
                       <p className="text-xl text-gray-600">
                           {error ? error : "No hero slides available at the moment."}
                       </p>
                  </div>
              </div>
          </div>
      );
  }

  // Render slider if categories are loaded
  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Slides Container */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                {/* Use category.imageUrl - ensured it exists by filtering earlier */}
                <img
                  src={category.imageUrl!} // Use non-null assertion as we filtered
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                {/* Slide Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-lg text-white">
                      <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-md">
                        {category.icon && <span className="mr-2">{category.icon}</span>} {category.name}
                      </h1>
                      <p className="text-lg text-gray-200 mb-8 drop-shadow-sm">
                        {category.description || `Explore our collection of ${category.name}.`} {/* Fallback description */}
                      </p>
                      <Link
                        to={`/category/${category.id}`}
                        className="inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        <span>Shop Now</span>
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation (Only show if more than one slide) */}
          {categories.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white z-20" aria-label="Previous slide">
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
              <button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white z-20" aria-label="Next slide">
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {categories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${ index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75' }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}