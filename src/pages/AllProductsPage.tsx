// src/pages/AllProductsPage.tsx
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import apiClient from '../lib/apiClient';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '../components/Skeleton';
import { Helmet } from 'react-helmet-async';
import { Search, ListFilter } from 'lucide-react'; // For icons

type SortByType = 'default' | 'price_asc' | 'price_desc' | 'featured' | 'rating_desc' | 'reviews_desc';

const sortOptions: { value: SortByType; label: string }[] = [
    { value: 'default', label: 'Default Sorting' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'featured', label: 'Featured First' },
    { value: 'rating_desc', label: 'Avg. Rating (High-Low)' }, // Map "Best Sell" to rating maybe
    { value: 'reviews_desc', label: 'Popularity (Reviews)' }, // Or map "Best Sell" to reviews
];


const AllProductsPage: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]); // Original fetched list
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('default');

    // Fetch all products once on mount
    useEffect(() => {
        const fetchAllProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get<Product[]>('/api/products'); // Fetch all
                setAllProducts(response.data || []);
            } catch (err: any) {
                console.error("Failed to fetch all products:", err);
                setError(err.response?.data?.message || "Could not load products.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    // Handle search input change
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Handle sort dropdown change
    const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value as SortByType);
    };

    // Memoized filtering and sorting logic
    const filteredAndSortedProducts = useMemo(() => {
        let products = [...allProducts];

        // Apply search filter
        if (searchTerm.trim() !== '') {
            const lowerSearchTerm = searchTerm.toLowerCase();
            products = products.filter(product =>
                product.name.toLowerCase().includes(lowerSearchTerm) ||
                product.description.toLowerCase().includes(lowerSearchTerm) ||
                product.subcategory.toLowerCase().includes(lowerSearchTerm) ||
                product.category?.name?.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'price_asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'featured':
                // Sort by featured (true first), then maybe by default order (e.g., createdAt if available)
                products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                // Add secondary sort if needed: || (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                break;
             case 'rating_desc':
                 products.sort((a, b) => b.rating - a.rating);
                 break;
             case 'reviews_desc':
                 products.sort((a, b) => b.reviews - a.reviews);
                 break;
            case 'default':
            default:
                // Maintain original fetched order (or sort by createdAt if you have it)
                // products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        return products;
    }, [allProducts, searchTerm, sortBy]); // Recalculate when these change


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <Helmet>
                <title>Shop All Products | ClassyCollectionHubKE</title>
                <meta name="description" content="Browse all available products at ClassyCollectionHubKE. Quality home essentials, apparel, and gifts." />
            </Helmet>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">Shop</h1>

            {/* --- Search and Sort Controls --- */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Search Input */}
                <div className="relative sm:col-span-2">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Search className="h-5 w-5" />
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                     <label htmlFor="sort-by" className="sr-only">Sort by</label>
                     <select
                         id="sort-by"
                         value={sortBy}
                         onChange={handleSortChange}
                         className="form-select w-full py-2 pl-3 pr-10 text-base leading-6 border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md appearance-none"
                     >
                         {sortOptions.map(option => (
                             <option key={option.value} value={option.value}>{option.label}</option>
                         ))}
                     </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ListFilter className="h-5 w-5" />
                      </div>
                </div>
            </div>
             {/* --- End Controls --- */}


            {isLoading && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                     {Array.from({ length: 12 }).map((_, index) => ( <Skeleton key={index} className="h-64 md:h-80 rounded-lg" /> ))}
                 </div>
            )}
            {error && !isLoading && <p className="text-center text-red-600 my-8">{error}</p>}
            {!isLoading && !error && filteredAndSortedProducts.length === 0 && (
                <p className="text-center text-gray-500 my-8">
                    {searchTerm ? `No products found matching "${searchTerm}".` : "No products found."}
                </p>
            )}

            {!isLoading && !error && filteredAndSortedProducts.length > 0 && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {filteredAndSortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                 </div>
            )}

             {/* Add Pagination Controls Here Later if needed */}
        </div>
    );
};

export default AllProductsPage;