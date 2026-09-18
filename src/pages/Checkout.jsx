import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Package, Lock } from 'lucide-react';

export function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    pinCode: '',
    street: '',
    city: '',
    state: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + deliveryFee;

  if (cart.length === 0 && step !== 4) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (Object.values(address).some(v => !v)) {
      alert("Please fill all address fields");
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'card' && Object.values(cardDetails).some(v => !v)) {
      alert("Please fill all card details");
      return;
    }
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        total,
        items: cart,
        shippingAddress: address,
        paymentMethod
      };
      const newOrder = await OrderService.placeOrder(orderData);
      clearCart();
      navigate('/checkout/success', { state: { orderId: newOrder.id } });
    } catch (error) {
      console.error("Order placement failed", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Address', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: CheckCircle }
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-8 text-center">Checkout</h1>

      {/* Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isActive || isCompleted 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium mt-2 absolute top-12 ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {step === 1 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Delivery Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Full Name" 
                    value={address.fullName} 
                    onChange={e => setAddress({...address, fullName: e.target.value})} 
                    required
                  />
                  <Input 
                    placeholder="Mobile Number" 
                    type="tel"
                    value={address.phone} 
                    onChange={e => setAddress({...address, phone: e.target.value})} 
                    required
                  />
                </div>
                <Input 
                  placeholder="Street Address, Flat, House No." 
                  value={address.street} 
                  onChange={e => setAddress({...address, street: e.target.value})} 
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input 
                    placeholder="City" 
                    value={address.city} 
                    onChange={e => setAddress({...address, city: e.target.value})} 
                    required
                  />
                  <Input 
                    placeholder="State" 
                    value={address.state} 
                    onChange={e => setAddress({...address, state: e.target.value})} 
                    required
                  />
                  <Input 
                    placeholder="PIN Code" 
                    value={address.pinCode} 
                    onChange={e => setAddress({...address, pinCode: e.target.value})} 
                    required
                  />
                </div>
                <Button type="submit" className="w-full md:w-auto mt-6">Continue to Payment</Button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4 mb-6">
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="text-primary-600" />
                    <span className="ml-3 font-medium flex items-center gap-2"><CreditCard className="w-5 h-5"/> Credit / Debit Card</span>
                  </label>
                  
                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                      <Input placeholder="Card Number" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} required/>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} required/>
                        <Input placeholder="CVV" type="password" value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} required/>
                      </div>
                      <Input placeholder="Name on Card" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} required/>
                    </div>
                  )}

                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="text-primary-600" />
                    <span className="ml-3 font-medium">UPI</span>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-primary-600" />
                    <span className="ml-3 font-medium">Cash on Delivery</span>
                  </label>
                </div>
                
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" className="flex-1">Review Order</Button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
              
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Delivery Address</h3>
                  <button onClick={() => setStep(1)} className="text-sm text-primary-600 hover:underline">Edit</button>
                </div>
                <p className="font-medium">{address.fullName}</p>
                <p className="text-sm text-gray-500">{address.street}, {address.city}, {address.state} - {address.pinCode}</p>
                <p className="text-sm text-gray-500">{address.phone}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Payment Method</h3>
                  <button onClick={() => setStep(2)} className="text-sm text-primary-600 hover:underline">Edit</button>
                </div>
                <p className="text-sm font-medium uppercase">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Items ({cart.length})</h3>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={`${item.id}-${JSON.stringify(item.selectedVariant)}`} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover"/>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-medium text-sm">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button 
                  onClick={handlePlaceOrder} 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (
                    <>
                      <Lock className="w-4 h-4" /> Place Order & Pay ₹{Math.floor(total)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl sticky top-24">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 dark:text-gray-100">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-gray-900 dark:text-gray-100">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">₹{Math.floor(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
