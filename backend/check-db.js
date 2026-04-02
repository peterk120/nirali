const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sashtik');
    console.log('Connected to MongoDB');

    const categories = await Product.distinct('category');
    console.log('Unique categories in DB:', categories);

    const brands = await Product.distinct('brand');
    console.log('Unique brands in DB:', brands);

    const storeTypes = await Product.distinct('storeType');
    console.log('Unique storeTypes in DB:', storeTypes);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCategories();
