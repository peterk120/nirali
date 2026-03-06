# Admin Login Script - Usage Guide

## ✅ Features

- ✅ **Checks if admin exists** before creating
- ✅ **Prevents duplicate** admin users
- ✅ **Shows existing admin details** if already created
- ✅ **Safe to run multiple times**
- ✅ **Hides MongoDB credentials** in logs
- ✅ **Better error handling**

---

## 🚀 How to Use

### Windows (PowerShell or CMD):
```bash
cd apps/boutique
node scripts/create-admin.js
```

### Or use the batch file:
```bash
cd apps/boutique
.\create-admin.bat
```

---

## 📊 What It Does

### Scenario 1: Admin Doesn't Exist
```
🔌 Connecting to MongoDB...
✅ Connected successfully
🔍 Checking for existing admin user...
✅ No existing admin found. Creating new admin user...
🔐 Hashing password...
✅ Password hashed successfully
👤 Creating admin user...
✅ ADMIN USER CREATED SUCCESSFULLY!

📋 User Details:
   Email:    admin@gmail.com
   Password: admin123
   
✨ You can now login with these credentials!
```

### Scenario 2: Admin Already Exists ✅
```
🔌 Connecting to MongoDB...
✅ Connected successfully
🔍 Checking for existing admin user...

⚠️  ADMIN USER ALREADY EXISTS!

📋 Existing Admin Details:
   🆔 ID:        69aaab05507913bfbdf6e8d9
   👤 Name:      Admin
   📧 Email:     admin@gmail.com
   🔑 Role:      admin
   📱 Phone:     +91 9876543210
   📅 Created:   6/3/2026, 3:53:01 pm

💡 Login Credentials:
   Email:    admin@gmail.com
   Password: admin123

✨ Admin user is ready to use! No action needed.
```

---

## 🔐 Default Credentials

| Field | Value |
|-------|-------|
| **Email** | `admin@gmail.com` |
| **Password** | `admin123` |
| **Role** | `admin` |

---

## 💡 Security Notes

### ⚠️ IMPORTANT:
1. **Change password after first login** in production
2. **Never commit** `.env.local` to git
3. **Use strong passwords** in production
4. **Don't share** admin credentials publicly

### Best Practices:
- ✅ Run script once to create admin
- ✅ Login immediately
- ✅ Change password in profile settings
- ✅ Document credentials securely (offline)

---

## 🛡️ How It Prevents Duplicates

The script checks database before creating:

```javascript
const existingAdmin = await User.findOne({ email: adminEmail });

if (existingAdmin) {
    // Shows existing admin details
    // Exits without creating duplicate
    return;
}

// Only creates if no admin exists
await User.create({...});
```

**Result:** Safe to run multiple times - won't create duplicates!

---

## 📝 Script Output Explained

### Connection Info:
```
🔌 Connecting to MongoDB...
   URI: mongodb://localhost:27017/nirali-boutique
✅ Connected successfully
```
Shows MongoDB connection string (hides passwords automatically)

### Check Status:
```
🔍 Checking for existing admin user...
```
Searches database for admin@gmail.com

### If Exists:
```
⚠️  ADMIN USER ALREADY EXISTS!
📋 Existing Admin Details: ...
✨ Admin user is ready to use! No action needed.
```
Shows details and exits safely

### If New:
```
✅ No existing admin found. Creating new admin user...
🔐 Hashing password...
✅ Password hashed successfully
👤 Creating admin user...
✅ ADMIN USER CREATED SUCCESSFULLY!
```
Creates new admin with hashed password

---

## 🧪 Testing

### Test 1: First Run (Should Create Admin)
```bash
node scripts/create-admin.js
```
Expected: Creates admin user

### Test 2: Second Run (Should Detect Existing)
```bash
node scripts/create-admin.js
```
Expected: Shows "ALREADY EXISTS" message

### Test 3: Verify in Database
```bash
node scripts/list-users.js
```
Expected: Shows admin in user list

---

## 🔧 Troubleshooting

### Error: "MongoDB connection failed"
**Solution:** Start MongoDB or check MONGODB_URI

### Error: "Cannot find module 'mongoose'"
**Solution:** 
```bash
pnpm install mongoose bcryptjs
```

### Error: "ECONNREFUSED"
**Solution:** MongoDB isn't running. Start it first.

---

## 📦 For Production (Vercel)

### Step 1: Set Environment Variables
In Vercel dashboard:
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nirali-boutique
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

### Step 2: Run Script with Production DB
```bash
# Temporarily update .env.local with production URI
MONGODB_URI=mongodb+srv://your-production-uri

# Run the script
node scripts/create-admin.js

# Revert .env.local back to local URI
```

### Step 3: Or Use MongoDB Atlas UI
1. Login to MongoDB Atlas
2. Browse Collections → nirali-boutique → users
3. Insert document manually
4. Use pre-hashed password

---

## 🎯 Quick Reference

### Create Admin:
```bash
cd apps/boutique
node scripts/create-admin.js
```

### List All Users:
```bash
node scripts/list-users.js
```

### Login:
- Go to `/login`
- Email: `admin@gmail.com`
- Password: `admin123`

---

## ✅ Summary

**What the script does:**
1. ✅ Connects to MongoDB
2. ✅ Checks if admin exists
3. ✅ If yes → Shows details, exits safely
4. ✅ If no → Creates new admin with hashed password
5. ✅ Displays credentials
6. ✅ Closes connection properly

**Key benefit:** **Run it anytime without worrying about duplicates!** 🎉

---

## 🆘 Support

If you encounter issues:
1. Check MongoDB is running
2. Verify `.env.local` has correct URI
3. Ensure dependencies installed
4. Read error messages in console

**Most common issue:** MongoDB not running → Start it first!
