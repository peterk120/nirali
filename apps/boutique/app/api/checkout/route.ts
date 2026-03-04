import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';
import { paymentService } from '@/services/payment.service';

export async function POST(request: NextRequest) {
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

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, error: 'No items in checkout' }, { status: 400 });
        }

        // 1.5 Verify Payment Signature
        if (!paymentDetails || !paymentDetails.razorpayOrderId || !paymentDetails.razorpayPaymentId || !paymentDetails.razorpaySignature) {
            return NextResponse.json({ success: false, error: 'Payment details are missing' }, { status: 400 });
        }

        const isPaymentValid = paymentService.verifyPayment({
            orderId: paymentDetails.razorpayOrderId,
            paymentId: paymentDetails.razorpayPaymentId,
            signature: paymentDetails.razorpaySignature
        });

        if (!isPaymentValid) {
            return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
        }

        // 2. Create Orders
        const orderPromises = items.map(async (item: any) => {
            const orderData = {
                userId: (payload as any).id,
                productId: item.id || item.productId,
                productName: item.name,
                productImage: item.image || item.images?.[0],
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
                specialRequests: item.specialRequests || body.globalSpecialInstructions || '',
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
