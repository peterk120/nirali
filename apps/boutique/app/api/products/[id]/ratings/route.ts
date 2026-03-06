import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import Product from '../../../../../models/Product';
import Review from '../../../../../models/Review';
import mongoose from 'mongoose';

// GET /api/products/[id]/ratings
// Returns average rating and review count for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const productId = params.id;

    if (!productId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid product ID' 
      }, { status: 400 });
    }

    // Get product with rating info
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    // Calculate actual rating from Reviews collection (scalable approach)
    const reviews = await Review.find({
      productId: new mongoose.Types.ObjectId(productId),
      rating: { $exists: true, $gte: 1 }
    });

    let averageRating = 0;
    let totalReviews = 0;

    // If we have reviews, calculate average
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
      averageRating = sum / reviews.length;
      totalReviews = reviews.length;
    } else {
      // Fallback to product's stored rating (for backwards compatibility)
      averageRating = product.averageRating || 0;
      totalReviews = product.totalReviews || 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: totalReviews,
        distribution: product.ratingDistribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching product ratings:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch ratings' 
    }, { status: 500 });
  }
}
