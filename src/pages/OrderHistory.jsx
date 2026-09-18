import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OrderService } from '../services/api';
import { Package, ChevronRight } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';

export function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await OrderService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: '/orders' } }} replace />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Processing':
      case 'Confirmed': return 'warning';
      case 'Shipped': return 'primary';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState 
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders yet."
          action={<Link to="/products" className="text-primary-600 font-medium hover:underline">Start Shopping</Link>}
        />
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Order Placed</span>
                    <span className="font-medium">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Total</span>
                    <span className="font-medium">₹{order.total}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Order ID</span>
                    <span className="font-medium">{order.id}</span>
                  </div>
                </div>
                <div>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      {item.images && item.images[0] ? (
                        <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover"/>
                        </div>
                      ) : (
                        <div className="w-20 h-24 bg-gray-200 dark:bg-gray-800 rounded-lg shrink-0 flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <Link to={`/products/${item.productId || item.id}`} className="font-medium hover:text-primary-600 line-clamp-1 mb-1">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mb-2">
                          Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                          <button className="text-sm font-medium text-primary-600 hover:underline">Buy Again</button>
                          <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:underline">View Item</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
