export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Order from '../../../../models/Order';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get date range for comparison (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Fetch stats from database
    const [
      totalProducts,
      totalOrders,
      totalOrdersLastMonth,
      totalRevenue,
      totalRevenueLastMonth
    ] = await Promise.all([
      // Total products
      Product.countDocuments({}),
      
      // Total orders
      Order.countDocuments({}),
      
      // Total orders from last 30 days
      Order.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      }),
      
      // Total revenue
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Total revenue from last 30 days
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(result => result[0]?.total || 0)
    ]);
    
    // Calculate percentage changes
    const ordersGrowth = totalOrdersLastMonth > 0 
      ? ((totalOrders - totalOrdersLastMonth) / totalOrdersLastMonth) * 100
      : totalOrders > 0 ? 100 : 0;
    
    const revenueGrowth = totalRevenueLastMonth > 0 
      ? ((totalRevenue - totalRevenueLastMonth) / totalRevenueLastMonth) * 100
      : totalRevenue > 0 ? 100 : 0;
    
    // Get recent orders for the activity section
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .select('orderId email totalAmount createdAt status')
      .lean();
    
    // Get recent products for the activity section
    const recentProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .select('name price stock status category createdAt')
      .lean();
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalBookings: totalOrders,
          totalSupportTickets: 15, // This would come from a support tickets collection
          revenue: totalRevenue,
          ordersGrowth: parseFloat(ordersGrowth.toFixed(1)),
          revenueGrowth: parseFloat(revenueGrowth.toFixed(1))
        },
        recentBookings: recentOrders.map(order => ({
          id: order._id,
          orderId: order.orderId,
          customer: order.email,
          amount: order.totalAmount,
          date: new Date(order.createdAt).toISOString().split('T')[0],
          status: order.status
        })),
        recentProducts: recentProducts.map(product => ({
          id: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          status: product.status,
          category: product.category,
          date: new Date(product.createdAt).toISOString().split('T')[0]
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard stats',
        details: error.message 
      },
      { status: 500 }
    );
  }
}