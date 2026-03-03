export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test Cloudinary configuration
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const publicCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // Check what's available
    const config = {
      hasCloudinaryUrl: !!cloudinaryUrl,
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      hasPublicCloudName: !!publicCloudName,
      cloudName: cloudName || 'NOT SET',
      publicCloudName: publicCloudName || 'NOT SET',
      apiKey: apiKey ? `***${apiKey.slice(-4)}` : 'NOT SET',
    };

    // Test Cloudinary connection
    let cloudinaryTestResult = null;
    if (cloudName) {
      try {
        // Test ping endpoint (doesn't require authentication)
        const pingResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/ping`
        );
        
        cloudinaryTestResult = {
          status: pingResponse.status,
          ok: pingResponse.ok,
          statusText: pingResponse.statusText
        };
        
        if (!pingResponse.ok) {
          const errorText = await pingResponse.text();
          cloudinaryTestResult.error = errorText;
        }
      } catch (error: any) {
        cloudinaryTestResult = {
          error: error.message,
          ok: false
        };
      }
    }

    return Response.json({
      success: true,
      config,
      cloudinaryTest: cloudinaryTestResult,
      message: 'Cloudinary configuration test completed'
    });
  } catch (error: any) {
    console.error('Error testing Cloudinary configuration:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}