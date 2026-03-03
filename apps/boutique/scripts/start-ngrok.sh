#!/bin/bash
# Simple Ngrok Launcher for Mac/Linux
echo "🚀 Starting Ngrok tunnel for Razorpay webhook testing..."
echo "💡 Make sure your app is running on port 3001 first!"
echo

# Set ngrok auth token if available
if [ -n "$NGROK_AUTH_TOKEN" ]; then
    echo "Setting ngrok auth token..."
    ngrok config add-authtoken "$NGROK_AUTH_TOKEN"
fi

# Start ngrok with proper configuration
ngrok http 3001 --region us

# If ngrok fails, show help
if [ $? -ne 0 ]; then
    echo "❌ Ngrok failed to start"
    echo
    echo "💡 Make sure:"
    echo "1. Ngrok is installed: npm install -g ngrok"
    echo "2. Your app is running on port 3001"
    echo "3. You have internet connection"
    echo
    read -p "Press enter to continue..."
fi