import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotification();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

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
            <Link to="/" className="flex items-center gap-2 group">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-500 group-hover:rotate-180 transition-transform duration-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
              <span className="text-xl md:text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
                TREND<span className="text-primary-600 dark:text-primary-500">WHEEL</span>
              </span>
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
            
            {/* Notifications */}
            {user && (
              <div className="relative hidden sm:block">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs font-medium text-primary-600 hover:text-primary-700">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 10).map(notif => (
                          <div 
                            key={notif.id} 
                            className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${!notif.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                            onClick={() => {
                              markAsRead(notif.id);
                              setIsNotifOpen(false);
                            }}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                {notif.title}
                              </h4>
                              <button onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }} className="text-gray-400 hover:text-red-500">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                            <span className="text-[10px] text-gray-400 mt-2 block">
                              {new Date(notif.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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
