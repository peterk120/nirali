# PORT LOCK CONFIGURATION

##⚠ CRITICAL: PORT 3001 LOCKED⚠

This boutique app is **LOCKED** to run ONLY on **localhost:3001**.

### Configuration Files:
1. `package.json` - scripts explicitly set to use port 3001
2. `.env.local` - `NEXT_PUBLIC_BASE_URL` set to `http://localhost:3001`
3. `next.config.js` - No port override (uses package.json setting)

### Commands:
- `pnpm dev` - Runs on port 3001
- `pnpm start` - Runs on port 3001

### From Root Directory:
- `pnpm dev:boutique` - Runs only boutique app on port 3001
- `pnpm start:boutique` - Starts only boutique app on port 3001

###⚠ DO NOT CHANGE:
- Never modify the port configuration
- Never run this app on a different port
- Never change `NEXT_PUBLIC_BASE_URL` in `.env.local`
- Never modify the `dev` or `start` scripts in `package.json`

This configuration is locked and must remain unchanged.