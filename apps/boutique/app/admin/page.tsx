'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../../lib/auth';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const checkAuth = async () => {
      try {
        const payload = await verifyToken(token);
        if (payload.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (payload.role === 'sales') {
          router.push('/admin/products');
        } else {
          router.push('/'); // Redirect non-admins to home
        }
      } catch (error) {
        // If token is invalid, redirect to login
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-rose mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    </div>
  );
}