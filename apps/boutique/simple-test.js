// Simple test to verify the fixes
const fs = require('fs');
const { parse } = require('csv-parse/sync');

// Read and parse the CSV file like the API would
const csvBuffer = fs.readFileSync('test-upload.csv');
const csvText = csvBuffer.toString('utf-8');

// Parse CSV data
const records = parse(csvText, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

console.log('Records parsed:', records.length);
console.log('First record:', records[0]);

// Test the validation logic that was failing
const requiredFields = ['productName', 'description', 'category', 'price', 'stock', 'imageName'];
const errors = [];

for (const record of records) {
  for (const requiredField of requiredFields) {
    if (!record[requiredField] || record[requiredField].toString().trim() === '') {
      errors.push(`Missing required field '${requiredField}'`);
    }
  }
  
  // Validate data types
  if (record.price !== undefined) {
    const price = parseFloat(record.price);
    if (isNaN(price) || price < 0) {
      errors.push(`Invalid price value: ${record.price}`);
    }
  }
  
  if (record.stock !== undefined) {
    const stock = parseInt(record.stock);
    if (isNaN(stock) || stock < 0) {
      errors.push(`Invalid stock value: ${record.stock}`);
    }
  }
}

console.log('Validation errors:', errors.length);
if (errors.length > 0) {
  console.log('Errors:', errors);
} else {
  console.log('✅ All records passed validation!');
}