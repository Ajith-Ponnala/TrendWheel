import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Package, Lock, ShieldCheck, QrCode } from 'lucide-react';

export function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(''); // '', 'processing', 'authenticating', 'success'
  
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
  const [upiId, setUpiId] = useState('');
  const [codConfirmed, setCodConfirmed] = useState(false);
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + deliveryFee;

  if (cart.length === 0 && step !== 4) {
    navigate('/cart');
    return null;
  }

  const validateAddress = () => {
    const newErrors = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!/^\d{10}$/.test(address.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!/^\d{6}$/.test(address.pinCode)) newErrors.pinCode = 'Enter a valid 6-digit PIN code';
    if (!address.street.trim()) newErrors.street = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (paymentMethod === 'card') {
      const cleanCard = cardDetails.number.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleanCard)) newErrors.number = 'Enter a valid 16-digit card number';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) newErrors.expiry = 'Use MM/YY format';
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) newErrors.cvv = 'Invalid CVV';
      if (!cardDetails.name.trim()) newErrors.name = 'Name on card is required';
    } else if (paymentMethod === 'upi') {
      if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) newErrors.upi = 'Enter a valid UPI ID (e.g., name@bank)';
    } else if (paymentMethod === 'cod') {
      if (!codConfirmed) newErrors.cod = 'Please confirm you will pay on delivery';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setErrors({});
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setErrors({});
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    // Simulate Payment Gateway Overlay
    setPaymentStatus('processing');
    await new Promise(r => setTimeout(r, 1500));
    
    if (paymentMethod !== 'cod') {
      setPaymentStatus('authenticating');
      await new Promise(r => setTimeout(r, 2000));
    }
    
    setPaymentStatus('success');
    await new Promise(r => setTimeout(r, 1000));

    try {
      const orderData = {
        total,
        items: cart, // The cart items already contain imgFilter, sizes, colors, etc.
        shippingAddress: address,
        paymentMethod
      };
      
      const newOrder = await OrderService.placeOrder(orderData);
      clearCart();
      navigate('/checkout/success', { state: { orderId: newOrder.id } });
    } catch (error) {
      console.error("Order placement failed", error);
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setLoading(false);
      setPaymentStatus('');
    }
  };

  const steps = [
    { id: 1, name: 'Address', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: CheckCircle }
  ];

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i=0, len=match.length; i<len; i+=4) {
      parts.push(match.substring(i, i+4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      v = v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh] relative">
      
      {/* Payment Gateway Modal Overlay */}
      {paymentStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
            {paymentStatus === 'success' ? (
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
            ) : (
              <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                {paymentStatus === 'authenticating' ? <ShieldCheck className="w-8 h-8 text-primary-600" /> : <CreditCard className="w-8 h-8 text-primary-600" />}
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {paymentStatus === 'processing' && 'Processing Payment...'}
              {paymentStatus === 'authenticating' && 'Authenticating with Bank...'}
              {paymentStatus === 'success' && 'Order is successful'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {paymentStatus !== 'success' ? 'Please do not close this window or press back.' : 'Redirecting to order confirmation...'}
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-8 text-center">Checkout</h1>

      {/* Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s) => {
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
                <span className={`text-xs font-medium mt-2 absolute top-12 whitespace-nowrap ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
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
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-600"/> Delivery Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input 
                      placeholder="Enter full name" 
                      value={address.fullName} 
                      onChange={e => setAddress({...address, fullName: e.target.value})} 
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mobile Number</label>
                    <Input 
                      placeholder="10-digit mobile number" 
                      type="tel"
                      maxLength={10}
                      value={address.phone} 
                      onChange={e => setAddress({...address, phone: e.target.value.replace(/\D/g,'')})} 
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <Input 
                    placeholder="House No, Building, Street, Area" 
                    value={address.street} 
                    onChange={e => setAddress({...address, street: e.target.value})} 
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input 
                      placeholder="City/District" 
                      value={address.city} 
                      onChange={e => setAddress({...address, city: e.target.value})} 
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <Input 
                      placeholder="State" 
                      value={address.state} 
                      onChange={e => setAddress({...address, state: e.target.value})} 
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PIN Code</label>
                    <Input 
                      placeholder="6-digit PIN" 
                      maxLength={6}
                      value={address.pinCode} 
                      onChange={e => setAddress({...address, pinCode: e.target.value.replace(/\D/g,'')})} 
                    />
                    {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 mt-4 text-base">Deliver to this Address</Button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary-600"/> Payment Method</h2>
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4 mb-8">
                  
                  {/* Credit/Debit Card */}
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => { setPaymentMethod('card'); setErrors({}); }} className="text-primary-600 w-4 h-4" />
                    <span className="ml-3 font-medium flex flex-1 items-center justify-between">
                      Credit / Debit Card
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-600 rounded"></div>
                        <div className="w-8 h-5 bg-red-500 rounded"></div>
                      </div>
                    </span>
                  </label>
                  
                  {paymentMethod === 'card' && (
                    <div className="p-5 bg-gray-50 dark:bg-gray-800/30 rounded-xl space-y-4 animate-in slide-in-from-top-2 ml-7 border border-gray-100 dark:border-gray-800">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500">Card Number</label>
                        <Input placeholder="0000 0000 0000 0000" maxLength={19} value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})} />
                        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-500">Valid Thru (MM/YY)</label>
                          <Input placeholder="MM/YY" maxLength={5} value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: formatExpiry(e.target.value)})} />
                          {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-500">CVV</label>
                          <Input placeholder="123" type="password" maxLength={4} value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g,'')})} />
                          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500">Name on Card</label>
                        <Input placeholder="John Doe" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                    </div>
                  )}

                  {/* UPI */}
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => { setPaymentMethod('upi'); setErrors({}); }} className="text-primary-600 w-4 h-4" />
                    <span className="ml-3 font-medium">UPI (GPay, PhonePe, Paytm)</span>
                  </label>
                  
                  {paymentMethod === 'upi' && (
                    <div className="p-5 bg-gray-50 dark:bg-gray-800/30 rounded-xl space-y-4 animate-in slide-in-from-top-2 ml-7 border border-gray-100 dark:border-gray-800">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1 w-full">
                          <label className="block text-xs font-medium mb-1 text-gray-500">Enter UPI ID</label>
                          <Input placeholder="username@bank" value={upiId} onChange={e => setUpiId(e.target.value.toLowerCase())} />
                          {errors.upi && <p className="text-red-500 text-xs mt-1">{errors.upi}</p>}
                        </div>
                        <div className="hidden md:flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                          <QrCode className="w-16 h-16 text-gray-800 dark:text-gray-200 mb-1" />
                          <span className="text-[10px] text-gray-500">Scan to Pay</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Cash on Delivery */}
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => { setPaymentMethod('cod'); setErrors({}); }} className="text-primary-600 w-4 h-4" />
                    <span className="ml-3 font-medium">Cash on Delivery</span>
                  </label>

                  {paymentMethod === 'cod' && (
                    <div className="p-5 bg-gray-50 dark:bg-gray-800/30 rounded-xl space-y-4 animate-in slide-in-from-top-2 ml-7 border border-gray-100 dark:border-gray-800">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="mt-1 w-4 h-4 rounded text-primary-600" checked={codConfirmed} onChange={e => setCodConfirmed(e.target.checked)}/>
                        <span className="text-sm text-gray-700 dark:text-gray-300">I confirm that I will pay the total amount of ₹{total} in cash upon delivery.</span>
                      </label>
                      {errors.cod && <p className="text-red-500 text-xs mt-1">{errors.cod}</p>}
                    </div>
                  )}

                </div>
                
                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="h-12 w-24" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" className="flex-1 h-12 text-base">Review Order</Button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
              
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Delivery Address</h3>
                  <button onClick={() => setStep(1)} className="text-sm font-medium text-primary-600 hover:underline">Edit</button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">{address.fullName}</p>
                  <p className="text-gray-600 dark:text-gray-400">{address.street}, {address.city}, {address.state} - {address.pinCode}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Phone: {address.phone}</p>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Payment Method</h3>
                  <button onClick={() => setStep(2)} className="text-sm font-medium text-primary-600 hover:underline">Edit</button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-sm flex items-center gap-3">
                  {paymentMethod === 'card' && <CreditCard className="w-5 h-5 text-gray-500" />}
                  {paymentMethod === 'upi' && <QrCode className="w-5 h-5 text-gray-500" />}
                  {paymentMethod === 'cod' && <Package className="w-5 h-5 text-gray-500" />}
                  <span className="font-medium text-gray-900 dark:text-white uppercase">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? `UPI (${upiId})` : `Card ending in ${cardDetails.number.slice(-4) || '****'}`}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-between">
                  <span>Order Items ({cart.length})</span>
                </h3>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={`${item.id}-${JSON.stringify(item.selectedVariant)}`} className="flex gap-4 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
                      <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          style={item.imgFilter ? { filter: item.imgFilter } : {}}
                        />
                      </div>
                      <div className="flex-1 py-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">{item.name}</p>
                        <p className="text-xs text-gray-500 mb-2">
                          Qty: {item.quantity} 
                          {item.selectedVariant?.size && ` • Size: ${item.selectedVariant.size}`} 
                          {item.selectedVariant?.color && ` • Color: ${item.selectedVariant.color}`}
                        </p>
                        <div className="font-bold text-sm text-gray-900 dark:text-white">₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 border-t border-gray-200 dark:border-gray-800 pt-6">
                <Button type="button" variant="outline" className="h-14 w-24" onClick={() => setStep(2)}>Back</Button>
                <Button 
                  onClick={handlePlaceOrder} 
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white h-14 text-base font-bold shadow-lg flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <Lock className="w-4 h-4" /> Place Order & Pay ₹{Math.floor(total)}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl sticky top-24">
            <h3 className="text-lg font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Order Summary</h3>
            <div className="space-y-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
            </div>
            
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mb-6 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <div className="text-xs text-primary-800 dark:text-primary-300">
                <span className="font-bold block mb-0.5">Secure Transaction</span>
                Your payment and personal details are encrypted and securely transmitted.
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{Math.floor(total)}</span>
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">Inclusive of all taxes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
