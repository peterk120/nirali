// Database Inspection Script - Show Current vs Professional Structure
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nirali-sai-platform';

// Simple schemas to inspect existing collections
const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const orderSchema = new mongoose.Schema({}, { strict: false, collection: 'orders' });

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

async function inspectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('=== DATABASE INSPECTION REPORT ===\n');
    
    // 1. Check existing collections and their structure
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 CURRENT DATABASE COLLECTIONS:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    console.log('\n=== PRODUCT COLLECTION ANALYSIS ===');
    const productCount = await Product.countDocuments();
    console.log(`Total Products: ${productCount}`);
    
    if (productCount > 0) {
      const sampleProducts = await Product.find().limit(3);
      console.log('\nSample Products (Current Structure):');
      sampleProducts.forEach((product, index) => {
        console.log(`\nProduct ${index + 1}:`);
        console.log(`  ID: ${product._id}`);
        console.log(`  Name: ${product.name || 'N/A'}`);
        console.log(`  Brand: ${product.brand || 'NOT SET'}`);
        console.log(`  Category: ${product.category || 'N/A'}`);
        console.log(`  Price: ${product.price || 'N/A'}`);
        console.log(`  Status: ${product.status || 'NOT SET'}`);
      });
    }
    
    console.log('\n=== ORDER COLLECTION ANALYSIS ===');
    const orderCount = await Order.countDocuments();
    console.log(`Total Orders: ${orderCount}`);
    
    if (orderCount > 0) {
      const sampleOrders = await Order.find().limit(3);
      console.log('\nSample Orders (Current Structure):');
      sampleOrders.forEach((order, index) => {
        console.log(`\nOrder ${index + 1}:`);
        console.log(`  ID: ${order._id || 'N/A'}`);
        console.log(`  Order ID: ${order.orderId || 'N/A'}`);
        console.log(`  Status: ${order.status || 'NOT SET'}`);
        console.log(`  Total Amount: ${order.totalAmount || 'N/A'}`);
      });
    }
    
    // 2. Show what professional structure should look like
    console.log('\n=== PROFESSIONAL MONOREPO STRUCTURE ===');
    console.log('Recommended Collections:');
    console.log('  - boutique_products');
    console.log('  - boutique_orders');
    console.log('  - bridal_products'); 
    console.log('  - bridal_orders');
    console.log('  - sasthik_products');
    console.log('  - sasthik_orders');
    console.log('  - tamilsmakeover_products');
    console.log('  - tamilsmakeover_orders');
    
    console.log('\nProfessional Product Structure:');
    console.log('{');
    console.log('  _id: "ObjectId(...)",');
    console.log('  name: "Product Name",');
    console.log('  brand: "boutique",  // App identification');
    console.log('  category: "Proper Category",');
    console.log('  price: 1000,');
    console.log('  status: "Active",');
    console.log('  stock: 10,');
    console.log('  tags: ["tag1", "tag2"],');
    console.log('  seoMeta: { title: "...", description: "...", keywords: ["..."] }');
    console.log('}');
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Inspection failed:', error);
    await mongoose.connection.close();
  }
}

inspectDatabase();