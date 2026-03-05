export const dynamic = 'force-dynamic';
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
      
      if (file) {
        const uploadResult = await uploadFile(file, 'nirali-sai-boutique/products');
        imagePublicId = uploadResult.public_id;
        imageUrl = uploadResult.secure_url;
      }
      
      productData = {};
      formData.forEach((value, key) => {
        if (key !== 'image') {
          // Parse and validate fields from FormData
          if (key === 'price' || key === 'stock') {
            const numValue = parseFloat(value as string);
            if (!isNaN(numValue) && numValue >= 0) {
              productData[key] = numValue;
            }
          } else if (key === 'name' || key === 'category' || key === 'description') {
            // Sanitize string fields
            const strValue = (value as string).trim();
            if (strValue) {
              productData[key] = strValue;
            }
          } else if (typeof value === 'string') {
            productData[key] = value.trim();
          }
        }
      });
    } else {
      // Handle JSON update
      productData = await request.json();
      
      // Validate and sanitize JSON data
      if (productData.name) {
        productData.name = productData.name.trim().substring(0, 100);
      }
      if (productData.category) {
        productData.category = productData.category.trim().substring(0, 50);
      }
      if (productData.description) {
        productData.description = productData.description.trim().substring(0, 1000);
      }
      if (typeof productData.price === 'number' && productData.price >= 0) {
        // Price validated
      } else {
        delete productData.price;
      }
      if (typeof productData.stock === 'number' && productData.stock >= 0) {
        // Stock validated
      } else {
        delete productData.stock;
      }
    }
    
    // Remove any fields that shouldn't be updated
    const allowedFields = ['name', 'price', 'category', 'brand', 'color', 'size', 'description', 'stock', 'status', 'tags', 'storeType', 'attributes', 'seoMeta'];
    const updateData: any = {};
    allowedFields.forEach(field => {
      if (productData[field] !== undefined) {
        updateData[field] = productData[field];
      }
    });
    
    if (imageUrl) {
      updateData.image = imageUrl;
      updateData.cloudinary_public_id = imagePublicId;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return Response.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: updatedProduct
    });
  } catch (error: any) {
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
    
    // Check if product is in any active user carts
    const User = (await import('@/models/User')).default;
    const usersWithProductInCart = await User.find({ 'cart.productId': id });
    
    if (usersWithProductInCart.length > 0) {
      return Response.json(
        { 
          success: false, 
          error: `Cannot delete product. It is in ${usersWithProductInCart.length} user cart(s). Please remove from carts first.` 
        },
        { status: 400 }
      );
    }
    
    // Check if product has active orders
    const Order = (await import('@/models/Order')).default;
    const activeOrders = await Order.countDocuments({ productId: id });
    
    if (activeOrders > 0) {
      return Response.json(
        { 
          success: false, 
          error: `Cannot delete product. It has ${activeOrders} associated order(s). Consider marking as discontinued instead.` 
        },
        { status: 400 }
      );
    }
    
    // Delete associated Cloudinary image if public_id exists
    if (product.cloudinary_public_id) {
      await deleteFile(product.cloudinary_public_id);
    }
    
    await Product.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return Response.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
