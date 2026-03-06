/**
 * Script to create/check admin user in MongoDB
 * Email: admin@gmail.com
 * Password: admin123 (hashed with bcrypt)
 * 
 * Features:
 * - Checks if admin already exists
 * - Prevents duplicate creation
 * - Shows existing admin details
 * - Safe to run multiple times
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nirali-boutique';

// User Schema (simplified for this script)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createOrUpdateAdmin() {
  try {
    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully\n');

    // Admin user details
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin';

    // Check if admin already exists
    console.log('🔍 Checking for existing admin user...');
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('\n⚠️  ADMIN USER ALREADY EXISTS!\n');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('📋 Existing Admin Details:');
      console.log('───────────────────────────────────────────────────────────────');
      console.log(`   🆔 ID:        ${existingAdmin._id}`);
      console.log(`   👤 Name:      ${existingAdmin.name}`);
      console.log(`   📧 Email:     ${existingAdmin.email}`);
      console.log(`   🔑 Role:      ${existingAdmin.role}`);
      console.log(`   📱 Phone:     ${existingAdmin.phone || 'Not provided'}`);
      console.log(`   🏠 Address:   ${existingAdmin.address || 'Not provided'}`);
      console.log(`   📅 Created:   ${existingAdmin.createdAt.toLocaleString('en-IN')}`);
      console.log(`   📅 Updated:   ${existingAdmin.updatedAt.toLocaleString('en-IN')}`);
      console.log('═══════════════════════════════════════════════════════════════\n');
      
      console.log('💡 Login Credentials:');
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('\n✨ Admin user is ready to use! No action needed.\n');
      
      await mongoose.connection.close();
      console.log('🔌 Database connection closed\n');
      return;
    }

    console.log('✅ No existing admin found. Creating new admin user...\n');

    // Hash password
    console.log('🔐 Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    console.log('✅ Password hashed successfully');
    console.log(`   Hash: $2a$${saltRounds}$... (secured)\n`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      phone: '+91 9876543210',
      address: 'Nirali Sai Boutique, Main Street, City, State 123456'
    });

    console.log('\n✅ ADMIN USER CREATED SUCCESSFULLY!\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📋 User Details:');
    console.log('───────────────────────────────────────────────────────────────');
    console.log(`   👤 Name:        ${adminUser.name}`);
    console.log(`   📧 Email:       ${adminUser.email}`);
    console.log(`   🔐 Password:    ${adminPassword} (for login)`);
    console.log(`   🔑 Role:        ${adminUser.role}`);
    console.log(`   📱 Phone:       ${adminUser.phone}`);
    console.log(`   🏠 Address:     ${adminUser.address}`);
    console.log(`   🆔 ID:          ${adminUser._id}`);
    console.log(`   📅 Created:     ${adminUser.createdAt.toLocaleString('en-IN')}`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log('✨ You can now login with:');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}\n`);
    
    console.log('💡 SECURITY REMINDER:');
    console.log('   ⚠️  Change the password after first login in production!');
    console.log('   ⚠️  Never use default passwords in live environments.\n');

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    console.error('\n📋 Error Details:');
    console.error('─────────────────────────────────────────────────────────────');
    console.error(error.stack);
    console.error('─────────────────────────────────────────────────────────────\n');
    
    // Close connection on error
    try {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed after error\n');
    } catch (closeError) {
      // Ignore close errors
    }
    
    process.exit(1);
  }
}

// Run the script
console.log('\n🚀 Starting Admin User Creation/Check Script');
console.log('═══════════════════════════════════════════════════════════════\n');
createOrUpdateAdmin();
