// src/pages/AllProductsPage.tsx
import React, { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '../components/Skeleton';
import { Helmet } from 'react-helmet-async';

const AllProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Add state for sorting/filtering later
    // const [sortBy, setSortBy] = useState('default');

    useEffect(() => {
        const fetchAllProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch all products - add sorting/filtering params later
                const response = await apiClient.get<Product[]>('/api/products'); // Add params like ?sort=price_asc later
                setProducts(response.data || []);
            } catch (err: any) {
                console.error("Failed to fetch all products:", err);
                setError(err.response?.data?.message || "Could not load products.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllProducts();
    }, []); // Add sortBy to dependencies later

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <Helmet>
                <title>Shop All Products | ClassyCollectionHubKE</title>
                <meta name="description" content="Browse all available products at ClassyCollectionHubKE. Quality home essentials, apparel, and gifts." />
            </Helmet>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Products</h1>

            {/* Add Sorting/Filtering Controls Here Later */}
            {/* <div className="mb-6 flex justify-end"> ... Filter/Sort UI ... </div> */}

            {isLoading && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                     {Array.from({ length: 12 }).map((_, index) => ( <Skeleton key={index} className="h-64 md:h-80 rounded-lg" /> ))}
                 </div>
            )}
            {error && !isLoading && <p className="text-center text-red-600 my-8">{error}</p>}
            {!isLoading && !error && products.length === 0 && <p className="text-center text-gray-500 my-8">No products found.</p>}

            {!isLoading && !error && products.length > 0 && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                 </div>
            )}

             {/* Add Pagination Controls Here Later if needed */}
        </div>
    );
};

export default AllProductsPage;