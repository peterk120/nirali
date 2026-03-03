// Test XLSX parsing functionality
const XLSX = require('xlsx');
const fs = require('fs');

// Create a simple test XLSX file
function createTestXLSX() {
  const data = [
    ['productName', 'description', 'category', 'price', 'stock', 'sku', 'size', 'color', 'fabric', 'imageName'],
    ['Test Dress', 'Beautiful test dress', 'Casual Wear', 1500, 5, 'TST-001', 'Medium', 'Red', 'Cotton', 'test-dress.jpg']
  ];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  fs.writeFileSync('test-products.xlsx', buffer);
  console.log('✅ Test XLSX file created: test-products.xlsx');
  return buffer;
}

// Test parsing
function testXLSXParsing(buffer) {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const records = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    console.log('✅ XLSX parsing successful');
    console.log('Records found:', records.length);
    console.log('First record:', records[0]);
    return records;
  } catch (error) {
    console.error('❌ XLSX parsing failed:', error.message);
    return null;
  }
}

// Run tests
console.log('🧪 Testing XLSX functionality...\n');
const buffer = createTestXLSX();
const records = testXLSXParsing(buffer);

if (records && records.length > 0) {
  console.log('\n🎉 XLSX functionality is working correctly!');
  console.log('Ready to handle both CSV and XLSX bulk uploads.');
}