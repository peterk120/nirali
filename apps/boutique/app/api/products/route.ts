import { NextRequest } from 'next/server';
import { uploadFile } from '../../../lib/cloudinary';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/Product';

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
    const products = await Product.find(query).sort({ createdAt: -1 });

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
        };
      }
      
      // Process image upload if provided
      console.log('File received:', { 
        fileExists: !!file, 
        fileName: file?.name, 
        fileSize: file?.size, 
        fileType: file?.type 
      });
      
      if (file && file.size > 0) {
        try {
          console.log('Attempting to upload file...');
          const uploadResult = await uploadFile(file);
          console.log('Upload result:', uploadResult);
          imagePublicId = uploadResult.public_id;
          imageUrl = uploadResult.secure_url;
        } catch (error) {
          console.error('Upload failed:', error);
          // Fall back to default image
          imageUrl = 'https://res.cloudinary.com/dxkqm1ifi/image/upload/v1707123456/nirali-sai-boutique/default-product.jpg';
        }
      } else {
        console.log('No valid file provided, using default image');
        imageUrl = 'https://res.cloudinary.com/dxkqm1ifi/image/upload/v1707123456/nirali-sai-boutique/default-product.jpg';
      }
    } else {
      // Handle JSON request
      const body = await request.json();
      productData = typeof body.product === 'string' ? JSON.parse(body.product) : body;
      // For JSON requests, we expect the image URL to be provided directly
      imageUrl = productData.image || 'https://res.cloudinary.com/dxkqm1ifi/image/upload/v1707123456/nirali-sai-boutique/default-product.jpg';
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