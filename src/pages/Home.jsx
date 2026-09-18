import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductService, CategoryService } from '../services/api';
import { ProductCard } from '../components/ui/ProductCard';
import { CategoryCard } from '../components/ui/CategoryCard';
import { Button } from '../components/ui/Button';
import { ProductCardSkeleton } from '../components/ui/LoadingSkeleton';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Clock } from 'lucide-react';
import { RecentlyViewed } from '../components/ui/RecentlyViewed';

export function Home() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [allProducts, allCategories] = await Promise.all([
          ProductService.getAllProducts(),
          CategoryService.getCategories()
        ]);
        
        // Mock data logic
        setTrendingProducts(allProducts.filter(p => p.isTrending).slice(0, 4));
        setNewArrivals(allProducts.filter(p => p.isNew).slice(0, 4));
        setCategories(allCategories.slice(0, 6)); // Show first 6 categories
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-gray-900 overflow-hidden">
        <img 
          src="/images/hero.jpg" 
          alt="Hero Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        
        <div className="relative h-full container mx-auto px-4 lg:px-8 flex flex-col justify-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            Discover What's <span className="text-primary-500">Trending</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl">
            Shop the latest styles, essentials and everyday favorites. Premium fashion that moves with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">Shop Now</Button>
            </Link>
            <Link to="/products?category=new">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg text-white border-white hover:bg-white hover:text-black">
                Explore Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Find exactly what you're looking for</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {loading 
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/5] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />)
            : categories.map(cat => <CategoryCard key={cat.id} category={cat} />)
          }
        </div>
      </section>

      {/* 3. Flash Deals / Offers */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="bg-primary-600 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="relative p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div className="max-w-xl">
              <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-white/30">
                LIMITED TIME OFFER
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">End of Season Sale</h2>
              <p className="text-primary-100 text-lg mb-8">Get up to 50% off on all exclusive styles. Don't miss out on these flash deals.</p>
              
              <div className="flex gap-4 mb-8">
                {['12', '45', '30'].map((time, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-white text-primary-900 dark:bg-white dark:text-primary-900 text-2xl md:text-3xl font-bold w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center shadow-lg">
                      {time}
                    </div>
                    <span className="text-xs mt-2 uppercase font-semibold text-white dark:text-white">
                      {['Hours', 'Minutes', 'Seconds'][i]}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/products?discount=50">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 dark:bg-white dark:text-primary-700 dark:hover:bg-gray-200 font-bold px-8">
                  Shop Deals Now
                </Button>
              </Link>
            </div>
            
            <div className="hidden lg:block w-1/3 relative h-64">
              <img 
                src="/images/hero.jpg" 
                alt="Sale" 
                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl transform rotate-3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending Products */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">What everyone is buying right now</p>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {loading 
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : trendingProducts.map(product => <ProductCard key={product.id} product={product} />)
          }
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="container mx-auto px-4 lg:px-8 bg-gray-50 dark:bg-gray-900/50 py-16 rounded-3xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">New Arrivals</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Fresh styles just landed</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {loading 
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : newArrivals.map(product => <ProductCard key={product.id} product={product} />)
          }
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* 6. Why Trend Wheel? */}
      <section className="container mx-auto px-4 lg:px-8 border-t border-gray-200 dark:border-gray-800 pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">100% secure payment with advanced encryption.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Free express delivery on orders over ₹1000.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">30-day hassle-free return policy on all items.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Round the clock dedicated customer support.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
