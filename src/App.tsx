import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// --- Public Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import TrustBadges from './components/TrustBadges';
import Newsletter from './components/Newsletter';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SavedItemsPage from './pages/SavedItemsPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// --- Admin Components ---
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout'; // Admin specific layout
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminProtectedRoute from './components/AdminProtectedRoute'; // Protection HOC
import AdminCategoryListPage from './pages/admin/AdminCategoryListPage';     // <<< IMPORT
import AdminCategoryFormPage from './pages/admin/AdminCategoryFormPage';     // <<< IMPORT


// --- Helper Components ---

// HomePage Component (for cleaner structure)
function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <TrustBadges />
      <Newsletter />
    </main>
  );
}

// Component for public routes with animation and standard layout
function PublicLayoutWrapper() {
    const location = useLocation();
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow fade-in" key={location.pathname}> {/* Animation applied here */}
                 {/* Nested Routes for public pages */}
                 <Routes>
                     <Route path="/" element={<HomePage />} />
                     <Route path="/category/:categoryId" element={<CategoryPage />} />
                     <Route path="/product/:productId" element={<ProductDetailPage />} />
                     <Route path="/cart" element={<CartPage />} />
                     <Route path="/saved-items" element={<SavedItemsPage />} />
                     <Route path="/search" element={<SearchPage />} />
                     <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                     {/* Add a public 404 Not Found route here later */}
                     <Route path="*" element={<div>Public 404 Not Found</div>} /> {/* Placeholder */}
                 </Routes>
            </main>
            <Footer />
        </div>
    );
}

// Component for admin routes within the AdminLayout
function AdminRoutesWrapper() {
  return (
      <Routes>
          {/* --- Dashboard --- */}
          <Route index element={<AdminDashboardPage />} /> {/* /admin */}

          {/* --- Products --- */}
          <Route path="products" element={<AdminProductListPage />} /> {/* /admin/products */}
          <Route path="products/new" element={<AdminProductFormPage mode="create"/>} /> {/* /admin/products/new */}
          <Route path="products/edit/:productId" element={<AdminProductFormPage mode="edit"/>} /> {/* /admin/products/edit/:id */}

          {/* --- Categories (Added) --- */}
          <Route path="categories" element={<AdminCategoryListPage />} /> {/* /admin/categories */}
          <Route path="categories/new" element={<AdminCategoryFormPage mode="create"/>} /> {/* /admin/categories/new */}
          <Route path="categories/edit/:categoryId" element={<AdminCategoryFormPage mode="edit"/>} /> {/* /admin/categories/edit/:id */}

           {/* --- Fallback for unknown admin routes --- */}
           <Route path="*" element={<div>Admin Section - 404 Not Found</div>} />
      </Routes>
  );
}


// --- Main App Component ---
function App() {
  return (
    <HelmetProvider>
      <Router>
        {/* Toaster for global notifications */}
        <Toaster position="bottom-center" reverseOrder={false} />

        {/* Top Level Router defines distinct sections */}
        <Routes>
           {/* Admin Login Route (No standard layout) */}
           <Route path="/admin/login" element={<AdminLoginPage />} />

           {/* Protected Admin Section (Uses AdminLayout) */}
           <Route path="/admin/*" element={ // Note the /* for nested admin routes
               <AdminProtectedRoute>
                   <AdminLayout>
                        <AdminRoutesWrapper /> {/* Nested admin routes rendered here */}
                   </AdminLayout>
               </AdminProtectedRoute>
           } />

            {/* Public Section (Uses standard Navbar/Footer and PublicLayoutWrapper) */}
           <Route path="/*" element={<PublicLayoutWrapper />} /> {/* Catch-all for public routes */}

        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;