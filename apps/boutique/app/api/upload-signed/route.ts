export const dynamic = 'force-dynamic';
// Alternative Cloudinary upload implementation using signed uploads
// This doesn't require an upload preset but uses your API secret server-side

import { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Parse form data to get the uploaded file
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;
    
    if (!file) {
      return Response.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type (image or video)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: `Invalid file type: ${file.type}. Only images, videos, and text files are allowed for testing.` },
        { status: 400 }
      );
    }

    // Validate file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return Response.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Extract Cloudinary configuration
    let apiKey: string, apiSecret: string, cloudName: string;
    
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (cloudinaryUrl) {
      const urlRegex = /cloudinary:\/\/(\d+):([^@]+)@(.+)/;
      const match = cloudinaryUrl.match(urlRegex);

      if (!match) {
        return Response.json(
          { success: false, error: 'Invalid CLOUDINARY_URL format' },
          { status: 500 }
        );
      }

      [, apiKey, apiSecret, cloudName] = match;
    } else {
      // Fallback to individual environment variables
      apiKey = process.env.CLOUDINARY_API_KEY || '';
      apiSecret = process.env.CLOUDINARY_API_SECRET || '';
      cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
      
      if (!apiKey || !apiSecret || !cloudName) {
        return Response.json(
          { success: false, error: 'Cloudinary configuration is missing. Please check your environment variables.' },
          { status: 500 }
        );
      }
    }

    console.log('Cloudinary config (signed):', { 
      cloudName, 
      apiKey: apiKey ? '***' + apiKey.slice(-4) : 'MISSING' 
    });

    // Convert File object to buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate signature for signed upload
    const timestamp = Math.floor(Date.now() / 1000);
    const folderPath = folder || 'nirali-sai-boutique';
    
    // Create signature string (parameters in alphabetical order)
    const signatureString = `folder=${folderPath}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex');

    // Prepare form data for Cloudinary API (signed upload)
    const cloudinaryFormData = new FormData();
    const fileBlob = new Blob([buffer], { type: file.type });
    cloudinaryFormData.append('file', fileBlob, file.name);
    cloudinaryFormData.append('api_key', apiKey);
    cloudinaryFormData.append('timestamp', timestamp.toString());
    cloudinaryFormData.append('folder', folderPath);
    cloudinaryFormData.append('signature', signature);

    // Make direct request to Cloudinary API using signed upload
    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    console.log('Uploading to (signed):', cloudinaryUploadUrl);
    
    const cloudinaryResponse = await fetch(cloudinaryUploadUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error('Cloudinary API Error:', errorText);
      
      let errorMessage = 'Upload to Cloudinary failed';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${cloudinaryResponse.status}: ${errorText}`;
      }
      
      return Response.json(
        { success: false, error: errorMessage },
        { status: cloudinaryResponse.status }
      );
    }

    const result = await cloudinaryResponse.json();

    return Response.json({
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        original_filename: result.original_filename,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        resource_type: result.resource_type,
        type: result.type,
      },
      message: 'File uploaded successfully (signed upload)'
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}