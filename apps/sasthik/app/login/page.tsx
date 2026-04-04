'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { login as apiLogin, register as apiRegister } from '@/lib/api';
import Link from 'next/link';

const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

type AuthForm = z.infer<typeof authSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, user, isLoggedIn } = useAuthStore();
  const { mergeGuestCart } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: { name: '', email: '', password: '', phone: '' },
  });

  // Prevent wrong access: If already logged in, redirect based on role
  useEffect(() => {
    if (isLoggedIn && user) {
      if (redirectTo) {
        router.push(redirectTo as any);
      } else if (user.role === 'admin' || user.role === 'sales') {
        router.push(user.role === 'admin' ? '/admin/dashboard' : '/admin/products');
      } else {
        router.push('/');
      }
    }
  }, [isLoggedIn, user, router, redirectTo]);

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    clearErrors();
  };

  const onSubmit = async (data: AuthForm) => {
    try {
      if (isRegistering && !data.name) {
        setError('name', { message: 'Name is required to register' });
        return;
      }

      const response = isRegistering 
        ? await apiRegister({ name: data.name!, email: data.email, password: data.password, phone: data.phone || '' })
        : await apiLogin({ email: data.email, password: data.password });

      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        login(userData as any, token);
        
        // Merge guest cart items into user account
        await mergeGuestCart();

        if (userData.role === 'admin' || userData.role === 'sales') {
          // If staff tries to login here, redirect them to admin dashboard
          toast.success(`${userData.role.toUpperCase()} authenticated! Safeguarding to Admin Portal.`);
          router.push(userData.role === 'admin' ? '/admin/dashboard' : '/admin/products');
        } else if (redirectTo) {
          toast.success('Welcome back! Continuing to your destination.');
          router.push(redirectTo as any);
        } else {
          toast.success(isRegistering ? 'Account created! Welcome to Sashti Sparkle.' : 'Welcome back to Sashti Sparkle!');
          router.push('/');
        }
      } else {
        const msg = response.error?.message || response.message || 'Invalid credentials';
        setError('root', { message: msg });
        toast.error(msg);
      }
    } catch (err) {
      setError('root', { message: 'An error occurred during authentication' });
      toast.error('An error occurred. Is the backend server running?');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20 px-6">
      <div className="w-full max-w-xl bg-white border border-teal-light rounded-[40px] overflow-hidden shadow-luxury flex flex-col md:flex-row">
        
        {/* Brand Side (Desktop) */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-brand-teal text-white w-[40%] text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-rose-gold/20 rounded-full -ml-12 -mb-12" />
           
           <h1 className="font-heading text-4xl mb-6 italic">Look Royal. Pay Less.</h1>
           <div className="w-12 h-px bg-brand-rose-gold mx-auto mb-6" />
           <p className="text-[11px] font-body text-teal-light/70 leading-relaxed tracking-widest uppercase mb-12">Premium Imitation Jewellery for Every Occasion</p>
           
           <div className="flex flex-col gap-4 items-center">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-brand-rose-gold">
                 <ShieldCheck size={14} /> Secure Access
              </div>
           </div>
        </div>

        {/* Form Side */}
        <div className="flex-grow p-8 md:p-12">
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-heading text-4xl text-brand-dark mb-2 italic">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-[10px] text-brand-rose-gold font-bold tracking-widest uppercase">
              {isRegistering ? 'Join our sparkle family' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isRegistering && (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Full Name</label>
                <input 
                  {...register('name')}
                  type="text" 
                  className="w-full p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                  placeholder="Enter your name" 
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.name.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Email Address</label>
              <input 
                {...register('email')}
                type="email" 
                className="w-full p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                placeholder="your@email.com" 
              />
              {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Password</label>
              <div className="relative">
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'} 
                  className="w-full p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all pr-12" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-teal"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-teal text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:bg-brand-dark transition-all shadow-luxury flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? 'Processing...' : isRegistering ? 'Sign Up' : 'Sign In'}
              {!isSubmitting && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>

            <div className="text-center mt-8">
              <p className="text-xs text-gray-500 font-body">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className="text-brand-rose-gold font-bold hover:text-brand-teal transition-colors"
                >
                  {isRegistering ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
          </form>

          <div className="mt-12 flex items-center gap-4 text-center justify-center py-4 bg-teal-light/20 rounded-2xl border border-dashed border-teal-light">
             <Sparkles size={16} className="text-brand-rose-gold" />
             <p className="text-[10px] text-brand-teal font-bold tracking-widest uppercase">Member Exclusive Deals & Rewards</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
         <Link href={"/" as any} className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-brand-teal transition-colors flex items-center gap-2">
           <ArrowRight size={14} className="rotate-180" /> Back to Shopping
         </Link>
      </div>
    </div>
  );
}
