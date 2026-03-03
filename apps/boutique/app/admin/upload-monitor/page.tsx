'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@nirali-sai/ui';

export default function UploadMonitorPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/upload-monitor');
        const data = await response.json();
        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(fetchEvents, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const clearEvents = async () => {
    try {
      await fetch('/api/upload-monitor', { method: 'DELETE' });
      setEvents([]);
    } catch (error) {
      console.error('Failed to clear events:', error);
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'upload_success': return 'text-green-600';
      case 'upload_failed': return 'text-red-600';
      case 'upload_error': return 'text-red-600';
      case 'upload_start': return 'text-blue-600';
      case 'image_selected': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'upload_success': return '✅';
      case 'upload_failed': return '❌';
      case 'upload_error': return '⚠️';
      case 'upload_start': return '🚀';
      case 'image_selected': return '🖼️';
      default: return 'ℹ️';
    }
  };

  if (loading) {
    return <div className="p-6">Loading monitor...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upload Monitor</h1>
        <button
          onClick={clearEvents}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Events
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Total Events</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Successful Uploads</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {events.filter(e => e.type === 'upload_success').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Failed Uploads</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {events.filter(e => e.type === 'upload_failed' || e.type === 'upload_error').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No upload events yet. Upload something to see events here.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...events].reverse().map((event, index) => (
                <div 
                  key={index} 
                  className="p-3 border rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(event.type)}</span>
                      <span className={`font-semibold ${getStatusColor(event.type)}`}>
                        {event.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {event.details && (
                    <div className="mt-2 text-sm text-gray-700">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}