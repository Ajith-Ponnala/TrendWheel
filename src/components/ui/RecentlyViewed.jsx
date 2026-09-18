import React, { useEffect, useState } from 'react';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { ProductService } from '../../services/api';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './LoadingSkeleton';

export function RecentlyViewed() {
  const { viewedIds, clearRecentlyViewed } = useRecentlyViewed();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (viewedIds.length === 0) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await ProductService.getAllProducts();
        // Map to keep the order of viewedIds
        const validProducts = viewedIds
          .map(id => allProducts.find(p => p.id === id))
          .filter(Boolean); // removes nulls if a product was deleted
        
        setProducts(validProducts);
      } catch (error) {
        console.error("Failed to fetch recently viewed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [viewedIds]);

  if (viewedIds.length === 0 || products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 lg:px-8 pt-8 pb-16 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recently Viewed</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Products you recently checked out</p>
        </div>
        <button 
          onClick={clearRecentlyViewed}
          className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {loading 
          ? Array.from({ length: Math.min(viewedIds.length, 5) }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map(product => <ProductCard key={`rv-${product.id}`} product={product} />)
        }
      </div>
    </section>
  );
}
