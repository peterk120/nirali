import crypto from 'crypto';

interface CreateOrderParams {
  amount: number; // Amount in paise (smallest currency unit)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

interface RefundParams {
  paymentId: string;
  amount?: number;
  reason?: string;
}

class PaymentService {
  private readonly keyId: string;
  private readonly keySecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_SKM0b29EDWHcE1';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'wf4e1svXGuX2r7TEPoA1ALd1';
  }

  /**
   * Create a new Razorpay order
   */
  async createOrder(params: CreateOrderParams) {
    const { amount, currency, receipt, notes } = params;
    
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes: notes || {}
    };

    try {
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`,
          'User-Agent': 'NiraliBoutique/1.0'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Razorpay API error: ${response.status} ${response.statusText}`);
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Verify payment signature
   */
  verifyPayment(params: VerifyPaymentParams): boolean {
    const { orderId, paymentId, signature } = params;
    
    // Create the string to be verified
    const payload = `${orderId}|${paymentId}`;
    
    // Create HMAC-SHA256 hash
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(payload)
      .digest('hex');

    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Process refund
   */
  async processRefund(params: RefundParams) {
    const { paymentId, amount, reason } = params;

    const refundData = {
      ...(amount && { amount: Math.round(amount * 100) }), // Convert to paise
      ...(reason && { notes: { reason } })
    };

    try {
      const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`,
          'User-Agent': 'NiraliBoutique/1.0'
        },
        body: JSON.stringify(refundData)
      });

      if (!response.ok) {
        throw new Error(`Razorpay refund API error: ${response.status} ${response.statusText}`);
      }

      const refund = await response.json();
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

export const paymentService = new PaymentService();