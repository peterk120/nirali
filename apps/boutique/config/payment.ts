/**
 * Payment Configuration
 * 
 * Toggle between Development (Simulated) and Production (Real Razorpay) modes
 */

// Set to true for development/testing (bypasses Razorpay)
// Set to false for production (uses real Razorpay payments)
export const SIMULATE_PAYMENT = true;

// Simulated payment signature for development mode
export const SIMULATED_SIGNATURE = 'SIM_SIG_123456789';

// Payment processing delay in milliseconds (simulates network latency)
export const PAYMENT_DELAY_MS = 1500;

// Auto-redirect to bookings page after success (in milliseconds)
// This starts counting from when payment completes, includes 8s modal countdown
export const REDIRECT_DELAY_MS = 9000; // 1.5s processing + 8s modal countdown
