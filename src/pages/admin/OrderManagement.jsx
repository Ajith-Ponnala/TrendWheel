import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { OrderService } from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Search, Eye } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../context/NotificationContext';

export function OrderManagement() {
  const { isAdmin } = useAuth();
  const { addPersistentNotification } = useNotification();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isAdmin) {
      OrderService.getOrders().then(setOrders);
    }
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/" replace />;

  const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || (o.shippingAddress?.fullName || '').toLowerCase().includes(search.toLowerCase()));

  const handleStatusChange = (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const validFlow = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'OutForDelivery', 'Delivered'];
    let updatedTracking = { ...(order.tracking || {}) };
    const now = new Date().toISOString();

    if (newStatus === 'Cancelled') {
      updatedTracking.Cancelled = { completed: true, timestamp: now };
    } else {
      const targetIndex = validFlow.indexOf(newStatus);
      validFlow.forEach((stage, idx) => {
        if (idx <= targetIndex) {
          if (!updatedTracking[stage]?.completed) {
            updatedTracking[stage] = { completed: true, timestamp: now };
          }
        }
      });
    }

    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus, tracking: updatedTracking } : o);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    addPersistentNotification({
      title: 'Order Status Updated',
      message: `Your order #${orderId} is now ${newStatus}.`,
      type: newStatus === 'Delivered' ? 'success' : newStatus === 'Cancelled' ? 'error' : 'info',
      orderId: orderId
    });
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h2>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search orders by ID or customer..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10 h-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.shippingAddress?.fullName || 'Customer'}</td>
                  <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">₹{order.total}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 focus:ring-2 focus:ring-primary-500 cursor-pointer ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'Shipped' || order.status === 'OutForDelivery' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="OutForDelivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
