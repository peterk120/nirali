'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Settings, Lock, Bell, Shield, Eye, EyeOff, ArrowLeft, ChevronRight, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [settings, setSettings] = useState({
    orderUpdates: true,
    newsletter: false,
    offers: true,
    securityAlerts: true
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings updated successfully');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-teal-light/20 pb-20 font-body">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-teal hover:gap-3 transition-all mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Shopping
        </Link>

        <div className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl mb-3 text-brand-dark leading-tight">Settings</h1>
          <p className="text-brand-rose-gold uppercase tracking-[0.3em] text-[10px] font-bold">Preferences & Security</p>
        </div>

        <div className="space-y-6">
          {/* Section 1: Security */}
          <div className="bg-white rounded-3xl shadow-luxury border border-teal-light overflow-hidden">
            <div className="p-6 md:p-8 border-b border-teal-light flex items-center gap-4">
              <div className="p-2 bg-brand-rose-gold/10 rounded-lg text-brand-rose-gold">
                <Lock size={20} />
              </div>
              <h3 className="font-heading text-xl text-brand-dark">Security & Password</h3>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-brand-dark mb-1">Change Password</p>
                    <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                  </div>
                  <button className="text-[10px] uppercase tracking-widest font-bold text-brand-teal border border-brand-teal/20 px-6 py-2.5 rounded-xl hover:bg-teal-light transition-all">
                    Update Password
                  </button>
               </div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-teal-light/50">
                  <div>
                    <p className="text-sm font-bold text-brand-dark mb-1">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                  </div>
                  <button className="text-[10px] uppercase tracking-widest font-bold text-gray-400 border border-gray-200 px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                    Enable
                  </button>
               </div>
            </div>
          </div>

          {/* Section 2: Notifications */}
          <div className="bg-white rounded-3xl shadow-luxury border border-teal-light overflow-hidden">
            <div className="p-6 md:p-8 border-b border-teal-light flex items-center gap-4">
              <div className="p-2 bg-brand-teal/10 rounded-lg text-brand-teal">
                <Bell size={20} />
              </div>
              <h3 className="font-heading text-xl text-brand-dark">Notifications</h3>
            </div>
            
            <div className="p-6 md:p-8 divide-y divide-teal-light/50">
              {[
                { id: 'orderUpdates', label: 'Order Status Updates', desc: 'Receive real-time tracking and delivery information.' },
                { id: 'newsletter', label: 'Boutique Newsletter', desc: 'Inspired editorials, interviews, and new collection launches.' },
                { id: 'offers', label: 'Exclusive Offers', desc: 'Member-only discounts and early access to sales.' },
                { id: 'securityAlerts', label: 'Security Alerts', desc: 'Notifications about sign-ins and account changes.' }
              ].map((item) => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex items-center justify-between gap-6">
                  <div className="max-w-md">
                    <p className="text-sm font-bold text-brand-dark mb-1">{item.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(item.id as keyof typeof settings)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings[item.id as keyof typeof settings] ? 'bg-brand-teal' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings[item.id as keyof typeof settings] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
           <button 
             onClick={handleSave}
             disabled={loading}
             className="bg-brand-dark text-white px-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
           >
             {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
             Save All Preferences
           </button>
        </div>

        <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-200 text-center">
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">Dangerous Zone</h4>
            <button className="text-red-500 text-xs font-bold hover:underline">Deactivate or Delete Account</button>
        </div>
      </div>
    </div>
  );
}
