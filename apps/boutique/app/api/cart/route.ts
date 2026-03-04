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
        const user = await User.findOne({ email: payload.email }).populate('cart.productId');
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: user.cart });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const payload = await authenticate(request);
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { productId, quantity = 1, rentalDays = 3, size = 'Medium' } = body;

        if (!productId) return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });

        await connectToDatabase();
        const user = await User.findOne({ email: payload.email });
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        const existingCartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (existingCartItemIndex > -1) {
            // update quantity
            user.cart[existingCartItemIndex].quantity += quantity;
            user.cart[existingCartItemIndex].rentalDays = rentalDays;
            user.cart[existingCartItemIndex].size = size;
        } else {
            user.cart.push({ productId, quantity, rentalDays, size });
        }

        await user.save();
        return NextResponse.json({ success: true, data: user.cart });
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

        await connectToDatabase();
        const user = await User.findOne({ email: payload.email });
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        if (productId) {
            user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        } else {
            user.cart = []; // Clear cart
        }

        await user.save();
        return NextResponse.json({ success: true, data: user.cart });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
