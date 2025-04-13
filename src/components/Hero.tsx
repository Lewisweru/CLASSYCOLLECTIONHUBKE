import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '../data/categories';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div className="relative h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden"> {/* Adjusted height */}
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${ // Smoother transition
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0' // Use z-index
                }`}
              >
                {/* Darker gradient for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-lg text-white">
                      <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-md"> {/* Text shadow */}
                        {category.icon} {category.name}
                      </h1>
                      <p className="text-lg text-gray-200 mb-8 drop-shadow-sm">
                        {category.description}
                      </p>
                      {/* Use Link for the button */}
                      <Link
                        to={`/category/${category.id}`} // Dynamic link
                        className="inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900" // Added focus styles
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
          {/* Navigation Buttons - Improved styling */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
          {/* Dots - Improved styling */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}