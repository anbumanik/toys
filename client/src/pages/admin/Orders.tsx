import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../api/orders';
import {
  Package, Search, CheckCircle, Clock, Truck,
  MapPin, RefreshCw, ChevronDown, X, FileText
} from 'lucide-react';
import InvoiceModal from '../../components/admin/InvoiceModal';

const ALL_STATUSES = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; icon: JSX.Element }> = {
  Processing:           { bg: 'bg-slate-100',   text: 'text-slate-700',  border: 'border-slate-300',  icon: <Clock size={12} /> },
  Packed:               { bg: 'bg-purple-50',   text: 'text-purple-700', border: 'border-purple-200', icon: <Package size={12} /> },
  Shipped:              { bg: 'bg-blue-50',     text: 'text-blue-700',   border: 'border-blue-200',   icon: <Truck size={12} /> },
  'Out for Delivery':   { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200', icon: <MapPin size={12} /> },
  Delivered:            { bg: 'bg-green-50',    text: 'text-green-700',  border: 'border-green-200',  icon: <CheckCircle size={12} /> },
  Cancelled:            { bg: 'bg-red-50',      text: 'text-red-700',    border: 'border-red-200',    icon: <X size={12} /> },
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch(err => setError(err?.response?.data?.message || 'Failed to fetch orders'))
      .finally(() => setLoading(false));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId
            ? {
                ...o,
                deliveryStatus: newStatus,
                isDelivered: newStatus === 'Delivered',
                deliveredAt: newStatus === 'Delivered' ? new Date().toISOString() : null,
              }
            : o
        )
      );
      showToast(`Order status updated to "${newStatus}"`, 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o =>
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) =>
    STATUS_STYLES[status] || STATUS_STYLES['Processing'];

  return (
    <div className="space-y-6">

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'Outfit' }}>Order Management</h1>
          <p className="text-slate-500 mt-1">Track, update, and generate invoices for all customer orders.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow shadow-sm"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-slate-600" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ALL_STATUSES.map(status => {
          const count = orders.filter(o => (o.deliveryStatus || 'Processing') === status).length;
          const style = getStatusStyle(status);
          return (
            <div key={status} className={`${style.bg} border ${style.border} rounded-2xl px-4 py-3 text-center`}>
              <div className={`text-2xl font-extrabold ${style.text}`}>{count}</div>
              <div className={`text-xs font-bold mt-1 ${style.text} opacity-80`}>{status}</div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Delivery Status</th>
                <th className="px-5 py-4 text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    <Package size={40} className="mx-auto mb-3 opacity-20" />
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => {
                  const currentStatus = order.deliveryStatus || 'Processing';
                  const style = getStatusStyle(currentStatus);
                  const isUpdating = updatingId === order._id;

                  return (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      {/* Order ID */}
                      <td className="px-5 py-4 font-mono text-slate-800 font-medium text-xs">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{order.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{order.user?.email || 'N/A'}</div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 font-bold text-slate-800">
                        ₹{order.totalPrice.toFixed(0)}
                      </td>

                      {/* Payment Status */}
                      <td className="px-5 py-4">
                        {order.paymentStatus === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-md text-xs font-bold border border-green-200">
                            <CheckCircle size={12} /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-1 rounded-md text-xs font-bold border border-orange-200">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>

                      {/* Delivery Status Dropdown */}
                      <td className="px-5 py-4">
                        <div className="relative w-44">
                          <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none ${style.text}`}>
                            {style.icon}
                          </div>
                          {isUpdating ? (
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-500">
                              <RefreshCw size={12} className="animate-spin" /> Updating...
                            </div>
                          ) : (
                            <div className="relative">
                              <select
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className={`w-full pl-7 pr-7 py-1.5 rounded-xl text-xs font-bold border cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${style.bg} ${style.text} ${style.border}`}
                              >
                                {ALL_STATUSES.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <ChevronDown size={12} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${style.text}`} />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Invoice Button */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                          title="Generate Invoice"
                        >
                          <FileText size={13} />
                          Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
