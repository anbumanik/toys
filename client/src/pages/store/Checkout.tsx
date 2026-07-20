import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment, OrderPayload } from '../../api/orders';
import { getFinalPrice } from '../../utils/price';
import { loadRazorpay } from '../../utils/loadRazorpay';
import { ShoppingCart, User, MapPin, CreditCard, ChevronRight, AlertCircle, Loader } from 'lucide-react';

export default function Checkout() {
  const { user, openAuthModal } = useAuth();
  const { items, totalPrice, totalShipping, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    houseNo: '',
    street: '',
    landmark: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If cart is empty, go back
  useEffect(() => {
    if (items.length === 0 && !loading) {
      navigate('/cart');
    }
  }, [items, navigate, loading]);

  const taxPrice = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + taxPrice + totalShipping;

  const handleField = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: OrderPayload = {
        orderItems: items.map(item => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.images?.[0]?.thumbnailUrl || '',
          price: getFinalPrice(item.product),
          product: item.product._id!
        })),
        deliveryAddress: address,
        paymentMethod: 'Razorpay',
        itemsPrice: totalPrice,
        taxPrice: taxPrice,
        shippingPrice: totalShipping,
        totalPrice: grandTotal,
        orderNotes
      };

      // 1. Create order in MongoDB
      const orderRes = await createOrder(payload);
      const orderId = orderRes.data._id;
      
      // 2. Load Razorpay script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // 3. Create Razorpay order
      const rzpOrder = await createRazorpayOrder(orderId);

      // 4. Open Razorpay Checkout Modal
      const options = {
        key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'ChildToys Store',
        description: 'Order Payment',
        order_id: rzpOrder.id,
        handler: async function (response: any) {
          try {
            // 5. Verify Signature on backend
            await verifyRazorpayPayment(orderId, response);
            clearCart();
            navigate('/order-success');
          } catch (err) {
            setError('Payment verification failed.');
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || ''
        },
        theme: {
          color: '#2563EB'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setError('Payment cancelled. You can try again.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setLoading(false);
        setError(response.error.description || 'Payment failed');
      });
      rzp.open();
      
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 bg-gray-50">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-sm">
          <User size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: 'Outfit' }}>Please Login to Continue</h2>
        <p className="text-gray-500 mb-8 text-lg text-center max-w-md">You need an account to securely place an order and track its progress.</p>
        <button 
          onClick={openAuthModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-300"
        >
          Login / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-6">
          <Link to="/cart" className="hover:text-blue-600">Cart</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900">Checkout</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8" style={{ fontFamily: 'Outfit' }}>Checkout</h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex gap-3 items-center">
            <AlertCircle size={20} />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Forms */}
          <div className="lg:w-2/3">
            
            {/* 1. Contact Information */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <User className="text-blue-600" /> 1. Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                  <input type="text" readOnly value={user.name} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
                  <input type="email" readOnly value={user.email} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number *</label>
                  <input type="text" readOnly value={user.phone || 'Not provided'} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4 font-medium">* Logged in securely as {user.email}</p>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-blue-600" /> 2. Delivery Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">House / Flat No *</label>
                  <input required type="text" value={address.houseNo} onChange={e => handleField('houseNo', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Street Address *</label>
                  <input required type="text" value={address.street} onChange={e => handleField('street', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Landmark</label>
                  <input type="text" value={address.landmark} onChange={e => handleField('landmark', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Area / Locality *</label>
                  <input required type="text" value={address.area} onChange={e => handleField('area', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City *</label>
                  <input required type="text" value={address.city} onChange={e => handleField('city', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">State *</label>
                  <input required type="text" value={address.state} onChange={e => handleField('state', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pincode *</label>
                  <input required type="text" value={address.pincode} onChange={e => handleField('pincode', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Country</label>
                  <input readOnly value="India" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium" />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="text-blue-600" /> 3. Payment Method
              </h2>
              <label className="flex items-center gap-4 p-5 border-2 border-blue-600 bg-blue-50/50 rounded-2xl cursor-pointer hover:bg-blue-50 transition">
                <div className="w-6 h-6 rounded-full border-4 border-blue-600 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block text-lg">Razorpay</span>
                  <span className="text-sm text-gray-500 font-medium">UPI / Card / Net Banking / Wallet</span>
                </div>
                <div className="ml-auto flex gap-2">
                  <img src="https://cdn.razorpay.com/logo.svg" alt="Razorpay" className="h-6" />
                </div>
              </label>
            </div>

            {/* 4. Additional Notes */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">Order Notes (Optional)</h2>
              <textarea 
                rows={3} 
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                placeholder="Any special instructions for delivery?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
              />
            </div>
            
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
                <ShoppingCart className="text-blue-600" /> Order Summary
              </h2>
              
              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {product.images?.[0] ? (
                        <img src={product.images[0].thumbnailUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingCart size={20} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{product.name}</h4>
                      <div className="text-xs text-gray-500 mt-0.5">Qty: {quantity}</div>
                    </div>
                    <div className="font-extrabold text-gray-900">
                      ₹{(getFinalPrice(product) * quantity).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="border-t border-gray-100 pt-6 space-y-4 text-gray-600 mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Price Details</h3>
                <div className="flex justify-between font-medium">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-bold text-gray-900">₹{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Shipping Fee</span>
                  <span className={`font-bold ${totalShipping > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                    {totalShipping > 0 ? `₹${totalShipping.toFixed(0)}` : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Tax (Estimated 18%)</span>
                  <span className="font-bold text-gray-900">₹{taxPrice.toFixed(0)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-8 bg-blue-50/50 -mx-6 sm:-mx-8 px-6 sm:px-8 pb-6 rounded-b-3xl mt-[-1.5rem]">
                <div className="flex justify-between items-end pt-6">
                  <span className="font-extrabold text-gray-900 text-lg">Grand Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-blue-600 leading-none">₹{grandTotal.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white h-14 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-orange-300"
              >
                {loading ? <Loader className="animate-spin" size={24} /> : 'Place Order securely'}
              </button>
              
              <div className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
                🔒 Secured by Razorpay
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
