// src/pages/ProductDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Keep axios for public fetching
import { ShoppingCart, Heart, Star, ChevronLeft, AlertCircle, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useSavedItemsStore } from '../store/savedItemsStore';
import ProductCard from '../components/ProductCard';
import { Product as ProductType } from '../types'; // Renamed Product to ProductType
import { Helmet } from 'react-helmet-async';
import { Skeleton } from '../components/Skeleton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export default function ProductDetailPage() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const addItemToCart = useCartStore(state => state.addItem);
    const { toggleSavedItem, isSaved } = useSavedItemsStore();
    const isProductSaved = isSaved(productId || '');

    useEffect(() => {
        if (!productId) return;
        const fetchProduct = async () => {
             setIsLoading(true); setError(null); setProduct(null); setRelatedProducts([]); setCurrentImageIndex(0);
             try {
                // Use public endpoint for fetching product details
                const response = await axios.get<ProductType>(`${API_BASE_URL}/products/${productId}`);
                setProduct(response.data);

                const fetchedCategoryId = response.data?.category?.id;
                if (fetchedCategoryId) {
                    try {
                        // Use public endpoint for fetching related products
                        const relatedResponse = await axios.get<ProductType[]>(`${API_BASE_URL}/products`, {
                             params: { categoryId: fetchedCategoryId, limit: 4 }
                         });
                        setRelatedProducts(relatedResponse.data.filter(p => p.id !== productId).slice(0, 3));
                    } catch (relatedErr) { console.error("Failed fetch related:", relatedErr); }
                }
             } catch (err: any) {
                console.error("Failed fetch product:", err);
                setError(err.response?.status === 404 ? 'Product not found.' : 'Could not load product details.');
             } finally {
                 setIsLoading(false);
             }
        };
        fetchProduct();
    }, [productId]);

    // Image Slider Handlers
    const handlePrevImage = () => {
        if (!product || !product.imageUrls || product.imageUrls.length <= 1) return;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1
        );
    };
    const handleNextImage = () => {
        if (!product || !product.imageUrls || product.imageUrls.length <= 1) return;
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % product.imageUrls.length
        );
    };

    const handleAddToCart = () => { if (product) addItemToCart(product); };
    const handleToggleSave = () => { if (product) toggleSavedItem(product); };

    // Loading State UI
    if (isLoading) {
        return (
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

    // Error State UI
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
                <h2 className="text-2xl font-semibold text-red-700 mb-4">{error}</h2>
                <Link to="/" className="text-teal-600 hover:text-teal-800 mt-4 inline-block"> ← Go back home </Link>
            </div>
        );
    }

    if (!product) return null; // Should be caught by error state

    const formattedPrice = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(product.price);
    const hasMultipleImages = product.imageUrls && product.imageUrls.length > 1;
    // Ensure imageUrls exists and has items before accessing index, provide fallback
    const currentImageUrl = (Array.isArray(product.imageUrls) && product.imageUrls.length > 0)
                            ? product.imageUrls[currentImageIndex]
                            : 'https://via.placeholder.com/600x600/e2e8f0/94a3b8?text=No+Image';

    return (
        <div className="bg-white">
            <Helmet>
                 <title>{`${product.name} | ClassyCollectionHubKE`}</title>
                 <meta name="description" content={`${product.description.substring(0, 160)}... Buy ${product.name} online in Kenya.`} />
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section with Slider */}
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-100">
                        {/* Display current image */}
                        <img
                            src={currentImageUrl}
                            alt={`${product.name} - Image ${currentImageIndex + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                            key={currentImageIndex} // Key change helps with transition effects
                        />
                        {/* Slider Controls */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-white z-10 transition-opacity opacity-70 hover:opacity-100"
                                    aria-label="Previous Image"
                                >
                                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-white z-10 transition-opacity opacity-70 hover:opacity-100"
                                    aria-label="Next Image"
                                >
                                    <ChevronRight className="h-6 w-6 text-gray-800" />
                                </button>
                                {/* Dots Indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                                    {product.imageUrls.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                                                index === currentImageIndex ? 'bg-white ring-1 ring-offset-1 ring-offset-black/50 scale-125' : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                            aria-label={`Go to image ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-2">
                            <Link
                                to={`/category/${product.category?.id}`}
                                className="text-sm text-gray-500 hover:text-gray-700 capitalize"
                            >
                                {product.category?.name || 'Category'}
                            </Link>
                            <span className="mx-2 text-gray-400">/</span>
                            <span className="text-sm text-gray-500">{product.subcategory}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                        {/* Rating */}
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

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center space-x-2 transition duration-150 ease-in-out btn-click-effect"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span>Add to Cart</span>
                            </button>
                            <button
                                onClick={handleToggleSave}
                                className={`p-3 rounded-full border transition duration-150 ease-in-out btn-click-effect ${
                                    isProductSaved
                                        ? 'bg-red-100 border-red-300 text-red-500 hover:bg-red-200'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-red-500'
                                }`}
                                aria-label={isProductSaved ? 'Remove from saved items' : 'Save for later'}
                                title={isProductSaved ? 'Remove from saved items' : 'Save for later'}
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