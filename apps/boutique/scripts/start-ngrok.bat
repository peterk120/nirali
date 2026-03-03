@echo off
REM Simple Ngrok Launcher for Windows
echo🚀 Starting Ngrok tunnel for Razorpay webhook testing...
echo💡 Make sure your app is running on port 3001 first!
echo.

REM Set ngrok auth token if available
if defined NGROK_AUTH_TOKEN (
    echo Setting ngrok auth token...
    ngrok config add-authtoken %NGROK_AUTH_TOKEN%
)

REM Start ngrok with proper configuration
ngrok http 3001 --region us

REM If ngrok fails, show help
if %errorlevel% neq 0 (
    echo ❌ Ngrok failed to start
    echo.
    echo💡 Make sure:
    echo 1. Ngrok is installed: npm install -g ngrok
    echo 2. Your app is running on port 3001
    echo 3. You have internet connection
    echo.
    pause
)