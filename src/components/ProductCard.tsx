import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useSavedItemsStore } from '../store/savedItemsStore';

export default function ProductCard({ product }: { product: Product }) {
  const addItemToCart = useCartStore(state => state.addItem);
  const { toggleSavedItem, isSaved } = useSavedItemsStore();

  const isProductSaved = isSaved(product.id);

  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking button
    e.stopPropagation();
    addItemToCart(product);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    toggleSavedItem(product);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
        <Link to={`/product/${product.id}`} className="absolute inset-0 z-0" aria-label={`View ${product.name}`}> </Link> {/* Full card link */}

      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Overlay for hover effects */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />

        {/* Action Icons - Appear on Hover */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleToggleSave}
            className={`p-2 bg-white rounded-full shadow-md ${
              isProductSaved
                ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-500 hover:bg-gray-100 hover:text-red-500'
            } transition-colors duration-150 ease-in-out`}
            aria-label={isProductSaved ? 'Remove from saved items' : 'Save for later'}
            title={isProductSaved ? 'Remove from saved items' : 'Save for later'}
          >
            <Heart className={`h-5 w-5 ${isProductSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 bg-white text-gray-500 rounded-full shadow-md hover:bg-gray-100 hover:text-teal-600 transition-colors duration-150 ease-in-out"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {product.featured && (
          <div className="absolute top-3 left-3 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow">
            Featured
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between z-10 bg-white"> {/* Ensure content is above link */}
        <div>
            <h3 className="text-base font-medium text-gray-900 mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap" title={product.name}>
                {product.name}
            </h3>
            <div className="mt-1 flex items-center text-xs text-gray-500 mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="mx-1.5 text-gray-300">•</span>
                <span>{product.reviews} reviews</span>
            </div>
        </div>
        <p className="mt-2 text-lg font-semibold text-teal-600">{formattedPrice}</p>
      </div>
    </div>
  );
}