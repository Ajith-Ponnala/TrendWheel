import React from 'react';
import { Link } from 'react-router-dom';

export function CategoryCard({ category }) {
  return (
    <Link 
      to={`/products?category=${category.id}`} 
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5]"
    >
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <img 
        src={category.image} 
        alt={category.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
      
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{category.name}</h3>
        <span className="inline-block bg-white text-black px-6 py-2 rounded-full text-sm font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Shop Now
        </span>
      </div>
    </Link>
  );
}
