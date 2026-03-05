# Payment Simulation Mode Guide

## Overview

This system supports **two payment modes**:
1. **Development Mode** - Simulated payments (bypasses Razorpay)
2. **Production Mode** - Real Razorpay payments

Currently configured for **Development Mode** to allow testing without a verified Razorpay account.

---

## Quick Start

### Current Configuration (Development Mode)
```typescript
// config/payment.ts
export const SIMULATE_PAYMENT = true;  // ✅ Currently enabled
```

When `SIMULATE_PAYMENT = true`:
- ✅ No Razorpay gateway opens
- ✅ Payment is simulated after 1.5 second delay
- ✅ Orders are created in database normally
- ✅ All booking features work as expected
- ✅ Perfect for testing and development

---

## How It Works

### Development Mode Flow (`SIMULATE_PAYMENT = true`)

```
User clicks "Pay Now"
    ↓
Wait 1.5 seconds (simulated processing)
    ↓
Call /api/checkout with simulated signature
    ↓
Backend detects simulation mode
    ↓
Skip real payment verification
    ↓
Create orders in database
    ↓
Clear cart
    ↓
Return success
    ↓
Show success modal after 3 seconds
    ↓
Redirect to bookings page after 11 seconds
```

### Production Mode Flow (`SIMULATE_PAYMENT = false`)

```
User clicks "Pay Now"
    ↓
Open Razorpay payment gateway
    ↓
User completes payment
    ↓
Razorpay verifies payment
    ↓
Call /api/checkout with real signature
    ↓
Backend verifies Razorpay signature
    ↓
Create orders in database
    ↓
Clear cart
    ↓
Return success
    ↓
Show success modal
    ↓
Redirect to bookings page
```

---

## Configuration Options

### File: `config/payment.ts`

```typescript
// Toggle between modes
export const SIMULATE_PAYMENT = true;  // true = Development, false = Production

// Simulated signature for development
export const SIMULATED_SIGNATURE = 'SIM_SIG_123456789';

// Timing configurations (milliseconds)
export const PAYMENT_DELAY_MS = 1500;        // Simulated processing time
export const SUCCESS_MODAL_DELAY_MS = 3000;  // Wait before showing success modal
export const REDIRECT_DELAY_MS = 11000;      // Wait before redirect (3s + 8s countdown)
```

---

## Switching Between Modes

### To Enable Development Mode (Current):
```typescript
// config/payment.ts
export const SIMULATE_PAYMENT = true;
```

**Result:** Payments are simulated, no real money involved.

### To Enable Production Mode:
```typescript
// config/payment.ts
export const SIMULATE_PAYMENT = false;
```

**Result:** Real Razorpay gateway will open for actual payments.

**Requirements for Production Mode:**
1. ✅ Verified Razorpay account
2. ✅ `NEXT_PUBLIC_RAZORPAY_KEY_ID` environment variable set
3. ✅ `RAZORPAY_KEY_SECRET` environment variable set
4. ✅ Uncomment Razorpay code in `payment/page.tsx`

---

## Backend Behavior

### In Development Mode:
```javascript
// /api/checkout/route.ts
const isSimulation = paymentDetails.razorpaySignature === 'SIM_SIG_123456789';

if (isSimulation) {
  console.log('⚠️ Development Mode: Skipping real verification');
  // Skip payment verification
} else {
  // Verify real Razorpay signature
}
```

**Database Operations:**
- ✅ Orders created normally
- ✅ Stock deducted properly
- ✅ Cart cleared successfully
- ✅ All data saved correctly

**The only difference:** Payment signature is not verified.

---

## Testing the Flow

### 1. Add Products to Cart
- Browse products and add to cart
- Select sizes when prompted

### 2. Proceed to Checkout
- Go to cart page
- Click "Checkout" or "Book Now"

### 3. Fill Customer Details
- Enter name, email, phone
- Enter delivery address
- Select rental dates

### 4. Click "Pay Now"
**In Development Mode:**
- No Razorpay popup
- Console shows: `💰 Development Mode: Simulating payment...`
- After 1.5s: `✅ Payment simulated successfully`
- Orders created in database

### 5. Success Modal
- Appears after 3 seconds
- Shows booking confirmation
- Displays order ID and details
- Countdown timer: 8 seconds

### 6. Redirect
- Automatically redirects to `/dashboard/bookings`
- Can manually click "View My Bookings" to go early

---

## Multi-Product Checkout

Both modes support **multiple products in cart**:

**Example Cart:**
- Silk Saree (Size M) - ₹8,500/day
- Designer Lehenga (Size L) - ₹12,500/day
- Bridal Jewelry Set - ₹5,000/day

**Result:**
- 3 separate orders created (one per product)
- Each order has unique order ID
- All share same customer details
- All share same rental dates
- Total charged: Sum of all items × days + deposits

---

## Database Records

### Order Collection (Per Product):
```javascript
{
  orderId: "ORD-1772515812-456",
  userId: "user123",
  productId: ObjectId("..."),
  productName: "Elegant Silk Saree",
  rentalStartDate: Date("2026-03-10"),
  rentalEndDate: Date("2026-03-13"),
  rentalDays: 3,
  rentalPricePerDay: 8500,
  depositAmount: 4250,
  totalAmount: 25500,
  status: "confirmed",
  paymentStatus: "paid",  // ✅ Set to "paid" in both modes
  customerName: "John Doe",
  customerEmail: "john@example.com",
  createdAt: Date("2026-03-05")
}
```

### User Collection:
```javascript
{
  _id: ObjectId("user123"),
  email: "john@example.com",
  name: "John Doe",
  cart: [],  // ✅ Cleared after successful checkout
  role: "user"
}
```

---

## Environment Variables

### For Development Mode:
No environment variables required. Simulation works out of the box.

### For Production Mode:
```bash
# .env.local or Vercel environment variables
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

---

## Security Notes

### ⚠️ Important for Production Deployment:

1. **Disable Simulation Mode:**
   ```typescript
   // config/payment.ts
   export const SIMULATE_PAYMENT = false;
   ```

2. **Remove Simulation Code from Backend:**
   ```javascript
   // app/api/checkout/route.ts
   // REMOVE this section in production:
   
   // DELETE THESE LINES:
   const isSimulation = paymentDetails.razorpaySignature === 'SIM_SIG_123456789';
   if (!isSimulation) { ... }
   ```

3. **Always Verify Payments:**
   ```javascript
   // PRODUCTION CODE:
   const isPaymentValid = paymentService.verifyPayment({...});
   if (!isPaymentValid) {
     return NextResponse.json({ success: false, error: 'Payment failed' });
   }
   ```

4. **Use Environment Variables:**
   - Never hardcode API keys
   - Use `.env` files or Vercel dashboard
   - Keep secrets server-side only

---

## Troubleshooting

### Issue: Payment always simulates even in production mode
**Solution:** Check `config/payment.ts` - ensure `SIMULATE_PAYMENT = false`

### Issue: Razorpay not opening in production mode
**Solutions:**
1. Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
2. Check browser console for errors
3. Ensure Razorpay script loads successfully
4. Test with small amount first

### Issue: Orders not created after payment
**Debug Steps:**
1. Check browser console for errors
2. Check backend logs in terminal
3. Verify database connection
4. Check stock availability for products

### Issue: Cart not clearing after checkout
**Debug Steps:**
1. Check if checkout API returned success
2. Verify user email matches token
3. Check MongoDB connection
4. Look for transaction rollback errors

---

## Future Enhancements

When ready for production:

1. **Update Frontend:**
   ```typescript
   // config/payment.ts
   export const SIMULATE_PAYMENT = false;
   ```

2. **Uncomment Razorpay Code:**
   - In `payment/page.tsx`
   - Remove comments from production mode section

3. **Test Thoroughly:**
   - Use Razorpay test mode first
   - Make small real payments
   - Verify all orders created correctly

4. **Monitor Logs:**
   - Watch for payment verification failures
   - Track successful transactions
   - Debug any edge cases

---

## Summary

| Feature | Development Mode | Production Mode |
|---------|-----------------|-----------------|
| `SIMULATE_PAYMENT` | `true` | `false` |
| Razorpay Opens | ❌ No | ✅ Yes |
| Payment Verified | ❌ No | ✅ Yes |
| Orders Created | ✅ Yes | ✅ Yes |
| Database Updated | ✅ Yes | ✅ Yes |
| Cart Cleared | ✅ Yes | ✅ Yes |
| Real Money Charged | ❌ No | ✅ Yes |
| Use Case | Testing/Dev | Live Customers |

---

**Current Status:** ✅ Development Mode Active

You can safely test the entire booking flow without real payments!
