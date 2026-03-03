export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/Product';

// Upload a file directly to Cloudinary (signed upload) — avoids unreliable self-HTTP-calls
async function uploadToCloudinary(file: File, folder = 'nirali-sai-boutique'): Promise<{ secure_url: string; public_id: string }> {
  // Resolve credentials
  let apiKey: string, apiSecret: string, cloudName: string;
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

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const blob = new Blob([buffer], { type: file.type });

  const form = new FormData();
  form.append('file', blob, file.name);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Cloudinary upload error:', errText);
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const data = await res.json();
  return { secure_url: data.secure_url, public_id: data.public_id };
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get search params
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build query
    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Fetch products from MongoDB
    const limitQuery = searchParams.get('limit');
    const limit = limitQuery ? parseInt(limitQuery, 10) : 0;

    // Sort logic already has `{ createdAt: -1 }` to handle the 'latest first' rule naturally, meaning no backend change needed for auto-update logic!
    const productsQuery = Product.find(query).sort({ createdAt: -1 });

    if (limit > 0) {
      productsQuery.limit(limit);
    }

    const products = await productsQuery;

    return Response.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check if this is a multipart form data request (file upload)
    const contentType = request.headers.get('content-type');

    let productData: any;
    let imagePublicId: string | undefined;
    let imageUrl: string | undefined;

    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      console.log('FormData keys:', Array.from(formData.keys()));
      const file = formData.get('image') as File | null;
      const productInfo = formData.get('product') as string;

      if (productInfo) {
        productData = JSON.parse(productInfo);
        console.log('Parsed productData from JSON:', productData);
        // Ensure brand and storeType are set from parsed JSON
        if (!productData.brand) productData.brand = 'boutique';
        if (!productData.storeType) productData.storeType = 'boutique';
      } else {
        // If product info wasn't sent as JSON string, extract from form fields
        productData = {
          name: formData.get('name') as string,
          category: formData.get('category') as string,
          price: formData.get('price') as string,
          color: formData.get('color') as string,
          size: formData.get('size') as string,
          description: formData.get('description') as string,
          stock: formData.get('stock') as string,
          brand: formData.get('brand') as string || 'boutique',
          storeType: formData.get('storeType') as string || 'boutique',
        };
        console.log('Extracted productData from form fields:', productData);
      }

      // Final safety check - ensure brand and storeType are always set
      if (!productData.brand) {
        productData.brand = 'boutique';
      }
      if (!productData.storeType) {
        productData.storeType = 'boutique';
      }

      console.log('Final productData before upload:', productData);

      // Process image upload if provided
      console.log('File received:', {
        fileExists: !!file,
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type
      });

      if (file && file.size > 0) {
        try {
          console.log('Attempting to upload file directly to Cloudinary...');
          const uploadResult = await uploadToCloudinary(file);
          console.log('Upload result:', uploadResult);
          imagePublicId = uploadResult.public_id;
          imageUrl = uploadResult.secure_url;
          console.log('Image URL set to:', imageUrl);
        } catch (error) {
          console.error('Upload failed:', error);
          // Fall back to default image
          imageUrl = '/images/default-product.png';
        }
      } else {
        console.log('No valid file provided, using default image');
        imageUrl = '/images/default-product.png';
      }
    } else {
      // Handle JSON request
      const body = await request.json();
      productData = typeof body.product === 'string' ? JSON.parse(body.product) : body;
      // For JSON requests, we expect the image URL to be provided directly
      imageUrl = productData.image || '/images/default-product.png';
    }

    // Validate required fields
    if (!productData.name || !productData.category || !productData.price) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new product in MongoDB
    const newProduct = new Product({
      name: productData.name,
      price: Number(productData.price),
      category: productData.category,
      color: productData.color,
      size: productData.size,
      image: imageUrl,
      cloudinary_public_id: imagePublicId,
      description: productData.description,
      stock: Number(productData.stock) || 0,
      brand: productData.brand || 'boutique',
      storeType: productData.storeType || 'boutique',
      status: Number(productData.stock) > 0 ? 'Active' : 'Out of Stock'
    });

    await newProduct.save();

    return Response.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}