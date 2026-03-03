// Simple Database Migration Script
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nirali-sai-platform';

// Product Schema (simplified)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  brand: {
    type: String,
    enum: ['boutique', 'bridal-jewels', 'sasthik', 'tamilsmakeover'],
    default: 'boutique'
  },
  color: String,
  size: String,
  image: String,
  description: String,
  stock: { type: Number, default: 0 },
  status: { type: String, default: 'Active' },
  tags: [String],
  seoMeta: {
    title: String,
    description: String,
    keywords: [String]
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function migrateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');
    
    // Add brand field to existing products
    const result = await Product.updateMany(
      { brand: { $exists: false } },
      { 
        $set: { 
          brand: 'boutique',
          status: 'Active'
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} products with brand field`);
    
    // Create indexes
    await Product.createIndexes();
    console.log('Created database indexes');
    
    // Verify structure
    const sampleProducts = await Product.find({ brand: 'boutique' }).limit(3);
    console.log('Sample products with new structure:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.name} (${product.brand}) - ${product.category}`);
    });
    
    console.log('✅ Database migration completed successfully!');
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.connection.close();
  }
}

// Run migration
migrateDatabase();