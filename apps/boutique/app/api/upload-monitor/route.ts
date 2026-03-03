// Real-time upload monitoring endpoint
import { NextRequest } from 'next/server';

// In-memory storage for monitoring upload events
let uploadEvents: any[] = [];

export async function GET(request: NextRequest) {
  return Response.json({
    success: true,
    events: uploadEvents,
    count: uploadEvents.length,
    last5: uploadEvents.slice(-5)
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const event = {
      timestamp: new Date().toISOString(),
      type: data.type || 'unknown',
      details: data.details || {},
      status: data.status || 'info'
    };
    
    uploadEvents.push(event);
    
    // Keep only last 50 events
    if (uploadEvents.length > 50) {
      uploadEvents = uploadEvents.slice(-50);
    }
    
    return Response.json({
      success: true,
      message: 'Event logged',
      event
    });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Clear events
export async function DELETE(request: NextRequest) {
  uploadEvents = [];
  return Response.json({
    success: true,
    message: 'Events cleared',
    count: 0
  });
}