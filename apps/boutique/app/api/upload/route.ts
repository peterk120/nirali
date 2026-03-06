export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';

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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif', 'video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: `Invalid file type: ${file.type}. Only images (JPEG, PNG, GIF, WebP, HEIC), videos, and text files are allowed for testing.` },
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
    // First try CLOUDINARY_URL (recommended approach)
    let apiKey: string, apiSecret: string, cloudName: string;
    
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    console.log('CLOUDINARY_URL from env:', cloudinaryUrl);
    
    if (cloudinaryUrl) {
      // Parse the CLOUDINARY_URL to extract cloud name, API key, and API secret
      const urlRegex = /cloudinary:\/\/(\d+):([^@]+)@(.+)/;
      const match = cloudinaryUrl.match(urlRegex);

      if (!match) {
        console.error('Failed to parse CLOUDINARY_URL:', cloudinaryUrl);
        return Response.json(
          { success: false, error: 'Invalid CLOUDINARY_URL format' },
          { status: 500 }
        );
      }

      [, apiKey, apiSecret, cloudName] = match;
      console.log('Parsed from CLOUDINARY_URL:', { cloudName, apiKey: '***' + apiKey.slice(-4), hasSecret: !!apiSecret });
    } else {
      // Fallback to individual environment variables
      apiKey = process.env.CLOUDINARY_API_KEY || '';
      apiSecret = process.env.CLOUDINARY_API_SECRET || '';
      cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
      
      console.log('Using individual env vars:', { cloudName, apiKey: '***' + apiKey.slice(-4), hasSecret: !!apiSecret });
      
      if (!apiKey || !apiSecret || !cloudName) {
        return Response.json(
          { success: false, error: 'Cloudinary configuration is missing. Please check your environment variables.' },
          { status: 500 }
        );
      }
    }

    // Log configuration for debugging (remove in production)
    console.log('Cloudinary config:', { cloudName, apiKey: apiKey ? '***' + apiKey.slice(-4) : 'MISSING', hasSecret: !!apiSecret });

    // Convert File object to buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare form data for Cloudinary API
    const cloudinaryFormData = new FormData();
    const fileBlob = new Blob([buffer], { type: file.type });
    cloudinaryFormData.append('file', fileBlob, file.name);
    // IMPORTANT: This upload preset must be created in your Cloudinary dashboard as an unsigned preset
    // If you don't have an upload preset, you can use signed uploads instead
    cloudinaryFormData.append('upload_preset', 'nirali_sai_unsigned'); 
    cloudinaryFormData.append('folder', folder || 'nirali-sai-boutique');
    
    // Add timestamp for security
    cloudinaryFormData.append('timestamp', Date.now().toString());

    // Make direct request to Cloudinary API using unsigned upload
    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    console.log('Uploading to:', cloudinaryUploadUrl);
    
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
      message: 'File uploaded successfully'
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}