import mongoose from 'mongoose';
import Order from './models/Order';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sashtik';

const mockOrders = [
  {
    userId: 'user_1',
    orderNumber: 'SAS-1001',
    items: [
      {
        productId: 'prod_1',
        productName: 'Antique Lakshmi Haram',
        productImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop',
        quantity: 1,
        unitPrice: 2450,
        totalPrice: 2450,
        color: 'Gold'
      },
      {
        productId: 'prod_2',
        productName: 'Pearl Drop Jhumkas',
        productImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop',
        quantity: 2,
        unitPrice: 850,
        totalPrice: 1700,
        size: 'Medium'
      }
    ],
    subtotal: 4150,
    tax: 125,
    shippingCost: 0,
    discount: 50,
    total: 4225,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'processing',
    shippingAddress: {
      firstName: 'Anjali',
      lastName: 'Sharma',
      street: '45, Bloom Garden, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '600040',
      phone: '9884455221',
      email: 'anjali@example.com'
    },
    billingAddress: {
      firstName: 'Anjali',
      lastName: 'Sharma',
      street: '45, Bloom Garden, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '600040',
      phone: '9884455221',
      email: 'anjali@example.com'
    },
    history: [
      { status: 'pending', timestamp: new Date(Date.now() - 86400000), message: 'Order placed' },
      { status: 'confirmed', timestamp: new Date(Date.now() - 80000000), message: 'Payment confirmed' },
      { status: 'processing', timestamp: new Date(Date.now() - 70000000), message: 'Order is being prepared' }
    ]
  },
  {
    userId: 'user_2',
    orderNumber: 'SAS-1002',
    items: [
      {
        productId: 'prod_3',
        productName: 'Kundan Choker Set',
        productImage: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=200&h=200&fit=crop',
        quantity: 1,
        unitPrice: 5800,
        totalPrice: 5800
      }
    ],
    subtotal: 5800,
    tax: 174,
    shippingCost: 0,
    discount: 0,
    total: 5974,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'pending',
    shippingAddress: {
      firstName: 'Vikram',
      lastName: 'Prabhu',
      street: 'Flat 202, Marina View, ECR',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '600041',
      phone: '9775566332',
      email: 'vikram@example.com'
    },
    billingAddress: {
      firstName: 'Vikram',
      lastName: 'Prabhu',
      street: 'Flat 202, Marina View, ECR',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '600041',
      phone: '9775566332',
      email: 'vikram@example.com'
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Order.deleteMany({});
    console.log('Cleared existing orders');
    
    await Order.insertMany(mockOrders);
    console.log('Seeded mock orders successfully');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
