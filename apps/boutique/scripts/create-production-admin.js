/**
 * Script to create admin in PRODUCTION database (Vercel/MongoDB Atlas)
 * 
 * Usage:
 * node scripts/create-production-admin.js "mongodb+srv://your-uri-here"
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Get MongoDB URI from command line argument
const MONGODB_URI = process.argv[2];

if (!MONGODB_URI) {
  console.error('\n❌ ERROR: MongoDB URI required!\n');
  console.error('Usage:');
  console.error('  node scripts/create-production-admin.js "mongodb+srv://user:pass@cluster.mongodb.net/db"\n');
  process.exit(1);
}

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createProductionAdmin() {
  try {
    console.log('\n🚀 Creating Production Admin User\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Connect to production database
    console.log('🔌 Connecting to production database...');
    console.log(`   URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully\n');

    // Check if admin exists
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';
    
    console.log('🔍 Checking for existing admin...');
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('\n⚠️  ADMIN ALREADY EXISTS IN PRODUCTION!\n');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📋 Existing Admin:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name:  ${existingAdmin.name}`);
      console.log(`   Role:  ${existingAdmin.role}`);
      console.log('═══════════════════════════════════════════════════════════\n');
      console.log('💡 Login with:');
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: ${adminPassword}\n`);
      console.log('✨ No action needed - admin is ready!\n');
      
      await mongoose.connection.close();
      return;
    }

    console.log('✅ No admin found. Creating...\n');

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('✅ Password hashed successfully\n');

    // Create admin
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      phone: '+91 9876543210',
      address: 'Nirali Sai Boutique'
    });

    console.log('\n✅ PRODUCTION ADMIN CREATED SUCCESSFULLY!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 Credentials:');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role:     ${admin.role}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   1. Login immediately and change password!');
    console.log('   2. Never share these credentials');
    console.log('   3. Delete this script after use (optional)\n');

    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n📋 Details:\n', error.stack);
    process.exit(1);
  }
}

createProductionAdmin();
