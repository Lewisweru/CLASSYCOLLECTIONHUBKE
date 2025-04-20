// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Public Components
import Navbar from './components/Navbar'; import Footer from './components/Footer'; import Hero from './components/Hero'; import Categories from './components/Categories'; import FeaturedProducts from './components/FeaturedProducts'; import TrustBadges from './components/TrustBadges'; import Newsletter from './components/Newsletter'; import CategoryPage from './pages/CategoryPage'; import ProductDetailPage from './pages/ProductDetailPage'; import SavedItemsPage from './pages/SavedItemsPage'; import SearchPage from './pages/SearchPage'; import CartPage from './pages/CartPage'; import OrderConfirmationPage from './pages/OrderConfirmationPage'; import AllProductsPage from './pages/AllProductsPage';
// *** Import AboutUsPage and ContactUsPage ***
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
// *** Import FloatingWhatsApp ***
import FloatingWhatsApp from './components/FloatingWhatsapp';


// Admin Components
import AdminLoginPage from './pages/admin/AdminLoginPage'; import AdminLayout from './pages/admin/AdminLayout'; import AdminDashboardPage from './pages/admin/AdminDashboardPage'; import AdminProductListPage from './pages/admin/AdminProductListPage'; import AdminProductFormPage from './pages/admin/AdminProductFormPage'; import AdminProtectedRoute from './components/AdminProtectedRoute'; import AdminCategoryListPage from './pages/admin/AdminCategoryListPage'; import AdminCategoryFormPage from './pages/admin/AdminCategoryFormPage'; import AdminOrderListPage from './pages/admin/AdminOrderListPage'; import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';


function HomePage() {
  return (
    <main>
      <Hero />
      {/* Hide Categories on mobile */}
      <div className="hidden md:block">
        <Categories />
      </div>
      <FeaturedProducts />
      <TrustBadges />
      <Newsletter />
    </main>
 );
}

function PublicLayoutWrapper() {
    const location = useLocation();
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative"> {/* Added relative positioning */}
            <Navbar />
            <main className="flex-grow fade-in" key={location.pathname}>
                 <Routes>
                     <Route path="/" element={<HomePage />} />
                     <Route path="/shop" element={<AllProductsPage />} />
                     <Route path="/category/:categoryId" element={<CategoryPage />} />
                     <Route path="/product/:productId" element={<ProductDetailPage />} />
                     <Route path="/cart" element={<CartPage />} />
                     <Route path="/saved-items" element={<SavedItemsPage />} />
                     <Route path="/search" element={<SearchPage />} />
                     <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                      {/* *** Add About and Contact Routes *** */}
                      <Route path="/about" element={<AboutUsPage />} />
                      <Route path="/contact" element={<ContactUsPage />} />
                      {/* Add FAQ route if needed */}
                     <Route path="*" element={<div className='text-center p-10'>Public 404: Page Not Found</div>} />
                 </Routes>
            </main>
             {/* *** Add Floating WhatsApp Button *** */}
             <FloatingWhatsApp />
             {/* *** End Floating Button *** */}
            <Footer />
        </div>
    );
}

function AdminRoutesWrapper() { /* ... admin routes ... */
  return ( <Routes> <Route index element={<AdminDashboardPage />} /> <Route path="products" element={<AdminProductListPage />} /> <Route path="products/new" element={<AdminProductFormPage mode="create"/>} /> <Route path="products/edit/:productId" element={<AdminProductFormPage mode="edit"/>} /> <Route path="categories" element={<AdminCategoryListPage />} /> <Route path="categories/new" element={<AdminCategoryFormPage mode="create"/>} /> <Route path="categories/edit/:categoryId" element={<AdminCategoryFormPage mode="edit"/>} /> <Route path="orders" element={<AdminOrderListPage />} /> <Route path="orders/:orderId" element={<AdminOrderDetailPage />} /> <Route path="*" element={<div className='text-center p-10'>Admin Section - 404 Not Found</div>} /> </Routes> );
}


function App() { /* ... main App structure ... */
  return ( <HelmetProvider> <Router> <Toaster position="bottom-center" reverseOrder={false} /> <Routes> <Route path="/admin/login" element={<AdminLoginPage />} /> <Route path="/admin/*" element={ <AdminProtectedRoute> <AdminLayout> <AdminRoutesWrapper /> </AdminLayout> </AdminProtectedRoute> } /> <Route path="/*" element={<PublicLayoutWrapper />} /> </Routes> </Router> </HelmetProvider> );
}

export default App;