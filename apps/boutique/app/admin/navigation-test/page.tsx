'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NavigationTestPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [navigationLog, setNavigationLog] = useState<string[]>([]);
  const [manualLog, setManualLog] = useState<string>('');

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setNavigationLog(prev => [...prev, `[${timestamp}] ${message}`]);
    
    // Scroll to bottom
    setTimeout(() => {
      const logContainer = document.querySelector('.max-h-60');
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    setNavigationLog(prev => [...prev, `[${timestamp}] Navigated to: ${pathname}`]);
    
    // Scroll to bottom of log to show latest entry
    setTimeout(() => {
      const logContainer = document.querySelector('.max-h-60');
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    }, 100);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Navigation Test</h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">Navigation Controls</h2>
            <div className="flex gap-2 flex-wrap mb-4">
              <Link 
                href="/admin/products"
                className="px-4 py-2 bg-brand-rose text-white rounded hover:bg-brand-rose/90"
                onClick={() => {
                  setManualLog('Clicked Products link');
                  addToLog('Clicked Products link');
                }}
              >
                Go to Products
              </Link>
              <Link 
                href="/admin/dashboard"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => {
                  setManualLog('Clicked Dashboard link');
                  addToLog('Clicked Dashboard link');
                }}
              >
                Go to Dashboard
              </Link>
              <Link 
                href="/admin/support"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  setManualLog('Clicked Support link');
                  addToLog('Clicked Support link');
                }}
              >
                Go to Support
              </Link>
              <Link 
                href="/admin/bookings"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => {
                  setManualLog('Clicked Bookings link');
                  addToLog('Clicked Bookings link');
                }}
              >
                Go to Bookings
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              Last clicked: {manualLog || 'None'}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800 mb-2">Current Path</h2>
            <p className="text-lg font-mono text-gray-600">{pathname}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="font-semibold text-yellow-800 mb-2">Navigation Log</h2>
            <div className="max-h-60 overflow-y-auto">
              {navigationLog.map((log, index) => (
                <div key={index} className="text-sm text-gray-600 py-1 border-b border-gray-200 last:border-0">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}