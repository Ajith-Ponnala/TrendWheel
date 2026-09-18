import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductService } from '../services/api';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Filter, SlidersHorizontal, PackageX, ChevronDown } from 'lucide-react';

export function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Filters State
  const [filters, setFilters] = useState({
    brands: [],
    priceRanges: [],
    rating: 0,
    discount: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data;
        if (initialCategory && initialCategory !== 'new') {
          data = await ProductService.getProductsByCategory(initialCategory);
        } else {
          data = await ProductService.getAllProducts();
        }
        
        if (initialCategory === 'new') {
          data = data.filter(p => p.isNew);
        }
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [initialCategory]);

  const allBrands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))];
  }, [products]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      if (type === 'rating' || type === 'discount') {
        return { ...prev, [type]: prev[type] === value ? 0 : value };
      }
      
      const list = prev[type];
      if (list.includes(value)) {
        return { ...prev, [type]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...list, value] };
      }
    });
  };

  const clearFilters = () => {
    setFilters({ brands: [], priceRanges: [], rating: 0, discount: 0 });
  };

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }
    if (filters.rating > 0) {
      result = result.filter(p => p.rating >= filters.rating);
    }
    if (filters.discount > 0) {
      result = result.filter(p => p.discount >= filters.discount);
    }
    if (filters.priceRanges.length > 0) {
      result = result.filter(p => {
        return filters.priceRanges.some(range => {
          if (range === 'under500') return p.price < 500;
          if (range === '500to1000') return p.price >= 500 && p.price <= 1000;
          if (range === '1000to2000') return p.price > 1000 && p.price <= 2000;
          if (range === 'above2000') return p.price > 2000;
          return true;
        });
      });
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => b.discount - a.discount);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [products, filters, sortBy]);

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`space-y-8 ${isMobile ? 'p-4' : ''}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2"><Filter className="w-4 h-4"/> Filters</h3>
        <button onClick={clearFilters} className="text-sm text-primary-600 hover:underline">Clear All</button>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-medium text-sm mb-3 uppercase tracking-wider text-gray-500">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allBrands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={filters.brands.includes(brand)}
                onChange={() => handleFilterChange('brands', brand)}
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="font-medium text-sm mb-3 uppercase tracking-wider text-gray-500">Price</h4>
        <div className="space-y-2">
          {[
            { id: 'under500', label: 'Under ₹500' },
            { id: '500to1000', label: '₹500 - ₹1000' },
            { id: '1000to2000', label: '₹1000 - ₹2000' },
            { id: 'above2000', label: 'Above ₹2000' }
          ].map(range => (
            <label key={range.id} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={filters.priceRanges.includes(range.id)}
                onChange={() => handleFilterChange('priceRanges', range.id)}
              />
              <span className="text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-medium text-sm mb-3 uppercase tracking-wider text-gray-500">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio"
                name="rating"
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={filters.rating === rating}
                onChange={() => handleFilterChange('rating', rating)}
              />
              <span className="text-sm flex items-center gap-1">{rating} <span className="text-yellow-500">★</span> & above</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Discount Filter */}
      <div>
        <h4 className="font-medium text-sm mb-3 uppercase tracking-wider text-gray-500">Discount</h4>
        <div className="space-y-2">
          {[10, 20, 30, 50].map(discount => (
            <label key={discount} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="discount"
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={filters.discount === discount}
                onChange={() => handleFilterChange('discount', discount)}
              />
              <span className="text-sm">{discount}% and above</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      
      {/* Header & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold capitalize">
            {initialCategory === 'new' ? 'New Arrivals' : initialCategory || 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Showing {filteredProducts.length} products</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden flex items-center gap-2 text-sm font-medium border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2"
            onClick={() => setShowMobileFilters(true)}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="discount">Discount</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <FilterSidebar />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white dark:bg-gray-900 shadow-xl flex flex-col h-full animate-in slide-in-from-right">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-primary-600 font-medium">Done</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterSidebar isMobile />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={PackageX}
              title="No products found"
              description="We couldn't find any products matching your current filters."
              action={<button onClick={clearFilters} className="text-primary-600 font-medium hover:underline">Clear Filters</button>}
            />
          )}
        </div>
      </div>
    </div>
  );
}
