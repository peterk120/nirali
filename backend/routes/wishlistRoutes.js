const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/', wishlistController.removeFromWishlist);

module.exports = router;
