# 🚀 Production Admin Setup Guide for Vercel

## ⚡ Quick Answer

**The script does NOT run automatically on Vercel.** You must manually create the admin user using one of these methods.

---

## 📋 Method 1: Run Locally with Production DB (⭐ Recommended)

### Step 1: Get MongoDB Atlas Connection String

1. **Login to MongoDB Atlas:** https://cloud.mongodb.com
2. **Click "Connect"** on your cluster
3. **Copy connection string:**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/nirali-boutique?retryWrites=true&w=majority
   ```

### Step 2: Run the Script

```bash
cd apps/boutique
node scripts/create-production-admin.js "mongodb+srv://user:pass@cluster.mongodb.net/nirali-boutique"
```

### Example Output:
```
🚀 Creating Production Admin User
🔌 Connecting to production database...
✅ Connected successfully
🔍 Checking for existing admin...
✅ No admin found. Creating...
🔐 Hashing password...
✅ Password hashed successfully
👤 Creating admin user...
✅ PRODUCTION ADMIN CREATED SUCCESSFULLY!

📋 Credentials:
   Email:    admin@gmail.com
   Password: admin123
   Role:     admin

⚠️ IMPORTANT SECURITY NOTES:
   1. Login immediately and change password!
   2. Never share these credentials
```

---

## 🌐 Method 2: Use MongoDB Atlas UI (Easiest)

### Step 1: Generate Password Hash

Run locally to get bcrypt hash:
```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('admin123',10).then(h=>console.log(h))"
```

Copy the output hash (starts with `$2a$10$...`)

### Step 2: Insert via MongoDB Atlas

1. **Login to MongoDB Atlas**
2. **Browse Collections**
3. **Select Database:** `nirali-boutique`
4. **Select Collection:** `users`
5. **Click "Insert Document"**
6. **Paste this JSON:**

```json
{
  "name": "Admin",
  "email": "admin@gmail.com",
  "password": "$2a$10$xyz...paste-your-hash-here...",
  "role": "admin",
  "phone": "+91 9876543210",
  "address": "Nirali Sai Boutique",
  "createdAt": {"$date": "2026-03-06T12:00:00Z"},
  "updatedAt": {"$date": "2026-03-06T12:00:00Z"}
}
```

7. **Click "Insert"**

Done! Admin created ✅

---

## 🔧 Method 3: Vercel Deployment Hook (Advanced)

Create an API route that runs once on first deployment:

### Create `/app/api/setup-admin/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  // Only allow in development or if no admin exists
  try {
    await connectToDatabase();
    
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        error: 'Admin already exists',
        status: 400 
      });
    }
    
    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+91 9876543210',
      address: 'Nirali Sai Boutique'
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Admin created',
      email: admin.email
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create admin',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

### Usage:
After deploying to Vercel, visit:
```
https://your-app.vercel.app/api/setup-admin
```

**⚠️ WARNING:** Delete this route after use! Security risk if left active.

---

## 🎯 Recommended Workflow

### For Initial Setup:

1. **Deploy to Vercel** with environment variables set
2. **Run local script** with production DB URI:
   ```bash
   node scripts/create-production-admin.js "mongodb+srv://..."
   ```
3. **Login to production app** with credentials
4. **Change password** immediately

### For Future Admin Creation:

Use **Method 2** (MongoDB Atlas UI) - it's visual and safe.

---

## 🔐 Environment Variables for Vercel

In Vercel Dashboard → Settings → Environment Variables:

```bash
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nirali-boutique

# JWT Secret (REQUIRED - generate random 32+ chars)
JWT_SECRET=your-super-secret-random-key-min-32-characters

# Node Environment (automatic, but good to know)
NODE_ENV=production
```

**Save and redeploy** for changes to take effect.

---

## ✅ Verification Steps

After creating admin:

### 1. Test Login
- Go to production URL
- Login with: `admin@gmail.com` / `admin123`
- Should redirect to dashboard

### 2. Check Database
```bash
node scripts/list-users.js
# (with production URI temporarily in .env.local)
```

Should show admin user.

### 3. Check Browser Console
After login:
```javascript
localStorage.getItem('token')
// Should show JWT token
```

---

## 🛡️ Security Best Practices

### Immediately After First Login:
1. ✅ **Change password** from default `admin123`
2. ✅ **Update profile** with real details
3. ✅ **Enable 2FA** if available
4. ✅ **Log out and back in** with new password

### Production Checklist:
- [ ] ✅ MongoDB URI configured in Vercel
- [ ] ✅ Strong JWT secret set
- [ ] ✅ Admin user created
- [ ] ✅ Password changed from default
- [ ] ✅ HTTPS enabled (automatic with Vercel)
- [ ] ✅ Rate limiting active
- [ ] ✅ Monitoring enabled

---

## 🆘 Troubleshooting

### Problem: "Cannot connect to database"
**Solution:** Check MongoDB URI is correct and IP whitelist allows all IPs (0.0.0.0/0)

### Problem: "Admin already exists"
**Solution:** Good! Admin was already created. Just login.

### Problem: "Invalid credentials"
**Solution:** Make sure you're using exact credentials:
- Email: `admin@gmail.com` (case-sensitive)
- Password: `admin123` (case-sensitive)

### Problem: Can't access MongoDB Atlas
**Solution:** 
1. Check you have network access
2. Verify username/password in connection string
3. Ensure cluster is running

---

## 📊 Complete Flow Diagram

```
Local Machine                          Vercel Production
─────────────                          ───────────────────

1. Deploy Code
   git push → GitHub
                    ↓
              Vercel auto-deploys
                    ↓
              Environment variables loaded
                    ↓
              App ready at vercel.app
                    
2. Create Admin
   Run script locally →
   Connects to MongoDB Atlas ←
   Creates admin user in cloud DB
                    ↓
              Admin stored in production
                    ↓
3. Login
   Browser → vercel.app/login
   Enter credentials
   Verify against MongoDB Atlas
   Success! ✅
```

---

## 🎯 Summary

### Does it run automatically on Vercel?
**❌ NO!** You must manually create admin using:

1. **Local script** with production DB URI (Recommended)
2. **MongoDB Atlas UI** (Easiest)
3. **Setup API route** (Advanced, delete after use)

### Recommended Command:
```bash
node scripts/create-production-admin.js "mongodb+srv://your-uri"
```

### Credentials:
- Email: `admin@gmail.com`
- Password: `admin123`

### ⚠️ IMPORTANT:
**Change password immediately after first login!**

---

## 📞 Need Help?

If stuck:
1. Check Vercel deployment logs
2. Verify MongoDB Atlas connection
3. Test with local script first
4. Read error messages carefully

**Most common issue:** Wrong MongoDB URI or network access blocked in Atlas.
