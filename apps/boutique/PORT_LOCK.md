# PORT LOCK CONFIGURATION

## ⚠ CRITICAL: Development Port Locked ⚠

This boutique app is **LOCKED** to run ONLY on **localhost:3001** for local development.

### Configuration Files:
1. `package.json` - scripts explicitly set to use port 3001
2. ~~`.env.local`~~ - **NO LONGER NEEDED** (removed in Vercel update)
3. `next.config.js` - No port override (uses package.json setting)

### Commands:
- `pnpm dev` - Runs on port 3001 (local development)
- `pnpm start` - Runs on port 3001 (local production)

### From Root Directory:
- `pnpm dev:boutique` - Runs only boutique app on port 3001
- `pnpm start:boutique` - Starts only boutique app on port 3001

## 🚀 Vercel Deployment Update

**IMPORTANT**: The app has been updated to support Vercel serverless deployment:

### Changes Made:
1. ✅ **Relative API Paths**: All API calls now use `/api/*` instead of absolute URLs
2. ✅ **Removed Environment Dependencies**: `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_API_URL` are no longer needed
3. ✅ **Brand Field Support**: Products now include required `brand` and `storeType` fields
4. ✅ **Cloudinary Integration**: Image uploads work in serverless environment

### Required Vercel Environment Variables:
```
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
MONGODB_URI=mongodb+srv://...
```

See `VERCEL_ENV_SETUP.md` for complete deployment instructions.

### ⚠ DO NOT CHANGE (Local Development):
- Never modify the port configuration for local development
- Never change the `dev` or `start` scripts in `package.json`
- Local development will continue to use port 3001

### ✅ Production (Vercel):
- Uses relative paths automatically
- No port configuration needed
- Serverless functions handle routing