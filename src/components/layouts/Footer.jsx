import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div>
            <Link to="/" className="text-2xl font-black text-white tracking-tighter mb-6 block">
              TREND<span className="text-primary-500">WHEEL</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your ultimate destination for modern, premium fashion. Discover the latest trends with unbeatable quality.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">FB</a>
              <a href="#" className="hover:text-white transition-colors">IG</a>
              <a href="#" className="hover:text-white transition-colors">TW</a>
              <a href="#" className="hover:text-white transition-colors">YT</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Information</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Newsletter</h4>
            <p className="text-sm mb-4">Stay ahead of the trends. Subscribe to our newsletter.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-primary-500 text-white placeholder-gray-500 text-sm"
              />
              <button 
                type="submit" 
                className="bg-primary-600 text-white px-4 py-2 rounded-r-lg font-medium hover:bg-primary-700 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>&copy; {new Date().getFullYear()} Trend Wheel. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>100% Secure Shopping</span>
            <span>•</span>
            <span>Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
