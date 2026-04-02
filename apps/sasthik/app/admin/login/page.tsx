'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { login as apiLogin } from '@/lib/api';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid staff email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Prevent wrong access: If already logged in as staff, redirect to dashboard
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'sales')) {
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/admin/products');
    }
  }, [user, router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await apiLogin({ email: data.email, password: data.password });

      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        if (userData.role !== 'admin' && userData.role !== 'sales') {
          toast.error('Access denied. This login is for staff only.');
          return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        login(userData as any, token);
        
        toast.success(`Welcome back, ${userData.name}!`);
        
        // Role-based redirect
        if (userData.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (userData.role === 'sales') {
          router.push('/admin/products');
        }
      } else {
        const msg = response.error?.message || response.message || 'Invalid credentials';
        setError('root', { message: msg });
        toast.error(msg);
      }
    } catch (err) {
      setError('root', { message: 'An error occurred during authentication' });
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-6 font-body relative overflow-hidden">
      {/* ── Background Aesthetics ── */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#1A7A7A]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#B76E79]/5 blur-[120px] rounded-full" />
      <div className="absolute top-[20%] right-[10%] w-[10%] h-[10%] bg-[#c9a84c]/5 blur-[80px] rounded-full" />

      <div className="w-full max-w-[480px] relative z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[48px] p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(26,122,122,0.12)]">
          
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1A7A7A] to-[#146363] rounded-3xl shadow-xl shadow-[#1A7A7A]/20 mb-8 transform hover:scale-110 transition-transform duration-500 cursor-pointer group">
              <ShieldCheck size={36} className="text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
               <Sparkles size={16} className="text-[#B76E79] animate-pulse" />
               <h1 className="font-heading text-5xl text-[#111110] italic">Administrative Portal</h1>
            </div>
            <p className="text-[11px] text-[#B76E79] font-bold tracking-[0.25em] uppercase">Sashti Jewels Management System</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-[#7a7673] tracking-widest uppercase ml-1">Staff Credentials</label>
              <div className="relative group/field">
                <input 
                  {...register('email')}
                  type="email" 
                  autoComplete="email"
                  className="w-full p-4.5 bg-white border border-[#e0dbd4] rounded-2xl text-[15px] outline-none focus:border-[#1A7A7A] focus:ring-4 focus:ring-[#1A7A7A]/5 transition-all duration-300 group-hover/field:border-[#1A7A7A]/50" 
                  placeholder="Enter staff email" 
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 mt-1.5 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 transition-all">
                    <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[11px] font-bold text-[#7a7673] tracking-widest uppercase">Secret Key</label>
                <button 
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="text-[10px] font-bold text-[#B76E79] hover:text-[#1A7A7A] tracking-widest uppercase transition-colors"
                >
                   {showPassword ? 'Hide Key' : 'Reveal Key'}
                </button>
              </div>
              <div className="relative group/field">
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'} 
                  autoComplete="current-password"
                  className="w-full p-4.5 bg-white border border-[#e0dbd4] rounded-2xl text-[15px] outline-none focus:border-[#1A7A7A] focus:ring-4 focus:ring-[#1A7A7A]/5 transition-all duration-300 group-hover/field:border-[#1A7A7A]/50 pr-12" 
                  placeholder="Enter secure password" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cec8c2]">
                   <Lock size={18} />
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-500 mt-1.5 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 transition-all">
                    <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[#1A7A7A] to-[#146363] text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:shadow-2xl hover:shadow-[#1A7A7A]/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <span>Authenticating Portal...</span>
                   </>
                ) : (
                  <>
                    <span>Enter Management Console</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-[#f0edeb] text-center flex flex-col items-center gap-6">
             <Link href="/login" className="px-6 py-2 border border-[#e0dbd4] rounded-full text-[10px] text-[#7a7673] font-bold uppercase tracking-widest hover:bg-[#faf9f7] hover:text-[#1A7A7A] transition-all flex items-center gap-2">
               Access Public Storefront
             </Link>
             <p className="text-[9px] text-[#cec8c2] font-semibold uppercase tracking-[0.3em]">© 2026 Sashtik Jewels · All rights reserved</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .p-4.5 { padding: 1.125rem; }
        .shadow-luxury { box-shadow: 0 32px 64px -16px rgba(26,122,122,0.12); }
      `}</style>
    </div>
  );
}
