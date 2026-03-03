import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');
    const productType = searchParams.get('productType') || 'dress';

    // Validate required parameters
    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId and productId are required' },
        { status: 400 }
      );
    }

    // Mock verification logic - in a real app this would check the database
    // to see if the user has completed a booking for this product
    const hasCompletedBooking = true; // Mock response - in real app would check db

    return NextResponse.json({
      userId,
      productId,
      productType,
      hasCompletedBooking,
      bookingId: hasCompletedBooking ? `BK${Math.floor(100000 + Math.random() * 900000)}` : null
    });
  } catch (error) {
    console.error('Error verifying booking:', error);
    return NextResponse.json(
      { error: 'Failed to verify booking' },
      { status: 500 }
    );
  }
}