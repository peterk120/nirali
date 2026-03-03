'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validateCredentials, signToken } from '../../../lib/auth';
import { toast } from 'react-hot-toast';
import WhatsAppButton from '../../../components/WhatsAppButton';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const u = JSON.parse(user);
        router.push(u.role === 'admin' ? '/admin' : '/');
      } catch (_) {}
    }
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const { isValid, role } = validateCredentials(data.email, data.password);
      if (isValid && role) {
        const token = await signToken(data.email, role);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email: data.email, role }));
        toast.success(role === 'admin' ? 'Welcome back, Admin!' : 'Welcome back!');
        router.push(role === 'admin' ? '/admin' : '/');
      } else {
        setError('root', { message: 'Invalid email or password' });
        toast.error('Invalid email or password');
      }
    } catch (err) {
      setError('root', { message: 'An error occurred during login' });
      toast.error('An error occurred during login');
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap"
      />

      <div style={{
        minHeight: '100vh',
        background: '#FFF8F8',
        display: 'flex',
        fontFamily: "'Jost', sans-serif",
        fontWeight: 300,
      }}>

        {/* ── Left decorative panel ── */}
        <div style={{
          display: 'none',
          flex: 1,
          background: '#6B1F2A',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
          className="login-panel"
        >
          {/* decorative rings */}
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(240,196,204,0.15)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(240,196,204,0.1)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'radial-gradient(circle, rgba(201,110,130,0.3) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 250, height: 250, background: 'radial-gradient(circle, rgba(201,110,130,0.2) 0%, transparent 70%)' }} />

          <div style={{ position: 'relative', textAlign: 'center' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#F0C4CC', marginBottom: 20 }}>
              Est. 2019 · Hyderabad
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 52,
              fontWeight: 300,
              color: '#FFF8F8',
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              Nirali Sai<br /><em style={{ fontStyle: 'italic', color: '#F0C4CC' }}>Boutique</em>
            </h1>
            <div style={{ width: 40, height: 1, background: '#C96E82', margin: '0 auto 24px' }} />
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(240,196,204,0.7)', maxWidth: 260 }}>
              Exquisite bridal wear and fine jewellery for your most unforgettable moments.
            </p>
          </div>
        </div>

        {/* ── Right login form ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
        }}>
          <div style={{ width: '100%', maxWidth: 400 }}>

            {/* Mobile logo */}
            <div style={{ textAlign: 'center', marginBottom: 48 }} className="mobile-logo">
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: '#6B1F2A', lineHeight: 1 }}>
                Nirali Sai
              </h1>
              <p style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#C96E82', marginTop: 4 }}>
                Boutique
              </p>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C96E82', marginBottom: 10 }}>
                Welcome Back
              </p>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 38,
                fontWeight: 300,
                color: '#6B1F2A',
                lineHeight: 1.1,
                margin: 0,
              }}>
                Sign <em style={{ fontStyle: 'italic' }}>In</em>
              </h2>
              <div style={{ width: 32, height: 1, background: '#C96E82', marginTop: 14 }} />
            </div>

            {/* Error */}
            {errors.root && (
              <div style={{
                padding: '12px 16px',
                background: '#FFF0F0',
                border: '1px solid #F0C4CC',
                borderLeft: '3px solid #6B1F2A',
                marginBottom: 24,
                fontSize: 13,
                color: '#6B1F2A',
              }}>
                {errors.root.message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A0525E', marginBottom: 8 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    border: 'none',
                    borderBottom: `1px solid ${errors.email ? '#C96E82' : '#F0C4CC'}`,
                    background: 'transparent',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 14,
                    color: '#6B1F2A',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderBottomColor = '#6B1F2A')}
                  onBlur={e => (e.target.style.borderBottomColor = errors.email ? '#C96E82' : '#F0C4CC')}
                />
                {errors.email && (
                  <p style={{ fontSize: 11, color: '#C96E82', marginTop: 6, letterSpacing: '0.05em' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A0525E', marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 36px 12px 0',
                      border: 'none',
                      borderBottom: `1px solid ${errors.password ? '#C96E82' : '#F0C4CC'}`,
                      background: 'transparent',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14,
                      color: '#6B1F2A',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderBottomColor = '#6B1F2A')}
                    onBlur={e => (e.target.style.borderBottomColor = errors.password ? '#C96E82' : '#F0C4CC')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#D4A0A8', padding: 0, display: 'flex' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ fontSize: 11, color: '#C96E82', marginTop: 6, letterSpacing: '0.05em' }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div style={{ marginTop: 12 }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: isSubmitting ? '#A0525E' : '#6B1F2A',
                    color: '#FFF8F8',
                    border: 'none',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (!isSubmitting) (e.target as HTMLElement).style.background = '#A0525E'; }}
                  onMouseLeave={e => { if (!isSubmitting) (e.target as HTMLElement).style.background = '#6B1F2A'; }}
                >
                  {isSubmitting ? 'Signing In…' : 'Sign In'}
                </button>
              </div>

              {/* Hint */}
              <p style={{ fontSize: 11, color: '#D4A0A8', textAlign: 'center', letterSpacing: '0.04em', lineHeight: 1.7 }}>
                User: test@gmail.com · 123<br />
                Admin: admin@gmail.com · 123
              </p>
            </form>

          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .login-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
        input::placeholder { color: #D4A0A8; }
      `}</style>

      <WhatsAppButton />
    </>
  );
}