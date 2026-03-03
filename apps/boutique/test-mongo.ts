import connectToDatabase from './lib/mongodb.js';
import Product from './models/Product.js';

async function testMongoDB() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('Connected to MongoDB successfully!');
    
    // Count existing products
    const count = await Product.countDocuments();
    console.log(`Current product count: ${count}`);
    
    // Create a test product
    const testProduct = new Product({
      name: 'MongoDB Test Product',
      price: 299,
      category: 'Electronics',
      description: 'Test product to verify MongoDB integration',
      stock: 5,
      image: 'https://res.cloudinary.com/dxkqm1ifi/image/upload/v1707123456/nirali-sai-boutique/test-product.jpg'
    });
    
    await testProduct.save();
    console.log('Test product saved successfully!');
    
    // Fetch the product
    const savedProduct = await Product.findById(testProduct._id);
    console.log('Retrieved product:', savedProduct);
    
    // Fetch all products
    const allProducts = await Product.find();
    console.log(`Total products in DB: ${allProducts.length}`);
    
    console.log('MongoDB integration test completed successfully!');
  } catch (error) {
    console.error('Error during MongoDB test:', error);
  }
}

// Run the test
testMongoDB();