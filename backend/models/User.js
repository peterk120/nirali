const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin', 'sales'], default: 'user' },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    lastLoginAt: { type: Date },
    lastActiveAt: { type: Date },
    activeSessions: [{ type: String }], // Stores unique JTIs for multi-device login
    profilePicture: { type: String },
    isVerified: { type: Boolean, default: false },
    defaultShippingAddressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    defaultBillingAddressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        rentalDays: { type: Number, default: 1 },
        size: { type: String },
        rentalStartDate: { type: Date },
        rentalEndDate: { type: Date },
        priceAtAddition: { type: Number },
      },
    ],
    addresses: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String },
        street: { type: String, required: true },
        area: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        phone: { type: String, required: true },
        type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
        isDefault: { type: Boolean, default: false }
      }
    ],
    wishlist: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        addedAt: { type: Date, default: Date.now }
      }
    ],
  },
  {
    timestamps: true,
    strict: false, // Allow flexibility for platform-specific extras
  }
);

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = { User, UserSchema };
