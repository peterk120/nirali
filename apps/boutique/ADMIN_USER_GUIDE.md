# Admin User Creation Guide

## Quick Start

### Windows (Easy Way):
```bash
cd apps/boutique
create-admin.bat
```

### Manual Way:
```bash
cd apps/boutique
node scripts/create-admin.js
```

---

## What This Script Does

1. **Connects to MongoDB** using your `MONGODB_URI` from `.env.local`
2. **Checks if admin already exists** (prevents duplicates)
3. **Hashes the password** `admin123` using bcrypt
4. **Creates admin user** with the following details:
   - Email: `admin@gmail.com`
   - Password: `admin123` (hashed in database)
   - Role: `admin`
   - Name: `Admin`
   - Phone: `+91 9876543210`
   - Address: `Nirali Sai Boutique, Main Street, City, State 123456`

---

## Expected Output

```
🚀 Starting Admin User Creation Script
═══════════════════════════════════════

🔌 Connecting to MongoDB...
✅ Connected successfully
🔍 Checking if admin user already exists...
🔐 Hashing password...
✅ Password hashed successfully

👤 Creating admin user...
✅ Admin user created successfully!

📋 User Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name:        Admin
📧 Email:       admin@gmail.com
🔐 Password:    admin123 (for login)
🔑 Role:        admin
📱 Phone:       +91 9876543210
🏠 Address:     Nirali Sai Boutique, Main Street, City, State 123456
🆔 ID:          69a140995378c00befa39858
📅 Created:     2026-03-06T14:30:00.000Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ You can now login with:
   Email:    admin@gmail.com
   Password: admin123

💡 Make sure to change the password after first login in production!

🔌 Database connection closed
```

---

## Prerequisites

### 1. MongoDB Must Be Running
```bash
# If using local MongoDB
mongod --dbpath <your-db-path>
```

### 2. Environment Variables
Make sure `.env.local` has:
```bash
MONGODB_URI=mongodb://localhost:27017/nirali-boutique
```

Or for cloud MongoDB:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nirali-boutique
```

### 3. Required Dependencies
```bash
# In apps/boutique directory
pnpm install mongoose bcryptjs
```

These should already be installed if you've been using the app.

---

## How to Use Admin Account

### 1. Login to the App
- Go to `/login` or click "Login" button
- Enter credentials:
  - **Email:** `admin@gmail.com`
  - **Password:** `admin123`

### 2. Access Admin Features
Once logged in as admin, you can:
- View all bookings
- Manage products
- Access admin dashboard
- View analytics
- Manage orders

---

## Troubleshooting

### Error: "MongoDB connection failed"
**Solution:** 
1. Check if MongoDB is running
2. Verify `MONGODB_URI` in `.env.local`
3. For local MongoDB: `net start MongoDB` (Windows) or `brew services start mongodb-community` (Mac)

### Error: "Admin user already exists"
**Solution:**
The script detected an existing admin. To reset:
```javascript
// Option 1: Delete via MongoDB shell
use nirali-boutique
db.users.deleteOne({ email: 'admin@gmail.com' })

// Option 2: Run the script again and it will show existing admin details
```

### Error: "Cannot find module 'mongoose'"
**Solution:**
```bash
cd apps/boutique
pnpm install mongoose bcryptjs
```

### Error: "ECONNREFUSED"
**Solution:**
MongoDB isn't running. Start it:
```bash
# Windows (if installed as service)
net start MongoDB

# Or manually
mongod --dbpath C:\data\db
```

---

## Security Notes

### ⚠️ IMPORTANT FOR PRODUCTION

The default credentials are for development only:
- Email: `admin@gmail.com`
- Password: `admin123`

**Before deploying to production:**
1. Change the password immediately after first login
2. Or delete this admin and create a new one with strong credentials
3. Use environment variables for sensitive data
4. Never commit `.env.local` to git

### Best Practices:
- ✅ Use strong passwords (12+ characters)
- ✅ Enable two-factor authentication if available
- ✅ Regularly rotate admin passwords
- ✅ Monitor admin access logs
- ✅ Limit admin access to authorized personnel only

---

## Database Schema

The admin user is stored in the `users` collection:

```javascript
{
  _id: ObjectId("69a140995378c00befa39858"),
  name: "Admin",
  email: "admin@gmail.com",
  password: "$2a$10$xyz...hashed...",  // bcrypt hash of "admin123"
  role: "admin",
  phone: "+91 9876543210",
  address: "Nirali Sai Boutique, Main Street, City, State 123456",
  createdAt: ISODate("2026-03-06T14:30:00.000Z")
}
```

---

## Alternative: Create Admin via MongoDB Shell

If the script doesn't work, you can manually create admin:

### 1. Open MongoDB Shell
```bash
mongosh
# or
mongo
```

### 2. Connect to Database
```javascript
use nirali-boutique
```

### 3. Generate Password Hash
You'll need to hash `admin123` first. Use this Node.js snippet:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(hash => console.log(hash));
```

### 4. Insert Admin User
```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@gmail.com",
  password: "$2a$10$xyz...paste-hash-here...",  // Replace with actual hash
  role: "admin",
  phone: "+91 9876543210",
  address: "Nirali Sai Boutique, Main Street, City, State 123456",
  createdAt: new Date()
});
```

### 5. Verify Creation
```javascript
db.users.findOne({ email: 'admin@gmail.com' })
```

---

## Verification Steps

After running the script:

### 1. Check Database
```javascript
// MongoDB shell
use nirali-boutique
db.users.find({ role: 'admin' })
```

Should show your admin user.

### 2. Test Login
1. Open app in browser
2. Go to login page
3. Enter:
   - Email: `admin@gmail.com`
   - Password: `admin123`
4. Should redirect to admin dashboard

### 3. Check Console Logs
The script output should show:
- ✅ Connection successful
- ✅ Password hashed
- ✅ Admin created
- ✅ All details displayed

---

## Related Files

- **Script:** `scripts/create-admin.js`
- **Batch File:** `create-admin.bat`
- **User Model:** `models/User.ts`
- **Auth Library:** `lib/auth.ts`
- **Login Route:** `app/api/auth/login/route.ts`

---

## Next Steps

After creating admin account:

1. ✅ **Test the login** - Verify credentials work
2. ✅ **Explore admin panel** - Check all features
3. ✅ **Change password** - For security (production only)
4. ✅ **Add more admins** - If needed (modify script)
5. ✅ **Document credentials** - Store securely (not in code!)

---

## Support

If you encounter issues:
1. Check MongoDB is running
2. Verify `.env.local` configuration
3. Ensure dependencies are installed
4. Review error messages in console
5. Check MongoDB logs for connection issues

**Common Issues:**
- MongoDB not running → Start MongoDB service
- Wrong connection string → Check `MONGODB_URI`
- Port conflict → Use different port or stop other MongoDB instances
- Permission denied → Run as administrator (Windows)

---

## Summary

**Quick Command:**
```bash
cd apps/boutique
create-admin.bat
```

**Credentials:**
- Email: `admin@gmail.com`
- Password: `admin123`

**Result:** Admin user created in database, ready to login! ✨
