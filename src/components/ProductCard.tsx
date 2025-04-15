// src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useSavedItemsStore } from '../store/savedItemsStore';
// No need for toast import here if store handles it

export default function ProductCard({ product }: { product: Product }) {
  const addItemToCart = useCartStore(state => state.addItem);
  const { toggleSavedItem, isSaved } = useSavedItemsStore();

  const isProductSaved = isSaved(product.id);

  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0, // Changed from 2 to 0 for whole shillings
    maximumFractionDigits: 0, // Ensure no decimals
  }).format(product.price / 100); // Divide by 100 for display

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking button
    e.stopPropagation(); // Prevent link navigation when clicking button
    addItemToCart(product);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent link navigation
    toggleSavedItem(product);
  };

  // Get the first image URL, provide fallback
  const displayImageUrl = (Array.isArray(product.imageUrls) && product.imageUrls.length > 0)
                            ? product.imageUrls[0]
                            : 'https://via.placeholder.com/400x400/e2e8f0/94a3b8?text=No+Image';

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden border border-transparent hover:border-teal-200">
        {/* Full card link - positioned behind content */}
        <Link to={`/product/${product.id}`} className="absolute inset-0 z-0" aria-label={`View ${product.name}`}> </Link>

      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={displayImageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 pointer-events-none" />

        {/* Save Icon - positioned above content */}
        <button
            onClick={handleToggleSave}
            className={`absolute top-2 right-2 z-20 p-2 bg-white/80 rounded-full shadow-md backdrop-blur-sm ${ // z-20 to be above overlay
              isProductSaved
                ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-500 hover:bg-gray-100 hover:text-red-500'
            } transition-colors duration-150 ease-in-out opacity-0 group-hover:opacity-100 focus:opacity-100`} // Appear on hover/focus
            aria-label={isProductSaved ? 'Remove from saved items' : 'Save for later'}
            title={isProductSaved ? 'Remove from saved items' : 'Save for later'}
          >
            <Heart className={`h-5 w-5 ${isProductSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 z-10 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow">
            Featured
          </div>
        )}
      </div>

      {/* Content Area - needs z-10 to be clickable over the main link */}
      <div className="p-4 flex-grow flex flex-col justify-between z-10 bg-white">
        {/* Top part: Name & Rating */}
        <div>
            <h3 className="text-base font-medium text-gray-900 mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap group-hover:text-teal-600 transition-colors" title={product.name}>
                 {/* Link makes the name itself clickable, styled like text */}
                 <Link to={`/product/${product.id}`} className="focus:outline-none hover:underline static">
                      {product.name}
                  </Link>
            </h3>
            {/* Rating */}
            <div className="mt-1 flex items-center text-xs text-gray-500 mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="mx-1.5 text-gray-300">•</span>
                <span>{product.reviews} reviews</span>
            </div>
        </div>

        {/* Bottom part: Price & Add Button */}
        <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-semibold text-teal-600">{formattedPrice}</p>
            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-md text-xs font-medium hover:bg-teal-100 hover:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 transition-all duration-150 ease-in-out btn-click-effect transform active:scale-95" // Added transform/active scale
                aria-label={`Add ${product.name} to cart`}
                title="Add to cart"
            >
                <Plus className="h-4 w-4 mr-1 -ml-0.5" /> Add
            </button>
        </div>
      </div>
    </div>
  );
}