import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await axios.post('/api/auth/login', { email: loginEmail, password: loginPassword });
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setLoginError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setIsSigningUp(true);
    try {
      const res = await axios.post('/api/auth/signup', {
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
      });
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setSignupError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto">
        
        {/* Close Button */}
        <button 
          onClick={closeAuthModal} 
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        {/* ── Signup Section (Left) ── */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-[#F8FAFC]">
          <h2 className="text-2xl font-extrabold text-[#111827] mb-2" style={{ fontFamily: 'Outfit' }}>Create Account</h2>
          <p className="text-[#6B7280] text-sm mb-6">Join ChildToys for exclusive offers and faster checkout.</p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" required
                  value={signupName} onChange={e => setSignupName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition" 
                  placeholder="John Doe" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" required
                  value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition" 
                  placeholder="john@example.com" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="tel"
                  value={signupPhone} onChange={e => setSignupPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition" 
                  placeholder="+91 98765 43210" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="password" required minLength={8}
                  value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition" 
                  placeholder="Minimum 8 characters" 
                />
              </div>
            </div>

            {signupError && <p className="text-red-500 text-xs font-medium">{signupError}</p>}
            
            <button 
              type="submit" 
              disabled={isSigningUp}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl text-sm transition-colors mt-2"
            >
              {isSigningUp ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* ── Login Section (Right) ── */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100">
          <h2 className="text-2xl font-extrabold text-[#111827] mb-2" style={{ fontFamily: 'Outfit' }}>Welcome Back</h2>
          <p className="text-[#6B7280] text-sm mb-6">Log in to track your orders and view your wishlist.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" required
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-transparent rounded-xl text-sm focus:border-[#F97316] focus:bg-white focus:ring-1 focus:ring-[#F97316] outline-none transition" 
                  placeholder="john@example.com" 
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-xs font-bold text-gray-700">Password</label>
                <a href="#" className="text-xs text-[#2563EB] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="password" required
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-transparent rounded-xl text-sm focus:border-[#F97316] focus:bg-white focus:ring-1 focus:ring-[#F97316] outline-none transition" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {loginError && <p className="text-red-500 text-xs font-medium">{loginError}</p>}
            
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#F97316] hover:bg-[#ea6b0b] text-white font-bold rounded-xl text-sm transition-colors mt-2 shadow-md shadow-[#F97316]/20"
            >
              {isLoggingIn ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
