const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://prajancs22_db_user:0611@cluster0.2zvslh8.mongodb.net/sashti-sparkle?retryWrites=true&w=majority';

const instagramProducts = [
  {
    "name": "Diamond replica necklace/earrings",
    "description": "Diamond replica..😍 To order 8056761671 Address: Sashti sparkle (Nirali Sai jewels) Shop 17, kandhaswarna shopping mall, fairlands Saradha college main road, Salem -636016",
    "price": 470,
    "image": "https://res.cloudinary.com/demo/image/upload/v1625211830/sample.jpg", 
    "category": "Necklace",
    "brand": "sashti",
    "storeType": "sashti",
    "stock": 15,
    "tags": ["diamond replica", "necklace"]
  },
  {
    "name": "Gold replica bracelet",
    "description": "Gold replica bracelet 😍 To order 8056761671 #FashionJewellery #ImitationJewellery #ArtificialJewellery",
    "price": 499,
    "image": "https://res.cloudinary.com/demo/image/upload/v1625211830/sample.jpg",
    "category": "Bracelet",
    "brand": "sashti",
    "storeType": "sashti",
    "stock": 20,
    "tags": ["gold replica", "bracelet"]
  },
  {
    "name": "Nagas necklace",
    "description": "Nagas necklace 😍 To order 8056761671 #NagasNecklace #TraditionalJewellery",
    "price": 1850,
    "image": "https://res.cloudinary.com/demo/image/upload/v1625211830/sample.jpg",
    "category": "Necklace",
    "brand": "sashti",
    "storeType": "sashti",
    "stock": 5,
    "tags": ["nagas", "necklace", "traditional"]
  },
  {
    "name": "Nagas beads malai",
    "description": "Nagas beads malai 😍 To order 8056761671 #JewelleryLovers #DailyWearJewellery",
    "price": 450,
    "image": "https://res.cloudinary.com/demo/image/upload/v1625211830/sample.jpg",
    "category": "Malai",
    "brand": "sashti",
    "storeType": "sashti",
    "stock": 25,
    "tags": ["nagas", "beads", "malai"]
  },
  {
    "name": "Budget bridal set",
    "description": "Budget bridal set… 😍 To order 8056761671 #BridalJewellery #BudgetJewels",
    "price": 1850,
    "image": "https://res.cloudinary.com/demo/image/upload/v1625211830/sample.jpg",
    "category": "Bridal Set",
    "brand": "sashti",
    "storeType": "sashti",
    "stock": 3,
    "tags": ["bridal", "budget", "set"]
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products for this brand to avoid duplicates
    await Product.deleteMany({ brand: 'sashti' });
    console.log('Cleared existing Sashti products');

    for (const prod of instagramProducts) {
      await Product.create(prod);
      console.log(`Created product: ${prod.name}`);
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedProducts();
