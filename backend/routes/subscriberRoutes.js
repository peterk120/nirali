const express = require('express');
const router = express.Router();
const { 
  subscribe, 
  getSubscribers, 
  unsubscribe, 
  deleteSubscriber, 
  sendBulkEmail,
  toggleStatus 
} = require('../controllers/subscriberController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public route
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin route
router.get('/', protect, authorize('admin'), getSubscribers);
router.delete('/:id', protect, authorize('admin'), deleteSubscriber);
router.patch('/:id/status', protect, authorize('admin'), toggleStatus);
router.post('/send-email', protect, authorize('admin'), sendBulkEmail);

module.exports = router;
