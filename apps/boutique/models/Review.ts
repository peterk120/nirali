import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID is required'],
    unique: true // One review per order
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Minimum rating is 1'],
    max: [5, 'Maximum rating is 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Compound index for efficient queries (find all reviews for a product)
ReviewSchema.index({ productId: 1, createdAt: -1 });

// Index for user's reviews
ReviewSchema.index({ userId: 1 });

// Prevent duplicate reviews for the same order (additional safety)
ReviewSchema.index({ orderId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
