import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Clock, PackageX } from 'lucide-react';
import { ProductService } from '../services/api';
import { ProductCard } from '../components/ui/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const data = await ProductService.searchProducts(searchQuery);
      setResults(data);
      
      // Save to recent searches
      const updatedSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      // Update URL
      setSearchParams({ q: searchQuery });
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={onSubmit} className="relative">
          <Input 
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands and categories..."
            className="w-full h-14 pl-12 pr-4 text-lg rounded-2xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            autoFocus
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl">
            Search
          </Button>
        </form>

        {!initialQuery && recentSearches.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4"/> Recent Searches</h3>
              <button onClick={clearRecent} className="text-sm text-gray-500 hover:text-red-500">Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(term);
                    handleSearch(term);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {initialQuery && (
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Search results for "{initialQuery}" <span className="text-gray-500 font-normal text-sm ml-2">({results.length} products)</span>
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={PackageX}
              title="No products found"
              description="Try different keywords or browse our categories."
              action={
                <Button onClick={() => {setQuery(''); setSearchParams({});}}>Clear Search</Button>
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
