// Comprehensive Database Explorer
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nirali-sai-platform';

async function exploreDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('=== ALL DATABASE COLLECTIONS ===');
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });
    
    console.log('\n=== EXPLORING EACH COLLECTION ===');
    
    // Explore each collection
    for (const collection of collections) {
      const modelName = collection.name.charAt(0).toUpperCase() + collection.name.slice(1);
      const schema = new mongoose.Schema({}, { strict: false });
      const Model = mongoose.model(modelName, schema, collection.name);
      
      const count = await Model.countDocuments();
      console.log(`\n${collection.name.toUpperCase()}: ${count} documents`);
      
      if (count > 0) {
        const sample = await Model.find().limit(2);
        console.log('Sample documents:');
        sample.forEach((doc, i) => {
          console.log(`  Document ${i + 1}:`);
          Object.keys(doc.toObject()).forEach(key => {
            if (key !== '__v') {
              console.log(`    ${key}: ${JSON.stringify(doc[key]).substring(0, 100)}`);
            }
          });
          console.log('');
        });
      }
    }
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Exploration failed:', error);
    await mongoose.connection.close();
  }
}

exploreDatabase();