import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getFinalPrice } from '../../utils/price';
import { Trash2, ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, totalShipping } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 bg-gray-50">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-sm">
          <ShoppingCart size={64} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: 'Outfit' }}>Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added any toys yet.</p>
        <Link 
          to="/shop" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-300 flex items-center gap-2"
        >
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[80vh] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8" style={{ fontFamily: 'Outfit' }}>Shopping Cart ({totalItems} Items)</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="lg:w-2/3 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center">
                
                {/* Image */}
                <Link to={`/product/${product.slug || product._id}`} className="w-32 h-32 bg-[#F8FAFC] rounded-2xl flex items-center justify-center p-2 shrink-0 overflow-hidden group">
                  {product.images?.[0] ? (
                    <img src={product.images[0].thumbnailUrl} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{product.category}</span>
                  <Link to={`/product/${product.slug || product._id}`} className="block mt-1">
                    <h3 className="text-xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors">{product.name}</h3>
                  </Link>
                  <div className="text-lg font-bold text-gray-900 mt-2">₹{getFinalPrice(product).toFixed(0)}</div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                  {/* Quantity */}
                  <div className="flex items-center border-2 border-gray-100 rounded-full bg-gray-50">
                    <button onClick={() => updateQuantity(product._id!, quantity - 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 transition">
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center font-bold">{quantity}</span>
                    <button onClick={() => updateQuantity(product._id!, quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 transition">
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                  
                  {/* Remove */}
                  <button onClick={() => removeFromCart(product._id!)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Remove item">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6" style={{ fontFamily: 'Outfit' }}>Order Summary</h2>
              
              <div className="space-y-4 text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={`font-bold ${totalShipping > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                    {totalShipping > 0 ? `₹${totalShipping.toFixed(0)}` : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (Estimated)</span>
                  <span className="font-bold text-gray-900">₹{(totalPrice * 0.18).toFixed(0)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-gray-900 leading-none">₹{((totalPrice * 1.18) + totalShipping).toFixed(0)}</span>
                    <div className="text-xs text-gray-500 mt-1">Includes GST</div>
                  </div>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white h-14 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-orange-300"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
