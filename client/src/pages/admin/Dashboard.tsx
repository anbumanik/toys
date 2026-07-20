import { ShoppingCart, Users, Package, IndianRupee } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProducts } from '../../api/products';

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    getProducts({ limit: 1 }).then(res => {
      const total = res.pagination?.total || (Array.isArray(res.data) ? res.data.length : 0);
      setProductCount(total);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'Outfit' }}>
          Overview
        </h1>
        <div className="text-sm text-slate-500 font-medium">
          Last 30 days
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-extrabold text-slate-800">₹0.00</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-extrabold text-slate-800">0</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Customers</p>
            <h3 className="text-2xl font-extrabold text-slate-800">0</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Products</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{productCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 h-96 flex flex-col items-center justify-center text-center">
          <BarChart3Icon size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Sales Analytics</h3>
          <p className="text-slate-500">Not enough data to display charts yet.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96 flex flex-col items-center justify-center text-center">
          <RecentOrdersIcon size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
          <p className="text-slate-500">No recent orders found.</p>
        </div>
      </div>
    </div>
  );
}

function BarChart3Icon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
  )
}

function RecentOrdersIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  )
}
