import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [viewedIds, setViewedIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('trendwheel_recently_viewed');
    if (saved) {
      try {
        setViewedIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recently viewed', e);
      }
    }
  }, []);

  const addViewedProduct = (productId) => {
    if (!productId) return;
    
    setViewedIds((prev) => {
      // Remove if it exists to push to front
      const filtered = prev.filter(id => id !== productId);
      const updated = [productId, ...filtered].slice(0, 10);
      localStorage.setItem('trendwheel_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setViewedIds([]);
    localStorage.removeItem('trendwheel_recently_viewed');
  };

  return (
    <RecentlyViewedContext.Provider value={{ viewedIds, addViewedProduct, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);
