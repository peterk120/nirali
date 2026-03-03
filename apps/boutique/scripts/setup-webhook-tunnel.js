// Ngrok Setup Script for Local Webhook Testing
// Using global ngrok installation
const { spawn } = require('child_process');

async function setupWebhookTunnel() {
  try {
    console.log('🚀 Starting Ngrok tunnel for Razorpay webhook testing...');
    console.log('💡 Make sure your app is running on port 3001 first!');
    console.log('');
    
    // Start ngrok process
    const ngrokProcess = spawn('ngrok', [
      'http',
      '3001',
      '--region=us'
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Handle ngrok output
    let tunnelUrl = null;
    
    ngrokProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Ngrok:', output);
      
      // Extract the tunnel URL
      const urlMatch = output.match(/https:\/\/([a-zA-Z0-9-]+\.ngrok\.io)/);
      if (urlMatch && !tunnelUrl) {
        tunnelUrl = urlMatch[1];
        console.log('✅ Ngrok tunnel established successfully!');
        console.log('🌐 Public webhook URL:', `https://${tunnelUrl}/api/payment/webhook`);
        console.log('📋 Configuration for Razorpay Dashboard:');
        console.log('   Webhook URL:', `https://${tunnelUrl}/api/payment/webhook`);
        console.log('   Events to subscribe: payment.captured, payment.failed, order.paid');
        console.log('   Secret:', 'webhook_secret_12345');
        console.log('');
        console.log('💡 Testing steps:');
        console.log('1. Copy the webhook URL above to your Razorpay Dashboard');
        console.log('2. Make a test payment through your app');
        console.log('3. Check your terminal for webhook logs');
        console.log('4. Verify payment processing in your database');
        console.log('');
        console.log('⚠️  Press Ctrl+C to stop the tunnel');
      }
    });
    
    // Handle errors
    ngrokProcess.stderr.on('data', (data) => {
      console.error('Ngrok Error:', data.toString());
    });
    
    ngrokProcess.on('error', (error) => {
      console.error('❌ Failed to start ngrok:', error.message);
      console.log('💡 Make sure:');
      console.log('1. Ngrok is installed: npm install -g ngrok');
      console.log('2. Your app is running on port 3001');
      console.log('3. You have internet connection');
      process.exit(1);
    });
    
    // Keep the tunnel alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down ngrok tunnel...');
      ngrokProcess.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start ngrok tunnel:', error.message);
    console.log('💡 Make sure:');
    console.log('1. Your app is running on port 3001');
    console.log('2. You have internet connection');
    console.log('3. Ngrok is properly installed (npm install -g ngrok)');
  }
}

// Run the setup
setupWebhookTunnel();