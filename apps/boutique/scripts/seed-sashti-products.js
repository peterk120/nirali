const mongoose = require('mongoose');

// Target the isolated Sashti Sparkle database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prajancs22_db_user:0611@cluster0.2zvslh8.mongodb.net/sashti-sparkle?retryWrites=true&w=majority';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  category: String,
  images: [String],
  brand: { type: String, default: 'sashti' },
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  slug: { type: String, unique: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function seedProducts() {
  try {
    console.log('\n🔌 Connecting to Sashti Sparkle Database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully\n');

    const productsToCreate = [
      {
        name: 'Royal Temple Gold Haram Necklace',
        slug: 'royal-temple-gold-haram',
        description: 'Breathtaking antique gold finish haram with intricate temple architecture motifs.',
        price: 2499,
        originalPrice: 4299,
        category: 'Necklaces',
        images: ['https://images.unsplash.com/photo-1599643446513-3990425a1768?auto=format&fit=crop&q=80&w=800'],
        stock: 15
      },
      {
        name: 'Kundan Drop Polki Earrings',
        slug: 'kundan-drop-polki',
        description: 'Exquisite Kundan work with pearl drops, perfect for wedding guest attire.',
        price: 899,
        originalPrice: 1599,
        category: 'Earrings',
        images: ['https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800'],
        stock: 25
      },
      {
        name: 'Bridal Emerald Stone Choker Set',
        slug: 'bridal-emerald-choker',
        description: 'Stunning emerald stone choker set with matching earrings and maang tikka.',
        price: 3899,
        originalPrice: 6500,
        category: 'Bridal',
        images: ['https://images.unsplash.com/photo-1601121141461-9d663a633190?auto=format&fit=crop&q=80&w=800'],
        stock: 5
      },
      {
        name: 'Matte Gold Finish Bangles (Set of 4)',
        slug: 'matte-gold-bangles',
        description: 'Classic matte finish bangles with delicate floral engravings.',
        price: 1299,
        originalPrice: 1999,
        category: 'Bangles',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'],
        stock: 20
      }
    ];

    for (const prodData of productsToCreate) {
      console.log(`🔍 Checking if ${prodData.slug} exists...`);
      const existing = await Product.findOne({ slug: prodData.slug });
      
      if (existing) {
        console.log(`⚠️  Product ${prodData.slug} already exists. Skipping.`);
        continue;
      }

      console.log(`💎 Creating product: ${prodData.name}...`);
      await Product.create(prodData);
      console.log(`✅ ${prodData.name} seeded successfully!\n`);
    }

    await mongoose.connection.close();
    console.log('🔌 Database connection closed.\n');
    console.log('✨ Product seeding complete. Sashti Sparkle is now populated!');
    
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seedProducts();
