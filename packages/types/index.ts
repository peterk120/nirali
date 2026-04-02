// Shared TypeScript interfaces for the Nirali Sai platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin' | 'sales';
  status: 'active' | 'disabled';
  activeSessions: string[];
  createdAt: string;
  updatedAt: string;
  profilePicture: string;
  isVerified: boolean;
  defaultShippingAddressId: string;
  defaultBillingAddressId: string;
}

export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
  type: 'home' | 'office' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface Dress {
  id: string;
  name: string;
  description: string;
  brand: 'boutique' | 'bridal-jewels' | 'sasthik' | 'tamilsmakeover';
  category: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  sizes: DressSize[];
  colors: DressColor[];
  images: DressImage[];
  material: string;
  careInstructions: string;
  stockQuantity: number;
  isActive: boolean;
  isCustomizable: boolean;
  rentalOptions: RentalOption[];
  tags: string[];
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
  // Additional fields for boutique app compatibility
  price?: number;
  color?: string;
  size?: string;
  image?: string;
  isFavorite?: boolean;
}

export interface DressSize {
  id: string;
  dressId: string;
  size: string;
  chest: string;
  waist: string;
  hips: string;
  length: string;
  stockQuantity: number;
  isAvailable: boolean;
}

export interface DressColor {
  id: string;
  dressId: string;
  name: string;
  hexCode: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface DressImage {
  id: string;
  dressId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface BookedSlot {
  id: string;
  dressId: string;
  sizeId: string;
  startDate: string;
  endDate: string;
  userId: string;
  bookingId: string;
  isConfirmed: boolean;
  createdAt: string;
}

export interface Jewellery {
  id: string;
  name: string;
  description: string;
  brand: 'boutique' | 'bridal-jewels' | 'sasthik' | 'tamilsmakeover';
  type: JewelleryType;
  category: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  weight: number;
  material: string;
  gemstone: string;
  purity: string;
  images: DressImage[];
  sets: JewellerySet[];
  stockQuantity: number;
  isActive: boolean;
  tags: string[];
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface JewelleryType {
  id: string;
  name: string;
  displayName: string;
  description: string;
  sortOrder: number;
}

export interface RentalOption {
  id: string;
  productId: string;
  durationDays: number;
  price: number;
  deposit: number;
  cleaningFee: number;
  availability: boolean;
}

export interface JewellerySet {
  id: string;
  setName: string;
  jewelleryIds: string[];
  discountPercentage: number;
  isComplete: boolean;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: 'boutique' | 'bridal-jewels' | 'sasthik' | 'tamilsmakeover';
  category: ProductCategory;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  variants: ProductVariant[];
  images: DressImage[];
  stockQuantity: number;
  isActive: boolean;
  isCustomizable: boolean;
  tags: string[];
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  attributes: Record<string, string>;
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface Artist {
  id: string;
  name: string;
  email: string;
  phone: string;
  brand: 'boutique' | 'bridal-jewels' | 'sasthik' | 'tamilsmakeover';
  specialization: string;
  experienceYears: number;
  portfolioItems: ArtistPortfolioItem[];
  rating: number;
  totalBookings: number;
  isActive: boolean;
  bio: string;
  profileImage: string;
  galleryImages: string[];
  languages: string[];
  serviceAreas: string[];
  pricing: {
    startingPrice: number;
    averagePrice: number;
    hourlyRate: number;
  };
  availability: {
    monday: { startTime: string; endTime: string; available: boolean };
    tuesday: { startTime: string; endTime: string; available: boolean };
    wednesday: { startTime: string; endTime: string; available: boolean };
    thursday: { startTime: string; endTime: string; available: boolean };
    friday: { startTime: string; endTime: string; available: boolean };
    saturday: { startTime: string; endTime: string; available: boolean };
    sunday: { startTime: string; endTime: string; available: boolean };
  };
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ArtistPackage {
  id: string;
  artistId: string;
  name: string;
  description: string;
  price: number;
  durationHours: number;
  servicesIncluded: string[];
  revisionLimit: number;
  deliveryTimeDays: number;
  isActive: boolean;
}

export interface ArtistPortfolioItem {
  id: string;
  artistId: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  dateCompleted: string;
  clientFeedback: string;
  isFeatured: boolean;
  sortOrder: number;
}

export interface Booking {
  id: string;
  userId: string;
  productId: string | null;
  artistId: string | null;
  bookingType: BookingType;
  bookingDate: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  specialRequests: string;
  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledBy: 'user' | 'admin' | null;
  addressId: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

export type BookingType = 'appointment' | 'rental' | 'service' | 'consultation';

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod' | 'wallet';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  estimatedDelivery: string;
  notes: string;
  couponCode: string | null;
  loyaltyPointsUsed: number;
  paymentDetails?: {
    transactionId?: string;
    proofUrl?: string;
    verifiedAt?: string;
    verifiedBy?: string;
  };
  history?: Array<{
    status: OrderStatus;
    timestamp: string;
    message?: string;
    updatedBy?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId: string | null;
  size: string | null;
  color: string | null;
  status: OrderStatus;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refund_initiated' | 'refunded';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: Rating;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  value: 1 | 2 | 3 | 4 | 5;
  count: number;
  average: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  applicableProducts: string[]; // Empty array means all products
  applicableCategories: string[]; // Empty array means all categories
  applicableBrands: ('boutique' | 'bridal-jewels' | 'sasthik' | 'tamilsmakeover')[];
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'adjustment';
  points: number;
  description: string;
  referenceId: string | null;
  referenceType: 'order' | 'referral' | 'bonus' | 'adjustment' | null;
  balanceAfter: number;
  expiryDate: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path?: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId: string | null;
  size: string | null;
  color: string | null;
  isRental: boolean;
  rentalOptionId: string | null;
  rentalStartDate: string | null;
  rentalEndDate: string | null;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotional';
  title: string;
  message: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  data: Record<string, unknown>;
  scheduledAt: string;
  sentAt: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}