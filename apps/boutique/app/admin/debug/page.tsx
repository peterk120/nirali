'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../../../lib/auth';

export default function AdminDebugPage() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const checkAuth = async () => {
      try {
        const payload = await verifyToken(token);
        setDebugInfo({
          tokenPresent: !!token,
          token: token ? token.substring(0, 20) + '...' : 'None',
          payload: payload,
          role: payload.role,
          isAuthenticated: payload.role === 'admin',
          error: null
        });
      } catch (error) {
        setDebugInfo({
          tokenPresent: !!token,
          token: token ? token.substring(0, 20) + '...' : 'None',
          payload: null,
          role: null,
          isAuthenticated: false,
          error: error.message
        });
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Debug Information</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800 mb-2">Authentication Status</h2>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
{JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">Navigation Test</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => router.push('/admin/products')}
                className="px-4 py-2 bg-brand-rose text-white rounded hover:bg-brand-rose/90"
              >
                Go to Products
              </button>
              <button 
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}