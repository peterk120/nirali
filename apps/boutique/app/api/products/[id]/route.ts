import { NextRequest } from 'next/server';
import { uploadFile, deleteFile } from '../../../../lib/cloudinary';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    await connectToDatabase();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
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
      if (file && file.size > 0) {
        const uploadResult = await uploadFile(file);
        imagePublicId = uploadResult.public_id;
        imageUrl = uploadResult.secure_url;
      }
    } else {
      // Handle JSON request
      const body = await request.json();
      productData = typeof body.product === 'string' ? JSON.parse(body.product) : body;
      // For JSON requests, we expect the image URL to be provided directly
      imageUrl = productData.image;
    }

    // Find the product to update
    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // If we're updating the image, delete the old one from Cloudinary if it exists
    if (imageUrl && product.cloudinary_public_id) {
      try {
        await deleteFile(product.cloudinary_public_id);
      } catch (deleteError) {
        console.error('Error deleting old image from Cloudinary:', deleteError);
        // Continue anyway, as the update should still proceed
      }
    }

    // Update the product
    Object.assign(product, productData);
    if (imageUrl) product.image = imageUrl;
    if (imagePublicId) product.cloudinary_public_id = imagePublicId;
    if (productData.price) product.price = Number(productData.price);
    if (productData.stock) product.stock = Number(productData.stock);
    product.status = product.stock > 0 ? 'Active' : 'Out of Stock';
    
    await product.save();

    return Response.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    await connectToDatabase();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete the image from Cloudinary if it exists
    if (product.cloudinary_public_id) {
      try {
        await deleteFile(product.cloudinary_public_id);
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
        // Continue with deletion anyway
      }
    }

    // Remove the product
    await Product.findByIdAndDelete(id);

    return Response.json({
      success: true,
      data: product,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}