// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Lucide Icons for Core Nav
import { Search, ShoppingCart, Heart, Menu, X } from 'lucide-react';
// Icons for Social Links
import { Facebook, Instagram } from 'lucide-react'; // Using Lucide for these
import { SiTiktok } from 'react-icons/si'; // Using react-icons for TikTok

import { useCartItemCount } from '../store/cartStore';
import { useSavedItemsStore } from '../store/savedItemsStore';

// --- Define Social Links for Navbar ---
const socialNavLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/classy.collectionhub', icon: Instagram, ariaLabel: 'Follow ClassyCollectionHub on Instagram', hoverColorClass: 'hover:text-pink-600' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@classycollection.hub', icon: SiTiktok, ariaLabel: 'Follow ClassyCollectionHub on TikTok', hoverColorClass: 'hover:text-black dark:hover:text-white' },
  { name: 'Facebook', url: 'https://www.facebook.com/ClassyCollectionHub.ke', icon: Facebook, ariaLabel: 'Visit ClassyCollectionHub on Facebook', hoverColorClass: 'hover:text-blue-600' },
];
// --- End Social Links ---


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const cartItemCount = useCartItemCount();
  const savedItemCount = useSavedItemsStore(state => state.savedItemIds.length);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center"> {/* Ensure vertical alignment */}

          {/* Left: Logo and Name */}
          <div className="flex items-center">
            {/* --- MODIFICATION START --- */}
             <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={closeMenu}> {/* Added gap-2 */}
                <img
                  src="/logo.png" // Assumes logo.png is in the /public folder
                  alt="ClassyCollectionHub Logo"
                  className="h-9 w-auto" // Adjusted height slightly
                />
                {/* Add the text next to the logo */}
                <span className="font-semibold text-xl text-teal-600 hover:text-teal-700 transition-colors hidden sm:inline"> {/* Hide text on very small screens */}
                    ClassyCollectionHub
                </span>
             </Link>
             {/* --- MODIFICATION END --- */}
          </div>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8 lg:px-16">
             <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md lg:max-w-lg">
               <input
                 type="text"
                 placeholder="Search products..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:text-sm"
               />
               <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600" aria-label="Search">
                   <Search className="h-5 w-5" />
               </button>
             </form>
          </div>


          {/* Right: Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* --- Social Icons (Desktop) --- */}
            {socialNavLinks.map(link => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    title={link.name}
                    className={`p-2 text-gray-500 ${link.hoverColorClass} transition-colors rounded-full`}
                >
                    <link.icon className="h-[22px] w-[22px]" />
                </a>
            ))}
            {/* --- End Social Icons --- */}

            {/* Separator */}
            { socialNavLinks.length > 0 && <span className="h-6 w-px bg-gray-200" aria-hidden="true"></span> }

            {/* Core Icons */}
            <Link to="/saved-items" className="relative p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors" aria-label="Saved Items">
              <Heart className="h-6 w-6" />
              {savedItemCount > 0 && (
                <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
                  {savedItemCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-full transition-colors" aria-label="Shopping Cart">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-teal-500 text-white text-[10px] font-semibold flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Icons & Menu Button */}
          <div className="md:hidden flex items-center">
             <Link to="/saved-items" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full mr-1" aria-label="Saved Items">
                <Heart className="h-6 w-6" />
                {savedItemCount > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>}
             </Link>
             <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full mr-1" aria-label="Shopping Cart">
                 <ShoppingCart className="h-6 w-6" />
                 {cartItemCount > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>}
             </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-40 border-t border-gray-100" id="mobile-menu">
          <div className="px-4 pt-4 pb-4 space-y-3">
             <form onSubmit={handleSearchSubmit} className="relative">
                 <input
                     type="text"
                     placeholder="Search products..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                 />
                 <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600" aria-label="Search">
                     <Search className="h-5 w-5" />
                 </button>
             </form>
             {/* Mobile Nav Links */}
             <Link to="/" className="nav-mobile-link" onClick={closeMenu}>Home</Link>
             <Link to="/saved-items" className="nav-mobile-link" onClick={closeMenu}>Saved Items</Link>
             <Link to="/cart" className="nav-mobile-link" onClick={closeMenu}>Shopping Cart</Link>

             {/* Mobile Social Links */}
             <div className="border-t border-gray-100 pt-4 mt-4">
                 <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Follow Us</p>
                 <div className="flex space-x-4 px-3">
                     {socialNavLinks.map(link => (
                         <a
                             key={link.name}
                             href={link.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             aria-label={link.ariaLabel}
                             className={`p-1 text-gray-500 ${link.hoverColorClass} transition-colors`}
                         >
                             <link.icon className="h-6 w-6" />
                         </a>
                     ))}
                 </div>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Reminder: Add base style for mobile nav links in index.css if desired
/*
@layer components {
  .nav-mobile-link {
    @apply block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50;
  }
}
*/