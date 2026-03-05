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
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token);

        const user = await User.findOne({ email: payload.email });
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const orders = await Order.find({ userId: user._id.toString() }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        // For now, allow unauthenticated order creation (for guest checkout)
        // You can add authentication later if needed
        const body = await request.json();
        
        const newOrder = new Order(body);
        await newOrder.save();

        return NextResponse.json({
            success: true,
            data: { orderId: newOrder._id },
            message: 'Order created successfully'
        });
    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
