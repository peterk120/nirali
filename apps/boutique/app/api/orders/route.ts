export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Order from '../../../models/Order';

// Test if model is properly imported
console.log('Order model:', Order);

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const query: any = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;

    // Pagination
    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalItems: totalOrders,
        hasNextPage: page < Math.ceil(totalOrders / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const { verifyToken } = await import('../../../lib/auth');
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    await connectToDatabase();
    console.log('Connected to database');

    const body = await request.json();
    console.log('Received order data:', body);

    // Use dynamic data from the request body
    const orderData = {
      userId: body.userId || 'guest-user',
      productId: body.productId,
      productName: body.productName,
      productImage: body.productImage,
      rentalStartDate: body.rentalStartDate,
      rentalEndDate: body.rentalEndDate,
      rentalDays: body.rentalDays,
      rentalPricePerDay: body.rentalPricePerDay,
      depositAmount: body.depositAmount,
      totalAmount: body.totalAmount,
      status: 'confirmed', // As requested, make it confirmed initially
      paymentStatus: 'paid', // As requested, skip payment for now
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      deliveryAddress: body.deliveryAddress,
      specialRequests: body.specialRequests || '',
    };

    console.log('Creating order with dynamic data:', orderData);

    // Create new order
    const order = new Order(orderData);

    console.log('Order instance created:', order.orderId);

    await order.save();
    console.log('Order saved successfully:', order.orderId);

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order', details: (error as Error).message },
      { status: 500 }
    );
  }
}