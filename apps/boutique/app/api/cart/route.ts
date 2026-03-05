export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { rateLimiters } from '@/lib/rateLimiter';

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

        // Rate limiting
        const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitResult = rateLimiters.cart(`${clientIP}-${payload.email}`);
        
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { success: false, error: rateLimitResult.message },
                { status: 429 }
            );
        }

        await connectToDatabase();
        const user = await User.findOne({ email: payload.email }).populate('cart.productId');
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: user.cart });
    } catch (error: any) {
        console.error('Cart GET error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const payload = await authenticate(request);
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        // Rate limiting
        const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitResult = rateLimiters.cart(`${clientIP}-${payload.email}`);
        
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { success: false, error: rateLimitResult.message },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { productId, quantity = 1, rentalDays = 3, size = 'Medium', action = 'add' } = body;

        // Validate productId
        if (!productId) return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
        
        // Validate quantity - must be positive integer and reasonable limit
        if (typeof quantity !== 'number' || quantity < 1 || quantity > 10 || !Number.isInteger(quantity)) {
            return NextResponse.json({ 
                success: false, 
                error: 'Quantity must be a positive integer between 1 and 10' 
            }, { status: 400 });
        }
        
        // Validate rentalDays
        if (typeof rentalDays !== 'number' || rentalDays < 1 || rentalDays > 30 || !Number.isInteger(rentalDays)) {
            return NextResponse.json({ 
                success: false, 
                error: 'Rental days must be between 1 and 30' 
            }, { status: 400 });
        }
        
        // Sanitize size
        const sanitizedSize = typeof size === 'string' ? size.trim().substring(0, 20) : 'Medium';

        await connectToDatabase();
        const user = await User.findOne({ email: payload.email });
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        const existingCartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (existingCartItemIndex > -1) {
            if (action === 'set') {
                user.cart[existingCartItemIndex].quantity = quantity;
            } else {
                user.cart[existingCartItemIndex].quantity += quantity;
                // Cap quantity at 10
                if (user.cart[existingCartItemIndex].quantity > 10) {
                    user.cart[existingCartItemIndex].quantity = 10;
                }
            }
            user.cart[existingCartItemIndex].rentalDays = rentalDays;
            user.cart[existingCartItemIndex].size = sanitizedSize;
        } else {
            user.cart.push({ productId, quantity, rentalDays, size: sanitizedSize });
        }

        await user.save();
        return NextResponse.json({ success: true, data: user.cart });
    } catch (error: any) {
        console.error('Cart POST error:', error);
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
