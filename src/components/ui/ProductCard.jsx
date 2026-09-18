import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Badge } from './Badge';

export function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (product.sizes && product.sizes.length > 0) {
      // If requires size, navigating to product page is better, or select default size
      // For quick add, if sizes exist but none selected, we can add default or show toast
      addToCart(product, 1, product.sizes[0]);
    } else {
      addToCart(product);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <Link to={`/products/${product.id}`} className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
      
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          style={product.imgFilter ? { filter: product.imgFilter } : {}}
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount > 0 && (
            <Badge variant="danger">{product.discount}% OFF</Badge>
          )}
          {product.isNew && (
            <Badge variant="primary">NEW</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors shadow-sm"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
          <button 
            onClick={handleQuickAdd}
            className="w-full bg-white text-gray-900 font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{product.brand}</div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price}</span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <span className="text-yellow-500">★</span>
            {product.rating} ({product.reviewCount})
          </div>
        </div>
      </div>
    </Link>
  );
}
