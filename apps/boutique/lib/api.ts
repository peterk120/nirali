import {
  User,
  Address,
  WishlistItem,
  Dress,
  BookedSlot,
  Jewellery,
  Product,
  Artist,
  Booking,
  Order,
  Review,
  Coupon,
  LoyaltyTransaction,
  ApiResponse,
  PaginatedResponse
} from '@nirali-sai/types';

// Base fetcher function
async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  // Use relative path for API routes (works in both local and Vercel)
  // In serverless/edge environments, Next.js handles relative paths correctly
  const url = `/api${endpoint}`;

  // Get JWT token from wherever it's stored (cookies, localStorage, etc.)
  // In a real app, you might use a cookie library or next-auth
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: response.status.toString(),
          message: responseData.message || response.statusText,
          details: responseData.details,
          timestamp: new Date().toISOString(),
          path: endpoint,
        },
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: responseData.data || responseData,
      message: responseData.message,
      statusCode: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Network error occurred',
        timestamp: new Date().toISOString(),
        path: endpoint,
      },
      statusCode: 500,
    };
  }
}

// Auth API functions
export async function register(userData: {
  name: string;
  email: string;
  phone: string;
  password: string
}): Promise<ApiResponse<{ user: User; token: string }>> {
  return fetcher('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function loginWithPhone(phone: string): Promise<ApiResponse<{ sessionId: string }>> {
  return fetcher('/auth/login/phone', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOTP(sessionId: string, otp: string): Promise<ApiResponse<{ user: User; token: string }>> {
  return fetcher('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ sessionId, otp }),
  });
}

export async function loginWithGoogle(googleToken: string): Promise<ApiResponse<{ user: User; token: string }>> {
  return fetcher('/auth/login/google', {
    method: 'POST',
    body: JSON.stringify({ googleToken }),
  });
}

export async function refreshToken(): Promise<ApiResponse<{ token: string }>> {
  return fetcher('/auth/refresh-token', {
    method: 'POST',
  });
}

export async function logout(): Promise<ApiResponse<void>> {
  return fetcher('/auth/logout', {
    method: 'POST',
  });
}

export async function getMyProfile(): Promise<ApiResponse<User>> {
  return fetcher('/users/me');
}

export async function updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
  return fetcher('/users/me', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

// Boutique API functions
export async function getDresses(filters?: {
  category?: string;
  priceRange?: [number, number];
  colors?: string[];
  sizes?: string[];
  sort?: 'price-low' | 'price-high' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PaginatedResponse<Dress>>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }
  const queryString = params.toString();
  const endpoint = `/dresses${queryString ? `?${queryString}` : ''}`;

  return fetcher(endpoint);
}

export async function getNewArrivals(limit: number = 4): Promise<ApiResponse<{
  success: boolean,
  data: Product[],
  count: number
}>> {
  return fetcher(`/products?limit=${limit}`);
}

export async function getDressBySlug(slug: string): Promise<ApiResponse<Dress>> {
  return fetcher(`/dresses/${slug}`);
}

export async function checkDressAvailability(
  dressId: string,
  date: string
): Promise<ApiResponse<{ available: boolean; slots: BookedSlot[] }>> {
  return fetcher(`/dresses/${dressId}/availability?date=${date}`);
}

export async function createBooking(bookingData: {
  dressId: string;
  sizeId: string;
  startDate: string;
  endDate: string;
  addressId: string;
  specialRequests?: string;
}): Promise<ApiResponse<Booking>> {
  return fetcher('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

export async function getMyBookings(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PaginatedResponse<Booking>>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }
  const queryString = params.toString();
  const endpoint = `/bookings/me${queryString ? `?${queryString}` : ''}`;

  return fetcher(endpoint);
}

export async function cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
  return fetcher(`/bookings/${bookingId}`, {
    method: 'DELETE',
  });
}

export async function addToWishlist(dressId: string): Promise<ApiResponse<WishlistItem>> {
  return fetcher('/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId: dressId }),
  });
}

// Bridal Jewels API functions
export async function getJewellery(filters?: {
  category?: string;
  type?: string;
  priceRange?: [number, number];
  material?: string;
  gemstone?: string;
  sort?: 'price-low' | 'price-high' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PaginatedResponse<Jewellery>>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }
  const queryString = params.toString();
  const endpoint = `/jewellery${queryString ? `?${queryString}` : ''}`;

  return fetcher(endpoint);
}

export async function getJewelleryById(jewelId: string): Promise<ApiResponse<Jewellery>> {
  return fetcher(`/jewellery/${jewelId}`);
}

export async function getMatchingJewellery(dressId: string): Promise<ApiResponse<Jewellery[]>> {
  return fetcher(`/jewellery/matching/${dressId}`);
}

export async function createJewelleryBooking(bookingData: {
  jewelleryIds: string[];
  eventDate: string;
  tryOnDate?: string;
  addressId: string;
  specialRequests?: string;
}): Promise<ApiResponse<Booking>> {
  return fetcher('/jewellery/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

// Sasthik API functions
export async function getProducts(filters?: {
  category?: string;
  priceRange?: [number, number];
  brand?: string;
  sort?: 'price-low' | 'price-high' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PaginatedResponse<Product>>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }
  const queryString = params.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return fetcher(endpoint);
}

export async function getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
  return fetcher(`/products/${slug}`);
}

export async function createOrder(orderData: {
  items: Array<{
    productId: string;
    quantity: number;
    variantId?: string;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod' | 'wallet';
  couponCode?: string;
}): Promise<ApiResponse<Order>> {
  return fetcher('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function getMyOrders(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PaginatedResponse<Order>>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }
  const queryString = params.toString();
  const endpoint = `/orders/me${queryString ? `?${queryString}` : ''}`;

  return fetcher(endpoint);
}

export async function trackOrder(orderId: string): Promise<ApiResponse<Order>> {
  return fetcher(`/orders/${orderId}/track`);
}

export async function applyCoupon(code: string, cartTotal: number): Promise<ApiResponse<Coupon>> {
  return fetcher('/coupons/apply', {
    method: 'POST',
    body: JSON.stringify({ code, cartTotal }),
  });
}

export async function earnLoyaltyPoints(orderId: string): Promise<ApiResponse<LoyaltyTransaction>> {
  return fetcher('/loyalty/earn', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}

// Tamilsmakeover API functions
export async function getArtists(filters?: {
  category?: string;
  specialization?: string;
  location?: string;
  minRating?: number;
  experience?: number;
  sort?: 'rating' | 'price-low' | 'price-high' | 'newest';
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PaginatedResponse<Artist>>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }
  const queryString = params.toString();
  const endpoint = `/artists${queryString ? `?${queryString}` : ''}`;

  return fetcher(endpoint);
}

export async function getArtistBySlug(slug: string): Promise<ApiResponse<Artist>> {
  return fetcher(`/artists/${slug}`);
}

export async function getArtistAvailability(
  artistId: string,
  month: string
): Promise<ApiResponse<Record<string, boolean>>> {
  return fetcher(`/artists/${artistId}/availability/${month}`);
}

export async function createAppointment(appointmentData: {
  artistId: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  specialRequests?: string;
  addressId: string;
}): Promise<ApiResponse<Booking>> {
  return fetcher('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
}

export async function submitConsultationForm(formData: {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  budget: number;
  requirements: string;
  preferredArtist?: string;
}): Promise<ApiResponse<{ submissionId: string }>> {
  return fetcher('/consultations', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export async function getMyAppointments(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PaginatedResponse<Booking>>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }
  const queryString = params.toString();
  const endpoint = `/appointments/me${queryString ? `?${queryString}` : ''}`;

  return fetcher(endpoint);
}

// Reviews API functions
export async function submitReview(reviewData: {
  productId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  comment: string;
  productType: 'dress' | 'jewellery' | 'product' | 'artist';
}): Promise<ApiResponse<Review>> {
  return fetcher('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

export async function getReviews(
  productId: string,
  productType: 'dress' | 'jewellery' | 'product' | 'artist',
  filters?: {
    sortBy?: 'newest' | 'oldest' | 'highest-rated' | 'lowest-rated' | 'most-helpful';
    page?: number;
    limit?: number;
  }
): Promise<ApiResponse<PaginatedResponse<Review>>> {
  const params = new URLSearchParams();
  params.append('productId', productId);
  params.append('productType', productType);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/reviews${queryString ? `?${queryString}` : ''}`;

  return fetcher(endpoint);
}

// Payments API functions
export async function createRazorpayOrder(amount: number): Promise<ApiResponse<{
  id: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}>> {
  return fetcher('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export async function verifyPayment(paymentData: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<ApiResponse<{ success: boolean; orderId: string; message: string }>> {
  return fetcher('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

export default fetcher;