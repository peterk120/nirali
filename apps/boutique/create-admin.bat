@echo off
REM Script to create admin user in MongoDB
REM Email: admin@gmail.com
REM Password: admin123

echo.
echo ========================================
echo Creating Admin User for Nirali Boutique
echo ========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo WARNING: .env.local file not found!
    echo Using default MongoDB connection: mongodb://localhost:27017/nirali-boutique
    echo.
)

REM Run the script
node scripts/create-admin.js

echo.
echo ========================================
echo Script completed
echo ========================================
echo.
pause
