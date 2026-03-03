'use client';

import { useEffect } from 'react';

export default function TestEmbedPage() {
  useEffect(() => {
    console.log('Test page loaded');
    console.log('Window location:', window.location.href);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600">This is a test page to check if routing works correctly.</p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-500">
            Current URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}
          </p>
        </div>
      </div>
    </div>
  );
}