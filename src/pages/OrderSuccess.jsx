import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-center max-w-lg w-full">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order is successful</h1>
        <p className="text-gray-500 mb-8">Thank you for shopping with Trend Wheel. Your order has been successfully placed.</p>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 text-left">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="font-semibold text-gray-900 dark:text-white">{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Estimated Delivery</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/orders" className="flex-1">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Package className="w-4 h-4" /> View Order
            </Button>
          </Link>
          <Link to="/products" className="flex-1">
            <Button className="w-full flex items-center justify-center gap-2">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
