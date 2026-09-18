import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();

  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  const categories = [
    { name: 'Men', path: '/products?category=men' },
    { name: 'Women', path: '/products?category=women' },
    { name: 'Footwear', path: '/products?category=footwear' },
    { name: 'Accessories', path: '/products?category=accessories' },
    { name: 'Beauty', path: '/products?category=beauty' },
    { name: 'Electronics', path: '/products?category=electronics' },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-primary-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="text-2xl font-bold tracking-tighter text-primary-600 dark:text-primary-500">
              TREND WHEEL
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={cat.path}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/search" className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600">
              <Search className="h-5 w-5" />
            </Link>
            <button onClick={toggleTheme} className="hidden sm:block p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/wishlist" className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/login"} className="hidden sm:flex p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMenu} />
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-xl font-bold text-primary-600">TREND WHEEL</span>
              <button onClick={closeMenu} className="p-2 text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col px-4 gap-4">
                {categories.map((cat) => (
                  <Link 
                    key={cat.name} 
                    to={cat.path}
                    onClick={closeMenu}
                    className="text-base font-medium text-gray-800 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link to="/orders" onClick={closeMenu} className="text-base font-medium text-gray-800 dark:text-gray-200 py-2">
                  My Orders
                </Link>
                <div className="py-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dark Mode</span>
                  <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                </div>
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <Link to={user ? "/profile" : "/login"} onClick={closeMenu} className="flex items-center justify-center w-full bg-primary-600 text-white rounded-lg py-3 font-medium">
                {user ? "My Account" : "Login / Register"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
