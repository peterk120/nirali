/**
 * Simple in-memory rate limiter for API routes
 * Note: For production with multiple instances, use Redis-based rate limiting
 */

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitInfo>();

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum requests per window
  message?: string; // Error message
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max, message = 'Too many requests, please try again later' } = options;

  return function rateLimitHandler(identifier: string): { success: boolean; message?: string; retryAfter?: number } {
    const now = Date.now();
    const existing = rateLimitStore.get(identifier);

    if (!existing || now > existing.resetTime) {
      // First request or window expired
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return { success: true };
    }

    if (existing.count >= max) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((existing.resetTime - now) / 1000);
      return { 
        success: false, 
        message,
        retryAfter
      };
    }

    // Increment counter
    existing.count++;
    rateLimitStore.set(identifier, existing);
    return { success: true };
  };
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // Login attempts: 5 per 15 minutes
  login: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Please try again in 15 minutes.'
  }),

  // General API calls: 100 per minute
  general: createRateLimiter({
    windowMs: 60 * 1000,
    max: 100,
    message: 'Too many requests. Please slow down.'
  }),

  // Cart operations: 30 per minute
  cart: createRateLimiter({
    windowMs: 60 * 1000,
    max: 30,
    message: 'Too many cart operations. Please try again later.'
  }),

  // Checkout: 5 per minute
  checkout: createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many checkout attempts. Please try again later.'
  })
};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);
