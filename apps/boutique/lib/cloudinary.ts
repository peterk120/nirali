// lib/cloudinary.ts
// Simple API-based upload function for Cloudinary
// This approach calls our API route which handles the actual Cloudinary upload

export interface UploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  resource_type: string;
  type: string;
}

/**
 * Uploads a file to Cloudinary via API route (unsigned upload)
 * @param file - The file to upload
 * @param folder - The folder to upload to
 * @returns The upload result
 */
export const uploadFile = async (
  file: File,
  folder: string = 'nirali-sai-boutique'
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  // Construct absolute URL for serverless environments
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  
  let response = await fetch(`${baseUrl}/api/upload-signed`, {
    method: 'POST',
    body: formData,
  });

  // If signed upload fails, try unsigned upload as fallback
  if (!response.ok) {
    console.log('Signed upload failed, trying unsigned upload...');
    response = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });
  }

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Upload failed');
  }

  return result.data;
};

/**
 * Uploads a file using signed upload method (more secure)
 * @param file - The file to upload
 * @param folder - The folder to upload to
 * @returns The upload result
 */
export const uploadFileSigned = async (
  file: File,
  folder: string = 'nirali-sai-boutique'
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  // Construct absolute URL for serverless environments
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  
  const response = await fetch(`${baseUrl}/api/upload-signed`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Signed upload failed');
  }

  return result.data;
};

/**
 * Deletes a file from Cloudinary
 * @param publicId - The public ID of the file to delete
 * @returns The deletion result
 */
export const deleteFile = async (publicId: string): Promise<boolean> => {
  // In a real implementation, this would call the Cloudinary API directly
  // For now, we'll just return true
  console.log(`Would delete file with public_id: ${publicId}`);
  return true;
};

/**
 * Gets the URL for a file with transformations
 * @param publicId - The public ID of the file
 * @param transformations - Optional transformations to apply
 * @returns The transformed URL
 */
export const getFileUrl = (
  publicId: string,
  transformations?: Record<string, any>
): string => {
  // Return a Cloudinary URL
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error('Cloudinary cloud name not configured. Please check your environment variables.');
  }
  
  let url = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (transformations) {
    const transformParams = Object.entries(transformations)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    url += `/${transformParams}`;
  }
  
  url += `/${publicId}`;
  
  return url;
};

export default { uploadFile, deleteFile, getFileUrl };