const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Target the isolated Sashti Sparkle database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prajancs22_db_user:0611@cluster0.2zvslh8.mongodb.net/sashti-sparkle?retryWrites=true&w=majority';

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

async function seedUsers() {
  try {
    console.log('\n🔌 Connecting to Sashti Sparkle Database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully\n');

    const usersToCreate = [
      {
        name: 'Test Customer',
        email: 'testuser@sashtisparkle.com',
        password: 'testpassword123',
        role: 'user',
        phone: '+919999999999'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@gmail.com',
        password: 'priya123',
        role: 'user',
        phone: '+919876543210'
      },
      {
        name: 'Sashti Admin',
        email: 'admin@sashtisparkle.com',
        password: 'adminpassword123',
        role: 'admin',
        phone: '+918888888888'
      },
      {
        name: 'Store Admin',
        email: 'admin.sashti@gmail.com',
        password: 'admin789',
        role: 'admin',
        phone: '+917777777777'
      }
    ];

    for (const userData of usersToCreate) {
      console.log(`🔍 Checking if ${userData.email} exists...`);
      const existing = await User.findOne({ email: userData.email });
      
      if (existing) {
        console.log(`⚠️  User ${userData.email} already exists. Skipping.`);
        continue;
      }

      console.log(`🔐 Hashing password for ${userData.email}...`);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      console.log(`👤 Creating ${userData.role} account...`);
      await User.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`✅ ${userData.email} created successfully!\n`);
    }

    await mongoose.connection.close();
    console.log('🔌 Database connection closed.\n');
    console.log('✨ Seeding complete. Use these credentials to test Sashti Sparkle.');
    
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seedUsers();
