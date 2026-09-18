import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, ChevronRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { CouponService } from '../services/api';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { toggleWishlist } = useWishlist();
  const { addToast } = useNotification();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 100;
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount) / 100;
    } else {
      discount = appliedCoupon.discount;
    }
  }

  const total = subtotal + deliveryFee - discount;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setLoadingCoupon(true);
    try {
      const res = await CouponService.validateCoupon(couponCode);
      if (res.valid) {
        if (subtotal >= res.coupon.minOrder) {
          setAppliedCoupon(res.coupon);
          addToast('Coupon applied successfully!', 'success');
        } else {
          addToast(`Minimum order amount for this coupon is ₹${res.coupon.minOrder}`, 'error');
        }
      } else {
        addToast(res.message, 'error');
      }
    } catch (error) {
      addToast('Failed to apply coupon', 'error');
    } finally {
      setLoadingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  const handleMoveToWishlist = (item) => {
    toggleWishlist(item);
    removeFromCart(item.id, item.selectedVariant);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState 
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added anything to your bag yet."
          action={<Link to="/products"><Button>Start Shopping</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-8">Shopping Bag <span className="text-gray-500 font-normal text-sm">({cart.length} items)</span></h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={`${item.id}-${JSON.stringify(item.selectedVariant)}`} className="flex gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl relative">
                <Link to={`/products/${item.id}`} className="w-24 h-32 sm:w-32 sm:h-40 shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                
                <div className="flex flex-col flex-grow py-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{item.brand}</div>
                      <Link to={`/products/${item.id}`} className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 line-clamp-2">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">₹{item.price}</div>
                      {item.discount > 0 && (
                        <div className="text-xs text-gray-500 line-through">₹{item.originalPrice}</div>
                      )}
                    </div>
                  </div>

                  {/* Variants */}
                  <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                    {item.selectedVariant?.size && <span>Size: <strong className="text-gray-700 dark:text-gray-300">{item.selectedVariant.size}</strong></span>}
                    {item.selectedVariant?.color && <span>Color: <strong className="text-gray-700 dark:text-gray-300">{item.selectedVariant.color}</strong></span>}
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex items-center w-24 h-8 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedVariant, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="flex-1 text-center text-sm font-medium">{item.quantity}</div>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedVariant, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-xs font-medium text-gray-500 hover:text-primary-600 uppercase tracking-wider"
                      >
                        Move to Wishlist
                      </button>
                      <span className="text-gray-300 dark:text-gray-700">|</span>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedVariant)}
                        className="text-xs font-medium text-red-500 hover:text-red-600 uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl sticky top-24">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider">Order Summary</h2>
            
            {/* Coupon Section */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Tag className="w-4 h-4"/> Apply Coupon</h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg border border-green-200 dark:border-green-800/30">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span className="text-xs bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded-full">Applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs hover:underline">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input 
                    placeholder="Enter coupon code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="h-10"
                  />
                  <Button type="submit" disabled={!couponCode || loadingCoupon}>
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-gray-900 dark:text-gray-100">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span className="text-gray-900 dark:text-gray-100">₹{deliveryFee}</span>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{Math.floor(discount)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">₹{Math.floor(total)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            <Button 
              className="w-full text-base font-bold h-14 bg-primary-600 hover:bg-primary-700 flex items-center justify-center gap-2 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate('/checkout')}
            >
              Buy Now <ChevronRight className="w-5 h-5" />
            </Button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4" /> Secure checkout guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
