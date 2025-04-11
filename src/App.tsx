import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import TrustBadges from './components/TrustBadges';
import Newsletter from './components/Newsletter';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <Categories />
              <FeaturedProducts />
              <TrustBadges />
              <Newsletter />
            </main>
          } />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;