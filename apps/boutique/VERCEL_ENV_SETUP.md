# Vercel Deployment Configuration Guide

## Environment Variables Required for Vercel

For the boutique app to work properly on Vercel, you **MUST** configure the following environment variables in your Vercel project settings:

### Cloudinary Configuration (Required for Image Uploads)

You can configure Cloudinary using ONE of these methods:

#### Method 1: CLOUDINARY_URL (Recommended)
```
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```
Example:
```
CLOUDINARY_URL=cloudinary://123456789012345:AbCdEfGhIjKlMnOpQrStUvWxYz@dxkqm1ifi
```

#### Method 2: Individual Variables
```
CLOUDINARY_CLOUD_NAME=dxkqm1ifi
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

### How to Add Environment Variables in Vercel

1. Go to your Vercel Dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable for **Production**, **Preview**, and **Development** environments
6. Save changes

### Important Notes

- **DO NOT** set `NEXT_PUBLIC_BASE_URL` or `NEXT_PUBLIC_API_URL` - these are no longer needed
- The app now uses relative API paths (`/api/*`) which work automatically in Vercel
- After adding environment variables, you must **redeploy** the project for changes to take effect

## Local Development

For local development, the app continues to work as before. No changes needed.

## Testing Image Uploads on Vercel

After deployment:

1. Navigate to `/admin/products/new`
2. Fill in product details
3. Upload an image
4. Submit the form
5. Check if product is created successfully
6. Verify image appears in Cloudinary dashboard

## Troubleshooting

### 500 Error on Image Upload
- Check that Cloudinary credentials are correctly set in Vercel
- Verify the CLOUDINARY_URL format is correct
- Check Vercel Function logs for detailed error messages

### MongoDB Connection Errors
- Ensure `MONGODB_URI` is set in Vercel environment variables
- Use MongoDB Atlas for cloud database (recommended for Vercel)

### Missing Brand Field Errors
- The app now automatically adds `brand: 'boutique'` to all products
- Existing products may need to be updated with the brand field
- Run the database migration script if needed

## Migration Script

To add brand field to existing products, run:
```bash
cd apps/boutique
node scripts/test-brand-field-fix.js
```

This will update all products missing the brand field.
