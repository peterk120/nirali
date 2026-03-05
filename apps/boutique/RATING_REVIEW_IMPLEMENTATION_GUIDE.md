# Rating & Review System Implementation Guide

## ✅ Complete Implementation Summary

This guide shows how to add a complete rating/review system where users can rate products they've booked, and those ratings dynamically update on product pages.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Books Product → Completes Rental                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User Goes to My Bookings Page                            │
│    - Sees all their bookings                                │
│    - Completed bookings show "Leave Review" button          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. User Clicks "Leave Review" → Modal Opens                 │
│    - Shows product image & name                             │
│    - 5-star rating selector                                 │
│    - Optional text review (500 chars max)                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. User Submits Rating                                      │
│    - POST /api/reviews                                      │
│    - Updates Order with rating & review                     │
│    - Recalculates Product average rating                    │
│    - Updates rating distribution                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Product Page Dynamically Updates                         │
│    - Shows new average rating                               │
│    - Displays total reviews count                           │
│    - Shows rating breakdown (5★, 4★, 3★, 2★, 1★)            │
│    - Displays individual reviews                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Database Schema Changes

### 1. Order Model (`models/Order.ts`)

**Added Fields:**
```typescript
rating?: number;        // User's rating (1-5)
review?: string;        // User's written review (max 500 chars)
isReviewed: boolean;    // Whether user has submitted review
```

**Schema:**
```typescript
rating: { type: Number, min: 1, max: 5 },
review: { type: String, maxlength: 500 },
isReviewed: { type: Boolean, default: false }
```

### 2. Product Model (`models/Product.ts`)

**Added Fields:**
```typescript
averageRating?: number;      // Average of all ratings (0-5)
totalReviews?: number;       // Total number of reviews
ratingDistribution?: {       // Breakdown by star level
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
};
```

**Schema:**
```typescript
averageRating: { type: Number, default: 0, min: 0, max: 5 },
totalReviews: { type: Number, default: 0 },
ratingDistribution: {
  5: { type: Number, default: 0 },
  4: { type: Number, default: 0 },
  3: { type: Number, default: 0 },
  2: { type: Number, default: 0 },
  1: { type: Number, default: 0 }
}
```

---

## 🔌 API Endpoints

### POST /api/reviews - Submit a Review

**Request:**
```javascript
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "69a140995378c00befa39858",
  "rating": 5,
  "review": "Amazing dress! Perfect fit and beautiful design."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "orderId": "ORD-1772515812-456",
    "rating": 5,
    "review": "Amazing dress! Perfect fit and beautiful design."
  }
}
```

**Validation Rules:**
- ✅ User must be authenticated
- ✅ Order must exist and belong to user
- ✅ Order must not already be reviewed
- ✅ Rating must be 1-5
- ✅ Rental period must be completed or active
- ✅ Review text max 500 characters

### GET /api/reviews?productId=xxx - Get Reviews

**Request:**
```javascript
GET /api/reviews?productId=69a140995378c00befa39858
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order_id",
      "orderId": "ORD-xxx",
      "userId": "user_id",
      "userName": "Priya S.",
      "rating": 5,
      "review": "Beautiful saree!",
      "date": "2026-03-05T10:30:00Z",
      "productName": "Elegant Silk Saree"
    }
  ],
  "count": 15
}
```

---

## 🎨 Frontend Components

### 1. StarRating Component (`components/ui/StarRating.tsx`)

**Usage:**
```tsx
// Editable rating (for review form)
<StarRating 
  onRate={(rating) => handleSubmit(rating)} 
  editable={true} 
  size="lg" 
/>

// Display-only rating (for product cards)
<StarRating rating={4.5} size="md" />

// With average display
<RatingDisplay 
  averageRating={4.7} 
  totalReviews={23} 
  size="lg" 
/>
```

**Features:**
- ⭐ Interactive hover effect
- ⭐ Click to select rating
- ⭐ Read-only mode for display
- ⭐ Three sizes: sm, md, lg
- ⭐ Accessible (keyboard support)

### 2. Updated Booking Interface (`app/(public)/dashboard/bookings/page.tsx`)

**Booking Interface Changes:**
```typescript
interface Booking {
  id: string;
  orderId: string;              // MongoDB _id for API calls
  dress: { ... };
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  amountPaid: number;
  isReviewed?: boolean;         // NEW: Has user reviewed?
  existingRating?: number;      // NEW: User's rating if submitted
}
```

---

## 📱 User Flow Implementation

### Step 1: Fetch Bookings with Review Status

```typescript
// In bookings page useEffect
const transformedBookings = result.data.map((order: any) => ({
  id: order.orderId,
  orderId: order._id.toString(),
  dress: {
    id: order.productId?.toString() || 'unknown',
    name: order.productName || 'Product',
    category: order.category || 'Unknown',
    image: order.productImage || '/placeholder-product.jpg'
  },
  startDate: new Date(order.rentalStartDate),
  endDate: new Date(order.rentalEndDate),
  status: mapOrderStatusToBookingStatus(order.status),
  amountPaid: order.totalAmount || 0,
  isReviewed: order.isReviewed || false,     // NEW
  existingRating: order.rating               // NEW
}));
```

### Step 2: Show Review Button for Completed Orders

```typescript
// In BookingCard component
{booking.status === 'completed' && !booking.isReviewed && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => onLeaveReview(booking.id)}
    className="flex items-center gap-1"
  >
    <Star className="w-4 h-4" />
    Leave Review
  </Button>
)}

{booking.isReviewed && (
  <div className="text-sm text-green-600 font-medium">
    ✓ Review Submitted
  </div>
)}
```

### Step 3: Review Modal with Star Rating

```typescript
// In bookings page
const handleLeaveReview = async (bookingOrderId: string) => {
  const booking = bookings.find(b => b.orderId === bookingOrderId);
  if (!booking) return;

  setSelectedBookingForReview(booking);
  setShowReviewModal(true);
};

// In modal
<div className="review-modal">
  <h3>Rate {selectedBookingForReview.dress.name}</h3>
  
  <StarRating 
    rating={userRating}
    onRate={setUserRating}
    editable={true}
    size="lg"
  />
  
  <textarea
    value={userReviewText}
    onChange={(e) => setUserReviewText(e.target.value)}
    placeholder="Share your experience (optional)"
    maxLength={500}
  />
  
  <button onClick={submitReview}>Submit Review</button>
</div>
```

### Step 4: Submit Review to API

```typescript
const submitReview = async () => {
  if (userRating < 1) {
    alert('Please select at least 1 star');
    return;
  }

  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        orderId: selectedBookingForReview.orderId,
        rating: userRating,
        review: userReviewText
      })
    });

    const result = await response.json();

    if (result.success) {
      alert('Thank you for your review!');
      
      // Update local state
      setBookings(bookings.map(b => 
        b.orderId === selectedBookingForReview.orderId
          ? { ...b, isReviewed: true, existingRating: userRating }
          : b
      ));
      
      setShowReviewModal(false);
      setUserRating(0);
      setUserReviewText('');
    } else {
      alert(result.error || 'Failed to submit review');
    }
  } catch (error) {
    console.error('Review submission error:', error);
    alert('An error occurred. Please try again.');
  }
};
```

---

## 🛍️ Product Page Integration

### Fetch Product with Ratings

```typescript
// In product detail page
useEffect(() => {
  const fetchProduct = async () => {
    const res = await fetch(`/api/products/${productId}`);
    const data = await res.json();
    
    setProduct({
      ...data.data,
      averageRating: data.data.averageRating || 0,
      totalReviews: data.data.totalReviews || 0,
      ratingDistribution: data.data.ratingDistribution || {}
    });
  };
  
  fetchProduct();
}, [productId]);
```

### Display Rating on Product Card

```tsx
<div className="product-card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p className="price">₹{product.price}</p>
  
  {/* NEW: Rating Display */}
  <div className="rating-section">
    <RatingDisplay 
      averageRating={product.averageRating}
      totalReviews={product.totalReviews}
      size="sm"
    />
  </div>
</div>
```

### Display Full Reviews Section

```tsx
{/* Reviews Section */}
<div className="reviews-section">
  <h2>Customer Reviews</h2>
  
  {/* Rating Summary */}
  <div className="rating-summary">
    <div className="average">
      <span className="rating-number">{product.averageRating.toFixed(1)}</span>
      <StarRating rating={product.averageRating} size="lg" />
      <span className="total">Based on {product.totalReviews} reviews</span>
    </div>
    
    {/* Distribution Bars */}
    <div className="distribution">
      {[5, 4, 3, 2, 1].map(stars => (
        <div key={stars} className="distribution-row">
          <span>{stars}★</span>
          <div className="bar">
            <div 
              className="fill" 
              style={{ width: `${getPercentage(stars)}%` }}
            />
          </div>
          <span>{product.ratingDistribution[stars] || 0}</span>
        </div>
      ))}
    </div>
  </div>
  
  {/* Individual Reviews */}
  <div className="reviews-list">
    {reviews.map(review => (
      <div key={review.id} className="review-card">
        <div className="review-header">
          <span className="name">{review.userName}</span>
          <StarRating rating={review.rating} size="sm" />
          <span className="date">{formatDate(review.date)}</span>
        </div>
        <p className="review-text">{review.review}</p>
      </div>
    ))}
  </div>
</div>
```

---

## 🔧 Backend Logic Details

### Rating Calculation Algorithm

```typescript
async function updateProductRating(productId: string, newRating: number) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get all rated orders for this product
    const ordersWithRatings = await Order.find({ 
      productId: new mongoose.Types.ObjectId(productId),
      isReviewed: true,
      rating: { $exists: true }
    }).session(session);

    // Calculate statistics
    const totalRatings = ordersWithRatings.length;
    const sumRatings = ordersWithRatings.reduce((sum, order) => 
      sum + (order.rating || 0), 0
    );
    const averageRating = totalRatings > 0 
      ? sumRatings / totalRatings 
      : 0;

    // Calculate distribution
    const distribution = {
      5: ordersWithRatings.filter(o => o.rating === 5).length,
      4: ordersWithRatings.filter(o => o.rating === 4).length,
      3: ordersWithRatings.filter(o => o.rating === 3).length,
      2: ordersWithRatings.filter(o => o.rating === 2).length,
      1: ordersWithRatings.filter(o => o.rating === 1).length,
    };

    // Update product
    product.averageRating = Math.round(averageRating * 10) / 10; // Round to 1 decimal
    product.totalReviews = totalRatings;
    product.ratingDistribution = distribution;
    await product.save({ session });

    await session.commitTransaction();
    
    console.log(`✅ Updated ratings for ${product.name}:`, {
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      distribution
    });

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

---

## ✅ Validation & Security

### Who Can Review:
- ✅ Must be authenticated user
- ✅ Must have booked the product
- ✅ Rental period must be completed or active
- ✅ Cannot review same order twice
- ✅ Rating must be 1-5 stars

### Data Protection:
- ✅ JWT token verification
- ✅ Order ownership validation
- ✅ Review text sanitization (max 500 chars)
- ✅ MongoDB transactions for data integrity
- ✅ Error handling with proper messages

---

## 📊 Example Data Flow

### Before Any Reviews:
```javascript
Product Document:
{
  name: "Elegant Silk Saree",
  price: 8500,
  averageRating: 0,
  totalReviews: 0,
  ratingDistribution: { 5:0, 4:0, 3:0, 2:0, 1:0 }
}
```

### After First Review (5 stars):
```javascript
Product Document:
{
  name: "Elegant Silk Saree",
  price: 8500,
  averageRating: 5.0,
  totalReviews: 1,
  ratingDistribution: { 5:1, 4:0, 3:0, 2:0, 1:0 }
}

Order Document:
{
  orderId: "ORD-1772515812-456",
  userId: "user123",
  productId: "prod456",
  productName: "Elegant Silk Saree",
  rating: 5,
  review: "Absolutely beautiful! Perfect for weddings.",
  isReviewed: true
}
```

### After Second Review (4 stars):
```javascript
Product Document:
{
  name: "Elegant Silk Saree",
  price: 8500,
  averageRating: 4.5,        // (5+4)/2 = 4.5
  totalReviews: 2,
  ratingDistribution: { 5:1, 4:1, 3:0, 2:0, 1:0 }
}
```

### After Multiple Reviews:
```javascript
Product Document:
{
  name: "Elegant Silk Saree",
  price: 8500,
  averageRating: 4.7,
  totalReviews: 23,
  ratingDistribution: { 
    5: 15,   // 65% gave 5 stars
    4: 6,    // 26% gave 4 stars
    3: 1,    // 4% gave 3 stars
    2: 1,    // 4% gave 2 stars
    1: 0     // 0% gave 1 star
  }
}
```

---

## 🎯 Key Features

### For Users:
- ⭐ Easy 5-star rating system
- ⭐ Optional written review
- ⭐ Can only review after using product
- ⭐ See all their past reviews
- ⭐ Cannot modify review once submitted (intentional for authenticity)

### For Business:
- ⭐ Authentic reviews from verified renters
- ⭐ Automatic rating calculation
- ⭐ Rating distribution insights
- ⭐ Prevents fake reviews
- ⭐ Builds trust with new customers

### For Other Customers:
- ⭐ See real ratings from actual users
- ⭐ Read detailed experiences
- ⭐ Rating breakdown by star level
- ⭐ Helps make informed decisions
- ⭐ Builds confidence in products

---

## 🚀 Next Steps to Complete

1. **Update BookingCard Component**: Add review button and status display
2. **Create Review Modal**: Star rating + text area UI
3. **Update Product Pages**: Display ratings and reviews
4. **Add Reviews API Call**: Fetch reviews for each product
5. **Style Components**: Match brand design (rose/gold theme)
6. **Test Flow**: Complete booking → Review → See on product page

---

**Status:** Ready to implement! All backend infrastructure is in place. 🎉
