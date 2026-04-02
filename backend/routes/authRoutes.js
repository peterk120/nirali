const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.me);
router.put('/me', protect, authController.updateMe);
router.get('/addresses', protect, authController.getAddresses);
router.post('/addresses', protect, authController.addAddress);
router.delete('/addresses/:id', protect, authController.deleteAddress);
router.post('/logout', protect, authController.logout);
router.post('/logout-all', protect, authController.logoutAll);

module.exports = router;
