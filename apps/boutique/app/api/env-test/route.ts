export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Direct test of environment variables
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const publicCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return Response.json({
    envVars: {
      CLOUDINARY_URL: cloudinaryUrl ? 'SET' : 'NOT SET',
      CLOUDINARY_CLOUD_NAME: cloudName ? 'SET' : 'NOT SET',
      CLOUDINARY_API_KEY: apiKey ? 'SET' : 'NOT SET',
      CLOUDINARY_API_SECRET: apiSecret ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: publicCloudName ? 'SET' : 'NOT SET'
    },
    values: {
      CLOUDINARY_URL: cloudinaryUrl,
      CLOUDINARY_CLOUD_NAME: cloudName,
      CLOUDINARY_API_KEY: apiKey,
      CLOUDINARY_API_SECRET: apiSecret,
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: publicCloudName
    }
  });
}