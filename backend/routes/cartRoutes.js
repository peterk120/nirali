const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
const cartController = require('../controllers/cartController');

// All cart routes require authentication
router.use(protect);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/', cartController.updateCartItem);
router.delete('/', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
