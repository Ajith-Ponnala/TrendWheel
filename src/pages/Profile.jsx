import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, MapPin, Package, Heart, LogOut, Settings, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export function Profile() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: '/profile' } }} replace />;
  }

  const sections = [
    { title: 'My Orders', icon: Package, path: '/orders', desc: 'Track, return or buy things again' },
    { title: 'Wishlist', icon: Heart, path: '/wishlist', desc: 'Your saved items' },
    { title: 'Saved Addresses', icon: MapPin, path: '/profile/addresses', desc: 'Edit addresses for orders' },
    { title: 'Payment Methods', icon: CreditCard, path: '/profile/payments', desc: 'Manage payment options' },
    { title: 'Notifications', icon: Bell, path: '/profile/notifications', desc: 'Manage your alerts' },
    { title: 'Account Settings', icon: Settings, path: '/profile/settings', desc: 'Edit personal info' }
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-8">My Account</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10" />
            </div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{user.email}</p>
            
            <div className="w-full space-y-3">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="w-full mb-3 border-primary-600 text-primary-600 hover:bg-primary-50">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <Link 
                  key={idx} 
                  to={section.path}
                  className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
