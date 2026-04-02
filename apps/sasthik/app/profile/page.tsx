'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { User, Phone, Mail, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user, token, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile updated successfully');
        await checkAuth(); // Refresh local user state
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-brand-teal animate-spin mb-4" />
        <p className="text-gray-500 font-body">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-light/20 pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-teal hover:gap-3 transition-all mb-8 font-body text-sm font-medium">
          <ArrowLeft size={16} /> Back to Shopping
        </Link>

        <div className="bg-white rounded-3xl shadow-luxury overflow-hidden border border-teal-light">
          <div className="bg-brand-dark p-8 md:p-12 text-white">
            <h1 className="font-heading text-3xl md:text-4xl mb-2">My Profile</h1>
            <p className="text-brand-rose-gold uppercase tracking-[0.2em] text-[10px] font-bold">Personal Information</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal opacity-40" size={18} />
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-teal-light/30 border border-teal-light rounded-2xl py-4 pl-12 pr-4 font-body text-sm focus:bg-white focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2 opacity-70">
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold ml-1">Email Address (Primary)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-body text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal opacity-40" size={18} />
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-teal-light/30 border border-teal-light rounded-2xl py-4 pl-12 pr-4 font-body text-sm focus:bg-white focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-brand-teal text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-dark transition-all shadow-lg flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-brand-rose-gold/5 border border-brand-rose-gold/20 p-6 rounded-2xl flex items-start gap-4">
          <div className="bg-brand-rose-gold/20 p-2 rounded-lg">
            <Loader2 className="w-5 h-5 text-brand-rose-gold" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-brand-dark mb-1">Account Security</h4>
            <p className="text-xs text-gray-600 font-body leading-relaxed">Your account is secured with 256-bit encryption. To change your primary email or delete your account, please contact our concierge service.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
