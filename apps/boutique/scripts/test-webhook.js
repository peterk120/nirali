// Test Webhook Processing
const crypto = require('crypto');

// Test webhook payload (simulating Razorpay)
const testPayload = {
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_Jhf1Hj4k3k3k3k",
        "entity": "payment",
        "amount": 50000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_Jhf1Hj4k3k3k3k",
        "method": "card",
        "captured": true,
        "email": "test@example.com",
        "contact": "+919876543210"
      }
    }
  }
};

const WEBHOOK_SECRET = 'webhook_secret_12345';
const rawBody = JSON.stringify(testPayload);

// Generate signature (same as Razorpay would)
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(rawBody)
  .digest('hex');

console.log('🧪 Webhook Test Data:');
console.log('Payload:', JSON.stringify(testPayload, null, 2));
console.log('Signature:', signature);
console.log('Webhook Secret:', WEBHOOK_SECRET);
console.log('');
console.log('📋 To test manually:');
console.log('curl -X POST http://localhost:3001/api/payment/webhook \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-Razorpay-Signature: ' + signature + '" \\');
console.log('  -d \'' + rawBody + '\'');