const express = require('express');
const { 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus, 
  bulkUpdateStatus,
  verifyPayment,
  createOrder,
  getMyOrders
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes
router.get('/', protect, getAllOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, updateOrderStatus);
router.patch('/:id/verify-payment', protect, verifyPayment);
router.post('/bulk-status', protect, bulkUpdateStatus);

module.exports = router;
