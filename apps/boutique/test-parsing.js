// Test bulk upload parsing
const fs = require('fs');
const { FileParser } = require('./lib/csv-parser');

const csvData = fs.readFileSync('test-upload.csv');
const result = FileParser.parse('boutique', csvData, 'test-upload.csv');

console.log('Parse result:', result.products.length, 'products,', result.errors.length, 'errors');
if (result.errors.length > 0) {
  console.log('Errors:', result.errors);
} else {
  console.log('Products parsed successfully!');
  console.log('First product:', result.products[0]);
}