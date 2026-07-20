import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  // Protect admin routes
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="font-semibold text-lg text-slate-800 md:hidden">
            Admin Panel
          </div>
          <div className="hidden md:block text-slate-500 font-medium">
            Welcome back, {user.name} 👋
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-blue-600 transition">
              <Bell size={20} />
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                <UserIcon size={18} />
              </div>
              <div className="hidden sm:block text-sm">
                <div className="font-bold text-slate-800 leading-none">{user.name}</div>
                <div className="text-slate-500 text-xs mt-1 capitalize">{user.role}</div>
              </div>
              <button 
                onClick={logout}
                className="ml-2 text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
