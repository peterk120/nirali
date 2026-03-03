// Debug bulk upload issues
const fs = require('fs');
const { FileParser } = require('./lib/csv-parser');

// Test with a simple CSV that should work
const testCSV = `productName,description,category,price,stock,sku,size,color,fabric,imageName
"Test Product 1","Test description 1","Test Category",1000,5,"TEST-001","Medium","Red","Cotton","test1.jpg"
"Test Product 2","Test description 2","Test Category",1500,3,"TEST-002","Large","Blue","Silk","test2.jpg"
"Test Product 3","Test description 3","Test Category",2000,7,"TEST-003","Small","Green","Linen","test3.jpg"`;

// Write test file
fs.writeFileSync('debug-test.csv', testCSV);

// Test parsing
console.log('Testing CSV parsing...');
const result = FileParser.parse('boutique', Buffer.from(testCSV), 'debug-test.csv');

console.log('Parse result:');
console.log('Products:', result.products.length);
console.log('Errors:', result.errors.length);
console.log('Warnings:', result.warnings.length);

if (result.errors.length > 0) {
  console.log('Errors found:');
  result.errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`);
  });
}

if (result.products.length > 0) {
  console.log('First product:');
  console.log(JSON.stringify(result.products[0], null, 2));
}