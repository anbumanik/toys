import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders } from '../../api/orders';
import {
  Package, Clock, CheckCircle, ChevronRight, Loader,
  Box, Truck, MapPin, XCircle, ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';

// All possible order statuses with display config
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: JSX.Element; step: number }> = {
  Processing:          { label: 'Order Placed',      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: <ShoppingBag size={15} />,  step: 0 },
  Packed:              { label: 'Packed',            color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: <Box size={15} />,          step: 1 },
  Shipped:             { label: 'Shipped',           color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: <Package size={15} />,      step: 2 },
  'Out for Delivery':  { label: 'Out for Delivery', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: <Truck size={15} />,        step: 3 },
  Delivered:           { label: 'Delivered',         color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  icon: <CheckCircle size={15} />,  step: 4 },
  Cancelled:           { label: 'Cancelled',         color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    icon: <XCircle size={15} />,      step: -1 },
};

const TRACKER_STEPS = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

function StatusTracker({ status }: { status: string }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full font-bold text-sm border border-red-200 w-fit">
        <XCircle size={16} /> Order Cancelled
      </div>
    );
  }

  const currentStep = STATUS_CONFIG[status]?.step ?? 0;

  return (
    <div className="w-full">
      {/* Step bar */}
      <div className="flex items-center w-full mb-2">
        {TRACKER_STEPS.map((step, idx) => {
          const cfg = STATUS_CONFIG[step];
          const done = currentStep >= idx;
          const active = currentStep === idx;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done
                  ? active
                    ? `${cfg.bg} ${cfg.border} ${cfg.color} scale-110`
                    : 'bg-green-500 border-green-500 text-white'
                  : 'bg-gray-100 border-gray-200 text-gray-400'
              }`}>
                {done && !active ? <CheckCircle size={14} /> : cfg.icon}
              </div>
              {/* Connector */}
              {idx < TRACKER_STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                  currentStep > idx ? 'bg-green-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex justify-between text-[10px] font-bold text-gray-400">
        {TRACKER_STEPS.map((step, idx) => {
          const done = currentStep >= idx;
          const cfg = STATUS_CONFIG[step];
          return (
            <span key={step} className={`${done ? cfg.color : 'text-gray-400'} ${idx === 0 ? 'text-left' : idx === TRACKER_STEPS.length - 1 ? 'text-right' : 'text-center'} flex-1`}>
              {cfg.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getMyOrders()
      .then(setOrders)
      .catch(err => setError(err?.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <p className="text-gray-500">You need to be logged in to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3" style={{ fontFamily: 'Outfit' }}>
          <Package className="text-blue-600" size={32} />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't made your first purchase yet!</p>
            <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors inline-block shadow-lg shadow-blue-200">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const status = order.deliveryStatus || 'Processing';
              const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Processing'];
              return (
                <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">

                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order Placed</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total</div>
                      <div className="font-semibold text-gray-900">₹{order.totalPrice.toFixed(0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order ID</div>
                      <div className="font-semibold text-gray-900 text-sm">#{order._id.slice(-8).toUpperCase()}</div>
                    </div>
                    {/* Live status badge */}
                    <div className={`flex items-center gap-1.5 ${cfg.bg} ${cfg.border} ${cfg.color} border px-3 py-1.5 rounded-full text-xs font-bold`}>
                      {cfg.icon} {cfg.label}
                    </div>
                  </div>

                  {/* Status Tracker */}
                  <div className="px-6 pt-5 pb-2">
                    <StatusTracker status={status} />
                  </div>

                  {/* Delivered date */}
                  {status === 'Delivered' && order.deliveredAt && (
                    <div className="px-6 pb-4">
                      <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle size={12} />
                        Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 mx-6" />

                  {/* Order Items */}
                  <div className="p-6 space-y-4">
                    {order.orderItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">Qty: {item.qty} × ₹{item.price.toFixed(0)}</p>
                        </div>
                        <div className="hidden sm:block">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-1 whitespace-nowrap"
                          >
                            Buy Again <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
