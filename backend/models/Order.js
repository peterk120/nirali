const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
     variantId: { type: String },
     size: { type: String },
     color: { type: String },
     rentalDays: { type: Number },
     startDate: { type: Date },
     endDate: { type: Date }
   }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  discount: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'upi', 'netbanking', 'cod', 'wallet'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  status: { 
    type: String, 
    enum: [
      'pending', 'confirmed', 'processing', 'packed', 'shipped', 
      'out_for_delivery', 'delivered', 'cancelled', 'returned', 
      'refund_initiated', 'refunded'
    ], 
    default: 'pending' 
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  trackingNumber: { type: String },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  estimatedDelivery: { type: Date },
  notes: { type: String },
  couponCode: { type: String },
  loyaltyPointsUsed: { type: Number, default: 0 },
  paymentDetails: {
    transactionId: { type: String },
    proofUrl: { type: String },
    verifiedAt: { type: Date },
    verifiedBy: { type: String }
  },
  history: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    message: { type: String },
    updatedBy: { type: String }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

OrderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.history.push({
      status: this.status,
      timestamp: new Date(),
      message: `Status updated to ${this.status}`
    });
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
