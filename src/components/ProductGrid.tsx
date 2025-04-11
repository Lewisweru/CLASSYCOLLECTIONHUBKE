import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data/products';

export default function ProductGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
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
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <div className="mt-1 flex items-center">
          <span className="text-sm text-gray-500">★ {product.rating}</span>
          <span className="mx-1 text-gray-400">•</span>
          <span className="text-sm text-gray-500">{product.reviews} reviews</span>
        </div>
        <p className="mt-2 text-xl font-semibold text-teal-600">${product.price}</p>
      </div>
    </div>
  );
}