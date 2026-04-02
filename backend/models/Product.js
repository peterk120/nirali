const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  color: {
    type: String,
    trim: true,
    maxlength: [30, 'Color cannot exceed 30 characters']
  },
  size: {
    type: String,
    trim: true,
    maxlength: [20, 'Size cannot exceed 20 characters']
  },
  sizes: [{
    size: String,
    available: { type: Boolean, default: true }
  }],
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  cloudinary_public_id: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  brand: {
    type: String,
    enum: ['boutique', 'bridal-jewels', 'sasthik', 'tamilsmakeover', 'sashti'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Active', 'Out of Stock', 'Discontinued'],
    default: 'Active',
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  storeType: {
    type: String,
    enum: ['boutique', 'jewellery', 'sasthik', 'tamilsmakeover', 'sashti'],
    required: true,
    index: true
  },
  attributes: {
    size: String,
    color: String,
    fabric: String,
    weight: Number,
    metalType: String,
    purity: String,
    makingCharges: Number,
    sku: String
  },
  seoMeta: {
    title: String,
    description: String,
    keywords: [String]
  },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 }
  },
  slug: {
    type: String,
    unique: true,
    index: true
  }
}, {
  timestamps: true
});

// Pre-save hook to generate slug
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .split(' ')
      .join('-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

// Index for better query performance
ProductSchema.index({ brand: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

module.exports = { Product, ProductSchema };
