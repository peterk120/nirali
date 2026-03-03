@echo off
REM Deploy boutique app to Vercel

REM Navigate to root directory
cd ..\..

REM Deploy using vercel CLI with specific configuration
vercel --prod ^
  --name nirali-sai-boutique ^
  --cwd apps/boutique ^
  --build-env NODE_ENV=production ^
  --env NEXT_PUBLIC_BASE_PATH=/boutique