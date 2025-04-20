// src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'; // Added ChevronUp/Right
import { Facebook, Instagram } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import apiClient from '../lib/apiClient';
import { Category } from '../types';
import { useCartItemCount } from '../store/cartStore';
import { useSavedItemsStore } from '../store/savedItemsStore';

const socialNavLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/classy.collectionhub', icon: Instagram, ariaLabel: 'Follow ClassyCollectionHub on Instagram', hoverColorClass: 'hover:text-pink-600' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@classycollection.hub', icon: SiTiktok, ariaLabel: 'Follow ClassyCollectionHub on TikTok', hoverColorClass: 'hover:text-black dark:hover:text-white' },
  { name: 'Facebook', url: 'https://www.facebook.com/ClassyCollectionHub.ke', icon: Facebook, ariaLabel: 'Visit ClassyCollectionHub on Facebook', hoverColorClass: 'hover:text-blue-600' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const cartItemCount = useCartItemCount();
  const savedItemCount = useSavedItemsStore(state => state.savedItemIds.length);

  // --- State for Categories and Dropdown ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [isShopDropdownOpenDesktop, setIsShopDropdownOpenDesktop] = useState(false);
  const [isCategorySubmenuOpenMobile, setIsCategorySubmenuOpenMobile] = useState(false); // For mobile category toggle
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const desktopDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // --- End State ---

  // --- Fetch Categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await apiClient.get<Category[]>('/api/categories'); // Ensure path is correct
        setCategories(response.data || []);
      } catch (error) {
        console.error("Navbar: Failed to fetch categories", error);
        // Handle error appropriately, maybe show a toast or log
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  // --- End Fetch Categories ---

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      closeAllMenus(); // Close menus after search
    }
  };

  // Close all menus and dropdowns
  const closeAllMenus = () => {
      setIsMenuOpen(false);
      setIsShopDropdownOpenDesktop(false);
      setIsCategorySubmenuOpenMobile(false);
  }

  // --- Desktop Dropdown Hover Logic ---
  const handleShopMouseEnterDesktop = () => {
    if (desktopDropdownTimeoutRef.current) {
        clearTimeout(desktopDropdownTimeoutRef.current);
        desktopDropdownTimeoutRef.current = null; // Clear ref
    }
    setIsShopDropdownOpenDesktop(true);
  };

  const handleShopMouseLeaveDesktop = () => {
    // Delay closing to allow moving mouse into dropdown
    desktopDropdownTimeoutRef.current = setTimeout(() => {
        setIsShopDropdownOpenDesktop(false);
    }, 150); // 150ms delay
  };
  // --- End Desktop Dropdown Hover Logic ---

    // --- Mobile Submenu Toggle ---
  const toggleMobileCategories = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent default link behavior if it was a link
      e.stopPropagation(); // Prevent event bubbling
      setIsCategorySubmenuOpenMobile(prev => !prev);
  };
  // --- End Mobile Submenu Toggle ---

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Left: Logo and Name */}
          <div className="flex items-center">
             <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={closeAllMenus}>
                <img src="/logo.png" alt="ClassyCollectionHub Logo" className="h-9 w-auto"/>
                <span className="font-semibold text-xl text-teal-600 hover:text-teal-700 transition-colors hidden sm:inline">ClassyCollectionHub</span>
             </Link>
          </div>

           {/* Center: Main Links + Shop Dropdown (Desktop) */}
           <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                <NavLink to="/" className={({ isActive }) => isActive ? "text-teal-600 font-medium" : "text-gray-600 hover:text-gray-900"} onClick={closeAllMenus}>Home</NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? "text-teal-600 font-medium" : "text-gray-600 hover:text-gray-900"} onClick={closeAllMenus}>About Us</NavLink>

                {/* --- SHOP Dropdown Trigger (Desktop) --- */}
                <div className="relative" onMouseEnter={handleShopMouseEnterDesktop} onMouseLeave={handleShopMouseLeaveDesktop}>
                    <button
                        type="button"
                        className={`inline-flex items-center gap-1 ${isShopDropdownOpenDesktop ? 'text-teal-600' : 'text-gray-600'} hover:text-gray-900 focus:outline-none focus:text-gray-900`}
                        aria-haspopup="true"
                        aria-expanded={isShopDropdownOpenDesktop}
                        onFocus={handleShopMouseEnterDesktop} // Open on focus too
                    >
                        Shop
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isShopDropdownOpenDesktop ? 'rotate-180' : ''}`} />
                    </button>

                    {/* --- Desktop Shop Dropdown Menu --- */}
                    {isShopDropdownOpenDesktop && (
                        <div
                            className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="shop-menu-button"
                            onMouseEnter={handleShopMouseEnterDesktop} // Keep open on hover
                            onMouseLeave={handleShopMouseLeaveDesktop} // Close on leave
                        >
                             {/* Link to All Products page */}
                             <Link
                                to="/shop" // Link to the new All Products page
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium hover:text-gray-900"
                                role="menuitem"
                                onClick={closeAllMenus}
                            >
                                All Products
                             </Link>
                             <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shop by Category</div>
                             {/* Scrollable category list */}
                             <div className="max-h-60 overflow-y-auto custom-scrollbar"> {/* Added max-height and scroll */}
                                {isLoadingCategories ? (
                                     <div className="px-4 py-2 text-sm text-gray-500 italic">Loading...</div>
                                 ) : categories.length > 0 ? (
                                    categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            to={`/category/${category.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                            onClick={closeAllMenus} // Close dropdown on click
                                        >
                                            {category.icon && <span className="mr-2">{category.icon}</span>} {category.name}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500 italic">No categories found.</div>
                                )}
                             </div>
                        </div>
                    )}
                    {/* --- End Desktop Dropdown --- */}
                </div>
                 {/* --- End SHOP Dropdown Trigger (Desktop) --- */}

                <NavLink to="/faq" className={({ isActive }) => isActive ? "text-teal-600 font-medium" : "text-gray-600 hover:text-gray-900"} onClick={closeAllMenus}>FAQs</NavLink>
                <NavLink to="/contact" className={({ isActive }) => isActive ? "text-teal-600 font-medium" : "text-gray-600 hover:text-gray-900"} onClick={closeAllMenus}>Contact Us</NavLink>
           </div>


          {/* Right: Search, Icons (Desktop) & Mobile Trigger */}
          <div className="flex items-center">
               {/* Desktop Search */}
              <div className="hidden md:block ml-6"> <form onSubmit={handleSearchSubmit} className="relative"> <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:text-sm" /> <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600" aria-label="Search"><Search className="h-5 w-5" /></button> </form> </div>
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-3 ml-4"> {socialNavLinks.map(link => ( <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel} title={link.name} className={`p-2 text-gray-500 ${link.hoverColorClass} transition-colors rounded-full`}> <link.icon className="h-[22px] w-[22px]" /> </a> ))} { socialNavLinks.length > 0 && <span className="h-6 w-px bg-gray-200" aria-hidden="true"></span> } <Link to="/saved-items" className="relative p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors" aria-label="Saved Items"> <Heart className="h-6 w-6" /> {savedItemCount > 0 && ( <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">{savedItemCount}</span> )} </Link> <Link to="/cart" className="relative p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-full transition-colors" aria-label="Shopping Cart"> <ShoppingCart className="h-6 w-6" /> {cartItemCount > 0 && ( <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-teal-500 text-white text-[10px] font-semibold flex items-center justify-center">{cartItemCount}</span> )} </Link> </div>
              {/* Mobile Trigger */}
              <div className="md:hidden flex items-center ml-4"> <Link to="/saved-items" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full mr-1" aria-label="Saved Items"><Heart className="h-6 w-6" />{savedItemCount > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>}</Link> <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full mr-1" aria-label="Shopping Cart"><ShoppingCart className="h-6 w-6" />{cartItemCount > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>}</Link> <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500" aria-expanded={isMenuOpen} aria-controls="mobile-menu"> <span className="sr-only">Open main menu</span> {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} </button> </div>
          </div>

        </div>
      </div>

      {/* --- Mobile menu --- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-40 border-t border-gray-100 max-h-[calc(100vh-4rem)] overflow-y-auto" id="mobile-menu"> {/* Added max-height and scroll */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {/* Mobile Search */}
             <div className="px-2 pb-2"><form onSubmit={handleSearchSubmit} className="relative"><input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" /><button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600" aria-label="Search"><Search className="h-5 w-5" /></button></form></div>
             {/* Core Links */}
             <NavLink to="/" className={({ isActive }) => `nav-mobile-link ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`} onClick={closeAllMenus}>Home</NavLink>
             <NavLink to="/about" className={({ isActive }) => `nav-mobile-link ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`} onClick={closeAllMenus}>About Us</NavLink>

             {/* --- SHOP Section (Mobile) --- */}
             <div className="border-t border-gray-100 pt-1 mt-1">
                {/* Top Level Shop Link */}
                <NavLink
                    to="/shop"
                    className={({ isActive }) => `nav-mobile-link font-medium ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                    onClick={closeAllMenus} // Goes directly to /shop page
                >
                    Shop All Products
                </NavLink>

                 {/* Categories Toggle Button */}
                 <button
                     onClick={toggleMobileCategories} // Toggles the category list below
                     className="nav-mobile-link flex justify-between items-center w-full"
                     aria-expanded={isCategorySubmenuOpenMobile}
                 >
                     <span>Shop By Categories</span>
                     {/* Chevron changes based on open state */}
                     {isCategorySubmenuOpenMobile ? <ChevronUp className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                 </button>

                 {/* Collapsible Category List */}
                 {isCategorySubmenuOpenMobile && (
                     <div className="pl-4 border-l-2 border-teal-100 ml-3 space-y-1 pb-2">
                          {isLoadingCategories ? (
                             <div className="nav-mobile-link !py-1 text-gray-500 italic">Loading...</div>
                          ) : categories.length > 0 ? (
                             categories.map(category => (
                                 <NavLink
                                     key={category.id}
                                     to={`/category/${category.id}`}
                                     className={({ isActive }) => `nav-mobile-link !py-1 flex items-center ${isActive ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'}`}
                                     onClick={closeAllMenus} // Close menu when category is clicked
                                 >
                                     {category.icon && <span className="mr-2 text-lg">{category.icon}</span>}
                                     {category.name}
                                 </NavLink>
                             ))
                         ) : (
                             <div className="nav-mobile-link !py-1 text-gray-500 italic">No categories.</div>
                         )}
                     </div>
                 )}
             </div>
              {/* --- End SHOP Section (Mobile) --- */}

             {/* Other Links */}
             <NavLink to="/faq" className={({ isActive }) => `nav-mobile-link ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`} onClick={closeAllMenus}>FAQs</NavLink>
             <NavLink to="/contact" className={({ isActive }) => `nav-mobile-link ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`} onClick={closeAllMenus}>Contact Us</NavLink>

             {/* Mobile Social Links */}
             <div className="border-t border-gray-100 pt-4 mt-4"> <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Follow Us</p> <div className="flex space-x-4 px-3"> {socialNavLinks.map(link => ( <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel} className={`p-1 text-gray-500 ${link.hoverColorClass} transition-colors`}> <link.icon className="h-6 w-6" /> </a> ))} </div> </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Add base style for mobile nav links in index.css if needed
/*
@layer components {
  .nav-mobile-link {
    @apply block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50;
  }
}
*/

// Optional: Add custom scrollbar styles to index.css if desired
/*
@layer utilities {
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
}
*/