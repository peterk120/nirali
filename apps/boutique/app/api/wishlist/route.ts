export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// Helper to authenticate request
async function authenticate(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try {
        return await verifyToken(token);
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const payload = await authenticate(request);
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();
        const user = await User.findOne({ email: payload.email }).populate('wishlist.productId');
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: user.wishlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const payload = await authenticate(request);
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { productId, action = 'add' } = body;

        if (!productId) return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });

        await connectToDatabase();
        const user = await User.findOne({ email: payload.email });
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        const existingWishlistIndex = user.wishlist.findIndex(item => item.toString() === productId);

        if (existingWishlistIndex > -1) {
            if (action === 'remove') {
                user.wishlist.splice(existingWishlistIndex, 1);
            } else {
                // Already in wishlist, no change needed
                return NextResponse.json({ success: true, data: user.wishlist });
            }
        } else {
            if (action === 'add') {
                user.wishlist.push(productId);
            }
        }

        await user.save();
        return NextResponse.json({ success: true, data: user.wishlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
