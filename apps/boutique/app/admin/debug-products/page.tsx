'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DebugProductsPage() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState({
    pathname: '',
    token: '',
    authStatus: 'checking',
    error: null
  });

  useEffect(() => {
    // Log current URL
    console.log('Current URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    
    setDebugInfo(prev => ({
      ...prev,
      pathname: window.location.pathname
    }));

    // Check authentication
    const token = localStorage.getItem('token');
    console.log('Token found:', !!token);
    
    setDebugInfo(prev => ({
      ...prev,
      token: token ? token.substring(0, 20) + '...' : 'None'
    }));

    if (!token) {
      setDebugInfo(prev => ({
        ...prev,
        authStatus: 'no-token',
        error: 'No authentication token found'
      }));
      return;
    }

    // Try to verify token
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Auth verification result:', result);
          setDebugInfo(prev => ({
            ...prev,
            authStatus: 'authenticated',
            error: null
          }));
        } else {
          setDebugInfo(prev => ({
            ...prev,
            authStatus: 'invalid-token',
            error: 'Token verification failed'
          }));
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setDebugInfo(prev => ({
          ...prev,
          authStatus: 'error',
          error: error.message
        }));
      }
    };

    verifyAuth();
  }, [router]);

  const handleNavigationTest = (path: any) => {
    console.log('Attempting navigation to:', path);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Debug Products Page</h1>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">Current State</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Pathname:</p>
                <p className="font-mono text-gray-900">{debugInfo.pathname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Token:</p>
                <p className="font-mono text-gray-900">{debugInfo.token}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Auth Status:</p>
                <p className="font-mono text-gray-900">{debugInfo.authStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Error:</p>
                <p className="font-mono text-red-600">{debugInfo.error || 'None'}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-green-800 mb-2">Navigation Tests</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleNavigationTest('/admin/products')}
                className="px-4 py-2 bg-brand-rose text-white rounded hover:bg-brand-rose/90"
              >
                Go to Products
              </button>
              <button
                onClick={() => handleNavigationTest('/admin/dashboard')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => handleNavigationTest('/admin/test-embed')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Go to Test Page
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="font-semibold text-yellow-800 mb-2">Instructions</h2>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Open browser console (F12) to see debug logs</li>
              <li>Check if you're logged in as admin</li>
              <li>Test navigation to different pages</li>
              <li>Report any redirect issues you notice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}