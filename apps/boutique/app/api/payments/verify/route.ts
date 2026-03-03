import { NextResponse } from 'next/server';
import { paymentService } from '../../../../services/payment.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Verification request body:', body);
    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId || !signature) {
      console.log('Missing required fields:', { orderId, paymentId, signature });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const isValid = paymentService.verifyPayment({
      orderId,
      paymentId,
      signature
    });
    
    console.log('Payment verification result:', isValid);
    console.log('OrderId:', orderId);
    console.log('PaymentId:', paymentId);

    if (!isValid) {
      console.log('Invalid payment signature');
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Here you would typically update the booking status in your database
    // For now, we'll just return success

    console.log('Payment verified successfully, returning success');
    return NextResponse.json({ 
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}