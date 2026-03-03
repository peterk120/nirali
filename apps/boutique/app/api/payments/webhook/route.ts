import { NextResponse } from 'next/server';
import { paymentService } from '../../../../services/payment.service';

export async function POST(request: Request) {
  try {
    // Get raw body as text for signature verification
    const rawBody = await request.text();
    
    // Get signature from headers
    const signature = request.headers.get('X-Razorpay-Signature') || '';
    
    // Verify webhook signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_12345';
    
    const isValid = paymentService.verifyWebhookSignature(rawBody, signature, secret);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);

    // Handle different event types
    const eventType = payload.event;
    const paymentData = payload.payload.payment.entity;

    switch (eventType) {
      case 'payment.captured':
        console.log('Payment captured:', paymentData);
        // Update booking status to paid in database
        // Add your business logic here
        break;

      case 'payment.failed':
        console.log('Payment failed:', paymentData);
        // Handle failed payment
        // Add your business logic here
        break;

      case 'refund.created':
        console.log('Refund created:', payload.payload.refund.entity);
        // Update refund status
        // Add your business logic here
        break;

      default:
        console.log('Unhandled event type:', eventType);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}