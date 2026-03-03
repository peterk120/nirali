// Database Migration Script for Professional Monorepo Structure
import connectToDatabase from '../lib/mongodb.ts';
import Product from '../models/Product.js';

async function migrateDatabase() {
  try {
    await connectToDatabase();
    console.log('Connected to database');
    
    // 1. Add brand field to existing products
    const result = await Product.updateMany(
      { brand: { $exists: false } },
      { 
        $set: { 
          brand: 'boutique',
          status: 'Active',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} products with brand field`);
    
    // 2. Create proper indexes
    await Product.createIndexes();
    console.log('Created database indexes');
    
    // 3. Verify structure
    const sampleProducts = await Product.find({ brand: 'boutique' }).limit(3);
    console.log('Sample products with new structure:', sampleProducts);
    
    console.log('✅ Database migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateDatabase();