import { Request, Response } from 'express';
import Order from '../models/Order';
import { ApiResponse, PaginatedResponse, Order as IOrderType } from '@nirali-sai/types';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      paymentStatus, 
      paymentMethod,
      search,
      startDate,
      endDate
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalItems = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalItems / Number(limit));

    const response: ApiResponse<PaginatedResponse<any>> = {
      success: true,
      data: {
        data: orders,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems,
          itemsPerPage: Number(limit),
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      },
      statusCode: 200
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        statusCode: 404
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      statusCode: 200
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, message, updatedBy } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        statusCode: 404
      });
    }

    order.status = status;
    
    // Add history entry
    order.history.push({
      status,
      timestamp: new Date(),
      message: message || `Status updated to ${status}`,
      updatedBy: updatedBy || 'Admin'
    });

    if (status === 'shipped') {
      order.shippedAt = new Date();
    } else if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    // In a real app, you would emit a socket event or send an email/notification here
    
    res.status(200).json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
      statusCode: 200
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { transactionId, proofUrl, verifiedBy } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        statusCode: 404
      });
    }

    order.paymentStatus = 'paid';
    order.paymentDetails = {
      transactionId,
      proofUrl,
      verifiedAt: new Date(),
      verifiedBy: verifiedBy || 'Admin'
    };

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: 'Payment verified successfully',
      statusCode: 200
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

export const bulkUpdateStatus = async (req: Request, res: Response) => {
  try {
    const { orderIds, status, message, updatedBy } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order IDs',
        statusCode: 400
      });
    }

    const updateData: any = { status };
    if (status === 'shipped') updateData.shippedAt = new Date();
    if (status === 'delivered') updateData.deliveredAt = new Date();

    const results = await Order.updateMany(
      { _id: { $in: orderIds } },
      { 
        $set: updateData,
        $push: { 
          history: { 
            status, 
            timestamp: new Date(), 
            message: message || `Bulk status update to ${status}`,
            updatedBy: updatedBy || 'Admin'
          } 
        } 
      }
    );

    res.status(200).json({
      success: true,
      data: results,
      message: `${results.modifiedCount} orders updated successfully`,
      statusCode: 200
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};
