export const dynamic = 'force-dynamic';
// Razorpay Webhook Handler for Local Development
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

// Razorpay webhook secret (should be in environment variables)
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'your-webhook-secret-here';

export async function POST(req: NextRequest) {
  try {
    console.log('🔄 Razorpay Webhook Received - Starting processing...');
    
    // Connect to database
    await connectToDatabase();
    console.log('✅ Database connected for webhook processing');

    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    
    console.log('📝 Webhook Headers:', {
      'x-razorpay-signature': signature ? 'Present' : 'Missing',
      'content-type': req.headers.get('content-type'),
      'content-length': req.headers.get('content-length')
    });

    // Verify webhook signature
    if (!signature) {
      console.error('❌ Missing Razorpay signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify the signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    const isVerified = signature === expectedSignature;
    
    console.log('🔐 Signature Verification:', {
      received: signature.substring(0, 20) + '...',
      expected: expectedSignature.substring(0, 20) + '...',
      verified: isVerified
    });

    if (!isVerified) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(rawBody);
    console.log('📦 Webhook Event Type:', webhookData.event);
    console.log('📄 Webhook Payload Summary:', {
      event: webhookData.event,
      entity: webhookData.payload?.payment?.entity,
      payment_id: webhookData.payload?.payment?.entity?.id,
      order_id: webhookData.payload?.payment?.entity?.order_id,
      amount: webhookData.payload?.payment?.entity?.amount,
      status: webhookData.payload?.payment?.entity?.status
    });

    // Handle different webhook events
    switch (webhookData.event) {
      case 'payment.captured':
        await handlePaymentCaptured(webhookData.payload.payment.entity);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(webhookData.payload.payment.entity);
        break;
        
      case 'order.paid':
        await handleOrderPaid(webhookData.payload.order.entity);
        break;
        
      default:
        console.log(`⚠️  Unhandled webhook event: ${webhookData.event}`);
    }

    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle successful payment capture
async function handlePaymentCaptured(payment: any) {
  console.log('💰 Payment Captured Event:', {
    payment_id: payment.id,
    order_id: payment.order_id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    method: payment.method,
    captured: payment.captured
  });

  // Here you would typically:
  // 1. Update order status in database
  // 2. Create booking record
  // 3. Send confirmation emails
  // 4. Update inventory
  
  // Example: Create a booking record
  try {
    // This is a simplified example - you'd create proper booking/order models
    const bookingData = {
      razorpay_payment_id: payment.id,
      razorpay_order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      status: 'confirmed',
      payment_method: payment.method,
      captured_at: new Date(),
      customer_email: payment.email || 'test@example.com'
    };
    
    console.log('📝 Booking Data to Save:', bookingData);
    // await Booking.create(bookingData); // Uncomment when you have Booking model
    
    console.log('✅ Booking record would be created');
  } catch (error) {
    console.error('❌ Error creating booking:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(payment: any) {
  console.log('❌ Payment Failed Event:', {
    payment_id: payment.id,
    order_id: payment.order_id,
    amount: payment.amount,
    failure_reason: payment.error_description,
    status: payment.status
  });

  // Here you would typically:
  // 1. Update order status to failed
  // 2. Send failure notification
  // 3. Handle retry logic
}

// Handle order paid event
async function handleOrderPaid(order: any) {
  console.log('📦 Order Paid Event:', {
    order_id: order.id,
    amount: order.amount,
    status: order.status,
    created_at: order.created_at
  });

  // Handle order completion logic
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'Webhook endpoint is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}