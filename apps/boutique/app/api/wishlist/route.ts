import { NextResponse } from 'next/server';
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

export async function GET(request: Request) {
    try {
        const payload = await authenticate(request);
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();
        const user = await User.findOne({ email: payload.email }).populate('wishlist');
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: user.wishlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const payload = await authenticate(request);
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { productId } = body;

        if (!productId) return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });

        await connectToDatabase();
        const user = await User.findOne({ email: payload.email });
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        if (!user.wishlist.includes(productId as any)) {
            user.wishlist.push(productId as any);
            await user.save();
        }

        return NextResponse.json({ success: true, data: user.wishlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const payload = await authenticate(request);
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });

        await connectToDatabase();
        const user = await User.findOne({ email: payload.email });
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        return NextResponse.json({ success: true, data: user.wishlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
