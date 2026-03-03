export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { paymentService } from '../../../../services/payment.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Create order request body:', body);
    const { amount, currency = 'INR', receipt, notes } = body;

    if (!amount || !receipt) {
      console.log('Missing amount or receipt:', { amount, receipt });
      return NextResponse.json(
        { error: 'Amount and receipt are required' },
        { status: 400 }
      );
    }

    const order = await paymentService.createOrder({
      amount,
      currency,
      receipt,
      notes
    });
    
    console.log('Order created successfully:', order);

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}