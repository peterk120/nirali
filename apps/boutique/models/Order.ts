import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  productId: mongoose.Types.ObjectId; // Changed to ObjectId reference
  productName: string;
  productImage: string;
  size?: string; // Selected size for this product
  rentalStartDate: Date;
  rentalEndDate: Date;
  rentalDays: number;
  rentalPricePerDay: number;
  depositAmount: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  specialRequests: string;
  bookingDate: Date;
  rating?: number; // User's rating for this product (1-5)
  review?: string; // User's written review
  isReviewed: boolean; // Whether user has submitted a review
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: String,
  userId: String,
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Changed to ObjectId reference
  productName: String,
  productImage: String,
  size: String, // Selected size for this product
  rentalStartDate: Date,
  rentalEndDate: Date,
  rentalDays: Number,
  rentalPricePerDay: Number,
  depositAmount: Number,
  totalAmount: Number,
  status: { type: String, default: 'pending' },
  paymentStatus: { type: String, default: 'pending' },
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  deliveryAddress: String,
  specialRequests: { type: String, default: '' },
  bookingDate: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String, maxlength: 500 },
  isReviewed: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Generate unique order ID before saving
OrderSchema.pre<IOrder>('save', function(next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;