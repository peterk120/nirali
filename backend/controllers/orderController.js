const crypto = require('crypto');
const { logActivity } = require('../utils/logger');

const createOrder = async (req, res) => {
  console.log('📦 LOG: Received Order Request:', JSON.stringify(req.body, null, 2));
  try {
    const Order = req.dbModels.Order;
    const User = req.dbModels.User;
    
    const { 
      items, 
      shippingAddress, 
      billingAddress, 
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      couponCode,
      notes
    } = req.body;

    const userId = req.user.id;

    // Generate unique order number
    const prefix = req.body.orderNumberPrefix || 'ORD';
    const timestamp = Date.now().toString().slice(-6);
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    const orderNumber = `${prefix}-${timestamp}-${random}`;

    const newOrder = await Order.create({
      userId,
      orderNumber,
      items: items.map(item => ({
        ...item,
        totalPrice: item.totalPrice || (item.unitPrice * item.quantity * (item.rentalDays || 1))
      })),
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      paymentMethod,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      couponCode,
      notes,
      status: 'pending',
      paymentStatus: 'pending',
      history: [{
        status: 'pending',
        timestamp: new Date(),
        message: 'Order received and is being processed',
        updatedBy: 'System'
      }]
    });

    // Clear the user's cart after successful order placement
    try {
      await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
      console.log(`🛒 Cart cleared for user ${userId} after order #${orderNumber}`);
    } catch (cartError) {
      console.warn(`⚠️ Failed to clear cart for user ${userId}:`, cartError.message);
    }

    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order created successfully',
      statusCode: 201
    });
  } catch (error) {
    console.error('❌ LOG: Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const Order = req.dbModels.Order;
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await Order.countDocuments({ userId });
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        data: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      },
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const Order = req.dbModels.Order;
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

    const query = {};

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
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        data: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      },
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const Order = req.dbModels.Order;
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const Order = req.dbModels.Order;
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

    // Log activity
    if (req.user && (req.user.role === 'admin' || req.user.role === 'sales')) {
      await logActivity(req.dbModels, req.user.id, 'update_order', `Updated order #${order.orderNumber} status to ${status}`, order._id);
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const Order = req.dbModels.Order;
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

const bulkUpdateStatus = async (req, res) => {
  try {
    const Order = req.dbModels.Order;
    const { orderIds, status, message, updatedBy } = req.body;

    const updateData = { status };
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

    // Log activity
    if (req.user && (req.user.role === 'admin' || req.user.role === 'sales')) {
      await logActivity(req.dbModels, req.user.id, 'update_order', `Bulk updated ${results.modifiedCount} orders to ${status}`);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  verifyPayment,
  bulkUpdateStatus
};
