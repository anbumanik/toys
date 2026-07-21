import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Mail, Phone, Shield, LogOut, Edit2, Check, X } from 'lucide-react';
import api from '../../api/client';
import { useState } from 'react';

export default function Profile() {
  const { user, login, logout, openAuthModal } = useAuth();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhoneValue, setEditPhoneValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditPhone = () => {
    setEditPhoneValue(user?.phone || '');
    setIsEditingPhone(true);
  };

  const handleSavePhone = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      const res = await api.put('/auth/profile', { phone: editPhoneValue });
      // Update AuthContext with new token and user
      login(res.data.token, res.data.user);
      setIsEditingPhone(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update phone number');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-lg text-center animate-fade-in-up">
          <div className="w-24 h-24 rounded-3xl bg-gray-200 flex items-center justify-center text-gray-400 mx-auto mb-6 shadow-sm">
            <UserIcon size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: 'Outfit' }}>
            Not Logged In
          </h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Please log in or sign up to view your profile details.
          </p>
          <button
            onClick={openAuthModal}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-300"
          >
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-12 px-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-[#2563EB] to-blue-400 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center p-1">
            <div className="w-full h-full bg-[#F8FAFC] rounded-xl flex items-center justify-center text-[#2563EB]">
              <UserIcon size={40} />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Outfit' }}>
                {user.name}
              </h1>
              <p className="text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                <Shield size={14} className="text-[#F97316]" /> 
                <span className="capitalize">{user.role}</span> Account
              </p>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Mail size={16} />
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</h3>
              </div>
              <p className="text-gray-900 font-semibold pl-11">{user.email}</p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Phone size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</h3>
                </div>
                {!isEditingPhone && (
                  <button onClick={handleEditPhone} className="text-blue-600 hover:text-blue-800 p-1">
                    <Edit2 size={14} />
                  </button>
                )}
              </div>
              
              <div className="pl-11">
                {isEditingPhone ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={editPhoneValue} 
                      onChange={e => setEditPhoneValue(e.target.value)} 
                      placeholder="Enter phone number"
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full outline-none focus:border-blue-500"
                    />
                    <button onClick={handleSavePhone} disabled={isSaving} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setIsEditingPhone(false)} disabled={isSaving} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-900 font-semibold">{user.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
