const express = require('express');
const multer = require('multer');
const { 
  getBulkUploadTemplate, 
  handleBulkUpload,
  createStaff,
  getStaff,
  toggleStaffStatus,
  updateStaff,
  deleteStaff,
  getDashboardStats,
  getActivityLogs,
  getStaffPerformance
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin routes (General Admin/Sales)
router.get('/bulk-upload', protect, authorize('admin', 'sales'), getBulkUploadTemplate);
router.post('/bulk-upload', protect, authorize('admin', 'sales'), upload.fields([
  { name: 'csvFile', maxCount: 1 },
  { name: 'zipFile', maxCount: 1 }
]), handleBulkUpload);

// Staff management (Admin only)
router.post('/staff', protect, authorize('admin'), createStaff);
router.get('/staff', protect, authorize('admin'), getStaff);
router.patch('/staff/:id/status', protect, authorize('admin'), toggleStaffStatus);
router.put('/staff/:id', protect, authorize('admin'), updateStaff);
router.delete('/staff/:id', protect, authorize('admin'), deleteStaff);
router.get('/dashboard-stats', protect, authorize('admin', 'sales'), getDashboardStats);
router.get('/activity-logs', protect, authorize('admin'), getActivityLogs);
router.get('/staff-performance', protect, authorize('admin'), getStaffPerformance);

module.exports = router;
