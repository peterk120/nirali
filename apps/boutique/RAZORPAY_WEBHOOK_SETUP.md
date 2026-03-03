# Razorpay Webhook Local Testing Setup

## 🎯 Overview
This guide helps you test Razorpay webhooks locally using ngrok to expose your development server to the internet.

##📋 Prerequisites
- Node.js installed
- Your Next.js app running on port 3001
- Razorpay test account
- Internet connection

##🔧 Steps

### 1. Install Ngrok
```bash
npm install -g ngrok
```

### 2. Start Your Development Server
Make sure your app is running on port 3001:
```bash
cd apps/boutique
npm run dev
```

### 3. Start Ngrok Tunnel
In a new terminal window:

**Windows:**
```cmd
cd apps\boutique
scripts\start-ngrok.bat
```

**Mac/Linux:**
```bash
cd apps/boutique
chmod +x scripts/start-ngrok.sh
./scripts/start-ngrok.sh
```

**Alternative (manual):**
```bash
cd apps/boutique
ngrok http 3001 --region us
```

This will output something like:
```
✅ Ngrok tunnel established successfully!
🌐 Public webhook URL: https://abc123.ngrok.io/api/payment/webhook
```

### 4. Configure Razorpay Dashboard
1. Go to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → Webhooks
3. Add a new webhook with:
   - **URL**: `https://abc123.ngrok.io/api/payment/webhook` (from step 3)
   - **Events**: Select `payment.captured`, `payment.failed`, `order.paid`
   - **Secret**: `webhook_secret_12345` (matches your .env.local)
   - **Active**: Enable

### 5. Test the Webhook
1. Make a test payment through your app
2. Check your terminal for webhook logs:
   ```
  🔄 Razorpay Webhook Received - Starting processing...
  ✅ Database connected for webhook processing
  📝 Webhook Headers: { ... }
  🔐 Signature Verification: { verified: true }
  💰 Payment Captured Event: { ... }
  ✅ Webhook processed successfully
   ```

##🛠️ Development Workflow

### Daily Testing Routine
1. Start your app: `npm run dev`
2. Start ngrok: `node scripts/setup-webhook-tunnel.js`
3. Copy the generated URL to Razorpay dashboard
4. Test payments and monitor logs
5. Stop ngrok with Ctrl+C when done

### Environment Variables
Your `.env.local` should include:
```env
RAZORPAY_WEBHOOK_SECRET=webhook_secret_12345
NGROK_AUTH_TOKEN=your-ngrok-auth-token-here  # Optional
```

##🔍 Troubleshooting

### Common Issues

**1. "Cannot find module 'ngrok'"**
```bash
npm install -g ngrok
```

**2. "Address already in use"**
```bash
# Kill existing ngrok processes
taskkill /f /im ngrok.exe  # Windows
pkill ngrok               # Mac/Linux
```

**3. Webhook not received**
- Check if your app is running on port 3001
- Verify ngrok URL in Razorpay dashboard
- Check ngrok tunnel status: `http://localhost:4040`

**4. Signature verification fails**
- Ensure webhook secret matches in both code and dashboard
- Check that you're using the correct test keys

### Debug Tools

**Ngrok Dashboard**: Visit `http://localhost:4040` to see:
- Active tunnels
- Request/response logs
- Webhook inspection

**Webhook Health Check**: 
```bash
curl https://your-ngrok-url.ngrok.io/api/payment/webhook
```

##🚀 Features

### Custom Ngrok Domains (Optional)
If you have an ngrok account:
1. Get your auth token from [ngrok dashboard](https://dashboard.ngrok.com/)
2. Add to `.env.local`: `NGROK_AUTH_TOKEN=your-token`
3. Restart ngrok tunnel

### Multiple Webhook Events
The webhook handler supports:
- `payment.captured` - Successful payments
- `payment.failed` - Failed payments  
- `order.paid` - Order completion

##⚠ Security Notes

- **Development Only**: This setup is for local testing only
- **Never commit secrets**: Keep webhook secrets in `.env.local`
- **Use test keys**: Always use Razorpay test credentials
- **HTTPS required**: Ngrok provides HTTPS automatically

##📞
If you encounter issues:
1. Check ngrok status: `http://localhost:4040`
2. Verify your app is running on port 3001
3. Check webhook logs in your terminal
4. Test webhook URL health endpoint