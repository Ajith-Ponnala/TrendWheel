import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';

export function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    // Ideally open a modal for size selection if sizes exist, 
    // but for prototype, add default size or just add it.
    addToCart(product, 1, product.sizes ? product.sizes[0] : null);
    toggleWishlist(product); // Remove from wishlist
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-8">My Wishlist <span className="text-gray-500 font-normal text-sm">({wishlist.length} items)</span></h1>

      {wishlist.length === 0 ? (
        <EmptyState 
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love and find them here later."
          action={<Link to="/products"><Button>Start Shopping</Button></Link>}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {wishlist.map(product => (
            <div key={product.id} className="group flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 relative">
              <Link to={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                {product.discount > 0 && (
                  <Badge variant="danger" className="absolute top-2 left-2">{product.discount}% OFF</Badge>
                )}
              </Link>
              
              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-500 hover:text-red-500 transition-colors shadow-sm z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{product.brand}</div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{product.name}</h3>
                
                <div className="mt-auto mb-4 flex items-end gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                <Button 
                  onClick={() => handleMoveToCart(product)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Move to Bag
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
