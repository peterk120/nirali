/**
 * Migration Script: Add Brand Field to Existing Products
 * 
 * This script updates all products in the database that are missing the brand field.
 * Run this after deploying to Vercel to ensure backward compatibility.
 * 
 * Usage:
 *   node scripts/migrate-products-brand.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function migrateBrandField() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nirali-sai';
    console.log('Connecting to MongoDB...', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Define Product schema (minimal version for migration)
    const productSchema = new mongoose.Schema({
      name: String,
      price: Number,
      category: String,
      brand: {
        type: String,
        enum: ['boutique', 'bridal-jewels', 'sasthik', 'tamilsmakeover'],
        default: 'boutique'
      },
      image: String,
      description: String,
      stock: Number,
      status: String,
      createdAt: Date,
      updatedAt: Date
    });

    const Product = mongoose.model('Product', productSchema);

    // Find products without brand field
    const productsWithoutBrand = await Product.find({ 
      $or: [
        { brand: { $exists: false } },
        { brand: null },
        { brand: '' }
      ]
    });

    console.log(`\n📊 Found ${productsWithoutBrand.length} products without brand field`);

    if (productsWithoutBrand.length === 0) {
      console.log('✅ All products already have the brand field. No migration needed.');
      await mongoose.disconnect();
      return;
    }

    // Update products
    console.log('\n🔄 Updating products...');
    
    const updateResult = await Product.updateMany(
      { 
        $or: [
          { brand: { $exists: false } },
          { brand: null },
          { brand: '' }
        ]
      },
      { $set: { brand: 'boutique' } }
    );

    console.log(`✓ Updated ${updateResult.modifiedCount} products`);

    // Verify the update
    const updatedProducts = await Product.find({ brand: 'boutique' }).countDocuments();
    console.log(`\n📈 Total products with brand='boutique': ${updatedProducts}`);

    // Show sample updated products
    const sampleProducts = await Product.find({ brand: 'boutique' })
      .select('name brand category price')
      .limit(5);
    
    console.log('\n📋 Sample updated products:');
    sampleProducts.forEach(p => {
      console.log(`  - ${p.name} | Brand: ${p.brand} | Category: ${p.category}`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run migration
console.log('🚀 Starting Brand Field Migration...\n');
migrateBrandField();
