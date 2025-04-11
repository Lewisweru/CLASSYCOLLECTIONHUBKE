import React from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Heart className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Eye className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        {product.featured && (
          <div className="absolute top-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <div className="mt-1 flex items-center">
          <span className="text-sm text-gray-500">★ {product.rating}</span>
          <span className="mx-1 text-gray-400">•</span>
          <span className="text-sm text-gray-500">{product.reviews} reviews</span>
        </div>
        <p className="mt-2 text-xl font-semibold text-teal-600">{formattedPrice}</p>
      </div>
    </div>
  );
}