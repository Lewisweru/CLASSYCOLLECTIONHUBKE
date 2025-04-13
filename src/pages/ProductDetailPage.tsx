// src/pages/ProductDetailPage.tsx
import { useState, useEffect } from 'react'; // No need for 'React' import
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Import USED icons
import { ShoppingCart, Heart, Star, ChevronLeft, AlertCircle } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useSavedItemsStore } from '../store/savedItemsStore';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { Helmet } from 'react-helmet-async';
// Import USED loader
import { Skeleton } from '../components/Skeleton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export default function ProductDetailPage() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate(); // Keep useNavigate
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const addItemToCart = useCartStore(state => state.addItem);
    const { toggleSavedItem, isSaved } = useSavedItemsStore();
    // Keep isProductSaved, will be used below
    const isProductSaved = isSaved(productId || '');

    useEffect(() => {
        if (!productId) return;
        const fetchProduct = async () => {
             setIsLoading(true); setError(null); setProduct(null); setRelatedProducts([]);
             try {
                const response = await axios.get<Product>(`${API_BASE_URL}/products/${productId}`);
                setProduct(response.data);
                if (response.data?.category?.id) {
                    // Fetch related (keep existing logic)
                    try {
                        const relatedResponse = await axios.get<Product[]>(`${API_BASE_URL}/products`, { params: { categoryId: response.data.category.id, limit: 4 } });
                        setRelatedProducts(relatedResponse.data.filter(p => p.id !== productId).slice(0, 3));
                    } catch (relatedErr) { console.error("Failed to fetch related products:", relatedErr); }
                }
             } catch (err: any) {
                console.error("Failed to fetch product:", err);
                setError(err.response?.status === 404 ? 'Product not found.' : 'Could not load product details.');
             } finally { setIsLoading(false); }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => { if (product) addItemToCart(product); };
    const handleToggleSave = () => { if (product) toggleSavedItem(product); };

    // --- Loading State ---
    if (isLoading) {
        return ( /* ... Skeleton loading UI ... */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
                <Skeleton className="h-6 w-20 mb-4 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-1/2 rounded" /> <Skeleton className="h-8 w-3/4 rounded" />
                        <Skeleton className="h-5 w-1/3 rounded" /> <Skeleton className="h-8 w-1/4 rounded" />
                        <Skeleton className="h-20 w-full rounded" />
                        <div className="flex space-x-4">
                            <Skeleton className="h-12 flex-1 rounded-lg" /> <Skeleton className="h-12 w-12 rounded-full" />
                        </div>
                    </div>
                </div>
           </div>
        );
    }

    // --- Error State ---
    if (error) {
        return ( /* ... Error UI ... */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
                <h2 className="text-2xl font-semibold text-red-700 mb-4">{error}</h2>
                <Link to="/" className="text-teal-600 hover:text-teal-800 mt-4 inline-block"> ← Go back home </Link>
            </div>
        );
    }

    // --- Product Not Found --- (Should be caught by error state now)
    if (!product) return null;

    // --- Render Product Details ---
    const formattedPrice = new Intl.NumberFormat('en-KE', {
        style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(product.price);

    return (
        <div className="bg-white">
            <Helmet>
                <title>{`${product.name} | ClassyCollectionHubKE`}</title>
                <meta name="description" content={`${product.description.substring(0, 160)}... Buy ${product.name} online in Kenya.`} />
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back button - USE navigate and ChevronLeft */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div className="aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-100">
                        <img src={product.imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-2">
                            {/* Category Link - FIX APPLIED */}
                            <Link
                                to={`/category/${typeof product.category === 'object' ? product.category.id : product.category}`}
                                className="text-sm text-gray-500 hover:text-gray-700 capitalize"
                            >
                                {typeof product.category === 'object' ? product.category.name : product.category}
                            </Link>
                            <span className="mx-2 text-gray-400">/</span>
                            <span className="text-sm text-gray-500">{product.subcategory}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                        {/* Rating - USE Star */}
                        <div className="flex items-center mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
                        </div>

                        <p className="text-3xl font-semibold text-teal-600 mb-6">{formattedPrice}</p>
                        <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                        {/* Action Buttons - USE ShoppingCart, Heart, isProductSaved */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center space-x-2 transition duration-150 ease-in-out btn-click-effect" // Added click effect
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span>Add to Cart</span>
                            </button>
                            <button
                                onClick={handleToggleSave}
                                className={`p-3 rounded-full border transition duration-150 ease-in-out btn-click-effect ${ // Added click effect
                                    isProductSaved // USE isProductSaved here
                                        ? 'bg-red-100 border-red-300 text-red-500 hover:bg-red-200'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-red-500'
                                }`}
                                aria-label={isProductSaved ? 'Remove from saved items' : 'Save for later'}
                                title={isProductSaved ? 'Remove from saved items' : 'Save for later'} // Add title for better UX
                            >
                                <Heart className={`h-6 w-6 ${isProductSaved ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProducts.map((relatedProd) => (
                                <ProductCard key={relatedProd.id} product={relatedProd} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}