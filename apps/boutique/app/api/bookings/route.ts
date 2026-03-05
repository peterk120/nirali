export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        // Get authorization token from headers
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if token is actually present and not literal "null"
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        if (!token || token === 'null') {
            // In temporary mode, we still allow based on email if we have one
            // But we log the warning
            console.warn('Booking fetch attempt with missing or "null" token');
        }

        // Temporary: Get user from query param (replace with actual auth)
        const searchParams = request.nextUrl.searchParams;
        const userEmail = searchParams.get('email'); // Use email as identifier

        if (!userEmail) {
            return Response.json(
                { success: false, error: 'User email required' },
                { status: 400 }
            );
        }

        // Find user by email to get their ID
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return Response.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Fetch orders/bookings for this user
        const bookings = await Order.find({ userId: user._id.toString() }).sort({ createdAt: -1 });

        return Response.json({
            success: true,
            data: bookings,
            count: bookings.length
        });
    } catch (error: any) {
        console.error('Error fetching bookings:', error);
        return Response.json(
            { success: false, error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}
