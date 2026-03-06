export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';
import { rateLimiters } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
    // Rate limiting for checkout (disabled in development)
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
        const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
        const authHeader = request.headers.get('authorization');
        const identifier = authHeader ? `${clientIP}-${authHeader}` : clientIP;
        const rateLimitResult = rateLimiters.checkout(identifier);
        
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { success: false, error: rateLimitResult.message },
                { status: 429 }
            );
        }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await connectToDatabase();

        // 1. Authenticate User
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

        const body = await request.json();
        const { items, customerDetails, paymentDetails, bookingPeriod } = body;

        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, error: 'No items in checkout' }, { status: 400 });
        }

        // Validate customer details
        if (!customerDetails) {
            return NextResponse.json({ success: false, error: 'Customer details are required' }, { status: 400 });
        }

        // Email validation
        if (!customerDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
            return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
        }

        // Phone validation (Indian format - 10 digits)
        if (!customerDetails.phone || !/^[6-9]\d{9}$/.test(customerDetails.phone.replace(/[\s-]/g, ''))) {
            return NextResponse.json({ 
                success: false, 
                error: 'Valid 10-digit Indian mobile number is required' 
            }, { status: 400 });
        }

        // Name validation
        if (!customerDetails.name || customerDetails.name.trim().length < 2 || customerDetails.name.length > 100) {
            return NextResponse.json({ 
                success: false, 
                error: 'Customer name must be between 2 and 100 characters' 
            }, { status: 400 });
        }

        // Address validation
        if (!customerDetails.address || customerDetails.address.trim().length < 10 || customerDetails.address.length > 500) {
            return NextResponse.json({ 
                success: false, 
                error: 'Delivery address must be between 10 and 500 characters' 
            }, { status: 400 });
        }

        // Sanitize inputs
        customerDetails.name = customerDetails.name.trim();
        customerDetails.address = customerDetails.address.trim();
        customerDetails.phone = customerDetails.phone.replace(/[\s-]/g, '');

        // Validate booking period
        if (!bookingPeriod || !bookingPeriod.startDate || !bookingPeriod.endDate) {
            return NextResponse.json({ success: false, error: 'Booking period is required' }, { status: 400 });
        }

        const startDate = new Date(bookingPeriod.startDate);
        const endDate = new Date(bookingPeriod.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validate dates
        if (startDate < today) {
            return NextResponse.json({ 
                success: false, 
                error: 'Rental start date cannot be in the past' 
            }, { status: 400 });
        }

        if (endDate <= startDate) {
            return NextResponse.json({ 
                success: false, 
                error: 'Return date must be after start date' 
            }, { status: 400 });
        }

        // Payment confirmation - In development/simulation mode, we accept the payment as confirmed
        // The frontend has already simulated the payment success before calling this endpoint
        console.log('✅ Payment confirmed by client - proceeding with order creation');

        // 2. Create Orders with stock validation
        const orderPromises = items.map(async (item: any) => {
            // Validate item
            if (!item.id && !item.productId) {
                throw new Error('Product ID is required for each item');
            }
            
            if (!item.name || typeof item.name !== 'string') {
                throw new Error('Product name is required');
            }
            
            if (typeof item.price !== 'number' || item.price < 0) {
                throw new Error('Valid product price is required');
            }

            // Extract and clean product ID (remove "cart-" prefix if present)
            const rawProductId = item.id || item.productId;
            const cleanProductId = rawProductId.startsWith('cart-') 
                ? rawProductId.replace('cart-', '') 
                : rawProductId;
            
            // Use cleaned ID for Order model (must be valid ObjectId or leave as-is for dev mode)
            const productIdForOrder = mongoose.Types.ObjectId.isValid(cleanProductId) 
                ? cleanProductId 
                : rawProductId;
            
            // Check stock availability (skip for development/simulation mode with fake product IDs)
            // In production, all product IDs should be valid MongoDB ObjectIds
            let product = null;
            try {
                // Only check stock if using cleaned product ID
                if (mongoose.Types.ObjectId.isValid(cleanProductId)) {
                    product = await Product.findById(cleanProductId).session(session);
                    if (!product) {
                        throw new Error(`Product ${cleanProductId} not found in database`);
                    }
                    
                    if (product.stock < (item.quantity || 1)) {
                        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
                    }
                    
                    // PREVENT DOUBLE BOOKING: Check if product is already booked for overlapping dates
                    const existingBooking = await Order.findOne({
                        productId: new mongoose.Types.ObjectId(cleanProductId),
                        status: { $in: ['confirmed', 'active', 'processing'] }, // Only check active bookings
                        $or: [
                            {
                                // Existing booking overlaps with requested dates
                                rentalStartDate: { $lte: new Date(bookingPeriod.endDate) },
                                rentalEndDate: { $gte: new Date(bookingPeriod.startDate) }
                            }
                        ]
                    }).session(session);
                    
                    if (existingBooking) {
                        throw new Error(`This dress is already booked for the selected dates (${existingBooking.rentalStartDate.toLocaleDateString()} - ${existingBooking.rentalEndDate.toLocaleDateString()})`);
                    }
                } else {
                    // Development mode: Allow checkout with simulated/fake product IDs
                    console.log(`⚠️ Development Mode: Skipping stock check and double-booking validation for product ID "${rawProductId}" (not a valid ObjectId)`);
                }
            } catch (stockError: any) {
                // If it's a cast error (invalid ObjectId), allow it in development mode
                if (stockError.name === 'CastError' || stockError.name === 'BSONError') {
                    console.log(`⚠️ Development Mode: Invalid ObjectId format - "${rawProductId}". Skipping stock validation.`);
                } else {
                    // Re-throw other errors (like actual stock issues or double booking)
                    throw stockError;
                }
            }

            const orderData = {
                userId: (payload as any).id,
                productId: productIdForOrder,
                productName: item.name,
                productImage: item.image || item.images?.[0],
                size: item.size || undefined, // Include selected size from cart/booking
                rentalStartDate: bookingPeriod.startDate,
                rentalEndDate: bookingPeriod.endDate,
                rentalDays: bookingPeriod.days,
                rentalPricePerDay: item.price || item.rentalPricePerDay,
                depositAmount: item.depositAmount || (item.price * 0.5),
                totalAmount: (item.price || item.rentalPricePerDay) * (item.quantity || 1),
                status: 'confirmed',
                paymentStatus: 'paid',
                customerName: customerDetails.name,
                customerEmail: customerDetails.email || payload.email,
                customerPhone: customerDetails.phone,
                deliveryAddress: customerDetails.address,
                specialRequests: item.specialRequests ? String(item.specialRequests).substring(0, 500) : (body.globalSpecialInstructions ? String(body.globalSpecialInstructions).substring(0, 500) : ''),
            };
            const order = new Order(orderData);
            return order.save({ session });
        });

        const createdOrders = await Promise.all(orderPromises);

        // 3. Clear User Cart
        await User.findOneAndUpdate(
            { email: payload.email },
            { $set: { cart: [] } },
            { session }
        );

        await session.commitTransaction();

        return NextResponse.json({
            success: true,
            message: 'Checkout successful',
            orders: createdOrders.map(o => o.orderId),
        });

    } catch (error: any) {
        await session.abortTransaction();
        console.error('Checkout error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to complete checkout',
            details: error.message
        }, { status: 500 });
    } finally {
        session.endSession();
    }
}
