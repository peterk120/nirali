const crypto = require('crypto');
const axios = require('axios'); // We might need axios for server-side fetch if not using node 18+

/**
 * Upload a buffer to Cloudinary using signed upload
 * @param {Buffer} buffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File mime type
 * @param {string} folder - Cloudinary folder
 */
async function uploadToCloudinary(buffer, fileName, mimeType, folder = 'nirali-sai-boutique') {
  let apiKey, apiSecret, cloudName;
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  if (cloudinaryUrl) {
    const match = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
    if (!match) throw new Error('Invalid CLOUDINARY_URL format');
    [, apiKey, apiSecret, cloudName] = match;
  } else {
    apiKey = process.env.CLOUDINARY_API_KEY || '';
    apiSecret = process.env.CLOUDINARY_API_SECRET || '';
    cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    if (!apiKey || !apiSecret || !cloudName)
      throw new Error('Cloudinary credentials missing in environment variables');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  // Use Form-Data for the upload
  const FormData = require('form-data');
  const form = new FormData();
  form.append('file', buffer, { filename: fileName, contentType: mimeType });
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      form,
      { headers: { ...form.getHeaders() } }
    );
    return {
      secure_url: response.data.secure_url,
      public_id: response.data.public_id
    };
  } catch (error) {
    const errText = error.response ? JSON.stringify(error.response.data) : error.message;
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }
}

module.exports = { uploadToCloudinary };
