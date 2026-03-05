export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

// POST /api/reviews - Submit a review/rating for a booked product
export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        // Authenticate user
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { orderId, rating, review } = body;

        // Validate input
        if (!orderId) {
            return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
        }

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ 
                success: false, 
                error: 'Rating must be between 1 and 5' 
            }, { status: 400 });
        }

        // Find the order
        const order = await Order.findById(orderId);
        
        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        // Verify user owns this order
        if (order.userId !== payload.id) {
            return NextResponse.json({ 
                success: false, 
                error: 'You can only review your own orders' 
            }, { status: 403 });
        }

        // Check if already reviewed
        if (order.isReviewed) {
            return NextResponse.json({ 
                success: false, 
                error: 'You have already reviewed this product' 
            }, { status: 400 });
        }

        // Check if order is completed or active (can only review after rental)
        const today = new Date();
        const rentalEndDate = new Date(order.rentalEndDate);
        
        if (rentalEndDate > today && order.status !== 'completed') {
            return NextResponse.json({ 
                success: false, 
                error: 'You can only review after the rental period ends' 
            }, { status: 400 });
        }

        // Update order with rating and review
        order.rating = rating;
        order.review = review ? String(review).substring(0, 500) : undefined;
        order.isReviewed = true;
        await order.save();

        // Update product ratings
        await updateProductRating(order.productId, rating);

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully',
            data: {
                orderId: order.orderId,
                rating: order.rating,
                review: order.review
            }
        });

    } catch (error: any) {
        console.error('Submit review error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to submit review',
            details: error.message 
        }, { status: 500 });
    }
}

// Helper function to update product average rating
async function updateProductRating(productId: string, newRating: number) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const product = await Product.findById(productId).session(session);
        
        if (!product) {
            await session.abortTransaction();
            return;
        }

        // Get all ratings for this product from orders
        const ordersWithRatings = await Order.find({ 
            productId: new mongoose.Types.ObjectId(productId),
            isReviewed: true,
            rating: { $exists: true }
        }).session(session);

        const totalRatings = ordersWithRatings.length;
        const sumRatings = ordersWithRatings.reduce((sum, order) => sum + (order.rating || 0), 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

        // Calculate rating distribution
        const distribution = {
            5: ordersWithRatings.filter(o => o.rating === 5).length,
            4: ordersWithRatings.filter(o => o.rating === 4).length,
            3: ordersWithRatings.filter(o => o.rating === 3).length,
            2: ordersWithRatings.filter(o => o.rating === 2).length,
            1: ordersWithRatings.filter(o => o.rating === 1).length,
        };

        // Update product
        product.averageRating = Math.round(averageRating * 10) / 10; // Round to 1 decimal
        product.totalReviews = totalRatings;
        product.ratingDistribution = distribution as any;
        await product.save({ session });

        await session.commitTransaction();
        
        console.log(`✅ Updated ratings for product ${product.name}:`, {
            averageRating: product.averageRating,
            totalReviews: product.totalReviews,
            distribution
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating product rating:', error);
    } finally {
        session.endSession();
    }
}

// GET /api/reviews?productId=xxx - Get all reviews for a product
export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ 
                success: false, 
                error: 'Product ID is required' 
            }, { status: 400 });
        }

        // Get all reviews for this product
        const reviews = await Order.find({
            productId: new mongoose.Types.ObjectId(productId),
            isReviewed: true,
            rating: { $exists: true }
        })
        .populate('userId', 'name email')
        .sort({ updatedAt: -1 })
        .limit(50);

        const formattedReviews = reviews.map(order => ({
            id: order._id,
            orderId: order.orderId,
            userId: (order.userId as any)?._id,
            userName: (order.userId as any)?.name || 'Anonymous',
            rating: order.rating,
            review: order.review,
            date: order.updatedAt,
            productName: order.productName
        }));

        return NextResponse.json({
            success: true,
            data: formattedReviews,
            count: formattedReviews.length
        });

    } catch (error: any) {
        console.error('Get reviews error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch reviews',
            details: error.message 
        }, { status: 500 });
    }
}
