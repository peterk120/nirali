'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginTestPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Store token
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        setLoginStatus('✅ Login successful! You can now access admin pages.');
        
        // Redirect to products page after successful login
        setTimeout(() => {
          router.push('/admin/products');
        }, 1000);
      } else {
        setLoginStatus(`❌ Login failed: ${result.error?.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      setLoginStatus(`❌ Login error: ${error.message}`);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setLoginStatus(`✅ Logged in as: ${userData.email} (Role: ${userData.role || 'Unknown'})`);
      } catch {
        setLoginStatus('⚠️ Token found but user data is corrupted');
      }
    } else {
      setLoginStatus('❌ Not logged in - please login below');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoginStatus('✅ Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login Test</h1>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-800 mb-2">Current Status</h2>
          <button 
            onClick={checkAuthStatus}
            className="w-full mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Check Authentication Status
          </button>
          <div className="text-sm text-gray-600 mt-2 p-2 bg-white rounded">
            {loginStatus || 'Click above to check your status'}
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-800 mb-3">Login as Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-rose"
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-rose"
                placeholder="your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-brand-rose text-white rounded-md hover:bg-brand-rose/90 focus:outline-none focus:ring-2 focus:ring-brand-rose focus:ring-offset-2"
            >
              Login as Admin
            </button>
          </form>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <h2 className="font-semibold text-yellow-800 mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Logout
            </button>
            <button
              onClick={() => router.push('/admin/products')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Products Page
            </button>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}