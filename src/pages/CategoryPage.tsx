import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  
  const category = categories.find(c => c.id === categoryId);
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.category === categoryId && 
      (selectedSubcategory === 'all' || product.subcategory === selectedSubcategory)
    );
  }, [categoryId, selectedSubcategory]);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {category.icon} {category.name}
        </h1>
        <p className="text-gray-600">{category.description}</p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Subcategory
        </label>
        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
        >
          <option value="all">All Subcategories</option>
          {category.subcategories.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}