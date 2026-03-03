// Test script to check API response
async function testApi() {
  try {
    console.log('Testing API endpoint...');
    const response = await fetch('http://localhost:3001/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (data.success) {
      console.log(`Success: Found ${data.count || data.data?.length || 0} products`);
      if (data.data && data.data.length > 0) {
        console.log('Sample product:', data.data[0]);
      } else {
        console.log('No products found in database');
      }
    } else {
      console.log('API Error:', data.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testApi();