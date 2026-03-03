export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { paymentService } from '../../../../services/payment.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, amount, reason } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    const refund = await paymentService.processRefund({
      paymentId,
      amount,
      reason
    });

    return NextResponse.json({ refund });
  } catch (error) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}