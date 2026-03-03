# Vercel Deployment Verification Checklist

## Pre-Deployment ✅

### 1. Code Changes Verified
- [x] Removed all `localhost:3001` references from API calls
- [x] Changed to relative `/api/*` paths
- [x] Added brand field to product creation
- [x] Added storeType field to product creation
- [x] Migration script created for existing products

### 2. Files Modified
- [x] `lib/cloudinary.ts` - Relative API paths
- [x] `lib/api.ts` - Relative API paths  
- [x] `app/api/products/route.ts` - Brand field support
- [x] `app/admin/products/new/page.tsx` - Form fields added
- [x] Created migration script
- [x] Created documentation

### 3. Local Testing
Run these tests locally before deploying:

```bash
# Start the dev server
cd apps/boutique
pnpm dev

# Test in browser at http://localhost:3001
```

**Test Scenarios:**
- [ ] Navigate to `/admin/products/new`
- [ ] Fill in product form (name, category, price, description)
- [ ] Upload an image (JPG/PNG < 10MB)
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Check database for new product
- [ ] Verify image uploaded to Cloudinary

## Vercel Configuration 🔧

### Environment Variables (REQUIRED)

Add these in Vercel Dashboard → Settings → Environment Variables:

#### For Production Environment:
```env
CLOUDINARY_URL=cloudinary://YOUR_API_KEY:YOUR_API_SECRET@YOUR_CLOUD_NAME
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/nirali-sai
```

#### For Preview Environment:
```env
CLOUDINARY_URL=cloudinary://YOUR_API_KEY:YOUR_API_SECRET@YOUR_CLOUD_NAME
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/nirali-sai
```

#### For Development Environment:
```env
CLOUDINARY_URL=cloudinary://YOUR_API_KEY:YOUR_API_SECRET@YOUR_CLOUD_NAME
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/nirali-sai
```

**Important:** Set variables for ALL three environments (Production, Preview, Development)

### How to Add Environment Variables:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Click **+ Add New**
6. Enter variable name and value
7. Select environments (check all 3)
8. Click **Save**
9. Repeat for each variable

## Post-Deployment Testing 🚀

### Immediately After Deployment:

1. **Check Deployment Status**
   ```
   ✓ Build completed
   ✓ Functions deployed
   ✓ Deployment ready
   ```

2. **Visit Your Deployed Site**
   ```
   https://your-project.vercel.app
   ```

3. **Test Image Upload Flow**
   - Navigate to: `https://your-project.vercel.app/admin/products/new`
   - Fill in product details:
     - Name: "Test Product"
     - Category: "Test Category"
     - Price: 1000
     - Stock: 10
     - Description: "Test product for Vercel deployment"
   - Upload an image
   - Click "Create Product"
   - Expected: Success message + redirect to products list

4. **Verify in Database**
   ```javascript
   // Connect to MongoDB and check:
   db.products.findOne({ name: "Test Product" })
   
   // Should see:
   {
     _id: ObjectId("..."),
     name: "Test Product",
     brand: "boutique",      // ← Should be present
     storeType: "boutique",  // ← Should be present
     image: "https://res.cloudinary.com/...",
     ...
   }
   ```

5. **Check Cloudinary**
   - Login to Cloudinary dashboard
   - Check if image was uploaded
   - Verify public_id matches what's in MongoDB

6. **Check Vercel Logs**
   - Go to Vercel Dashboard
   - Click on your deployment
   - Click **Functions** tab
   - Look for any errors
   - Should see successful upload logs

### Migration (If Needed):

If you have existing products without brand field:

```bash
# From apps/boutique directory
node scripts/migrate-products-brand.js
```

Expected output:
```
🚀 Starting Brand Field Migration...

Connecting to MongoDB...
✓ Connected to MongoDB

📊 Found X products without brand field

🔄 Updating products...
✓ Updated X products

📈 Total products with brand='boutique': X

✅ Migration completed successfully!
```

## Troubleshooting Guide 🐛

### Error: 500 on Image Upload

**Symptoms:** Upload fails with 500 error

**Check:**
1. Vercel Function logs for error details
2. Is `CLOUDINARY_URL` set correctly?
3. Format should be: `cloudinary://KEY:SECRET@NAME`

**Fix:**
```bash
# In Vercel Dashboard
Settings → Environment Variables
Edit CLOUDINARY_URL
Ensure format is correct
Redeploy
```

### Error: MongoDB Connection Failed

**Symptoms:** Products not saving, database connection errors

**Check:**
1. Is `MONGODB_URI` set in Vercel?
2. Is MongoDB Atlas accessible?
3. Whitelist IP: `0.0.0.0/0` (allow all) for Vercel

**Fix:**
```bash
# In MongoDB Atlas:
Network Access → Add IP Address → Allow All IPs

# In Vercel:
Settings → Environment Variables
Verify MONGODB_URI is correct
```

### Error: Validation Failed (Brand Field Missing)

**Symptoms:** Product creation fails with validation error

**Check:**
1. Are old products missing brand field?
2. Run migration script

**Fix:**
```bash
node scripts/migrate-products-brand.js
```

### Images Not Loading

**Symptoms:** Products created but images show broken icon

**Check:**
1. Cloudinary dashboard for images
2. Browser console for CORS errors
3. Network tab for 404s

**Possible Fixes:**
- Verify Cloudinary credentials
- Check image URL format in database
- Ensure Cloudinary folder exists

## Success Indicators ✅

You know it's working when:

1. ✅ No 500 errors in Vercel logs
2. ✅ Products save successfully to MongoDB
3. ✅ Images upload to Cloudinary successfully
4. ✅ Brand field is populated in all products
5. ✅ Frontend displays images correctly
6. ✅ No localhost references in code
7. ✅ Works on both local and production

## Rollback Plan 🔄

If something goes wrong:

1. **Quick Rollback:**
   ```bash
   git revert <deployment-commit>
   git push
   # Vercel will auto-deploy previous version
   ```

2. **Check What Changed:**
   - Review recent commits
   - Check environment variables
   - Review Vercel logs

3. **Debug Locally:**
   ```bash
   # Test with same env vars as Vercel
   cp .env.local .env.local.backup
   # Copy env vars from Vercel to .env.local
   pnpm dev
   # Reproduce issue locally
   ```

## Monitoring & Maintenance 📊

### First Week After Deployment:

**Daily Checks:**
- [ ] Check Vercel logs for errors
- [ ] Monitor Cloudinary storage usage
- [ ] Verify new products have brand field
- [ ] Check MongoDB connection health

**Weekly Checks:**
- [ ] Review function execution times
- [ ] Check for slow database queries
- [ ] Monitor image upload success rate
- [ ] Review error logs

### Ongoing:

- Keep Cloudinary credentials updated
- Monitor MongoDB storage
- Review Vercel function limits
- Check deployment performance metrics

## Contact & Support

If issues persist:
- Check Vercel documentation: https://vercel.com/docs
- Cloudinary support: https://support.cloudinary.com
- MongoDB docs: https://www.mongodb.com/docs

---

**Last Updated:** 2026-03-03
**Status:** Ready for Production Deployment ✅
