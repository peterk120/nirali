import express from 'express';
import { 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus, 
  bulkUpdateStatus,
  verifyPayment
} from '../controllers/orderController';

const router = express.Router();

// Admin routes
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/verify-payment', verifyPayment);
router.post('/bulk-status', bulkUpdateStatus);

export default router;
