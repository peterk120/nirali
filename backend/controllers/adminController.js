const { getCSVTemplate, getAllowedStoreTypes } = require('../utils/csv-templates');
const { FileParser } = require('../utils/csv-parser');
const { uploadToCloudinary } = require('../utils/cloudinary');
const JSZip = require('jszip');
const XLSX = require('xlsx');
const { logActivity } = require('../utils/logger');

// GET /api/admin/bulk-upload
const getBulkUploadTemplate = async (req, res) => {
  try {
    const { storeType, format } = req.query;

    if (!storeType) {
      return res.status(400).json({ success: false, message: 'Store type is required' });
    }

    if (!getAllowedStoreTypes().includes(storeType)) {
      return res.status(400).json({ success: false, message: `Invalid store type. Allowed: ${getAllowedStoreTypes().join(', ')}` });
    }

    const template = getCSVTemplate(storeType);
    const fileName = format === 'xlsx' 
      ? template.fileName.replace('.csv', '.xlsx')
      : template.fileName;

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      const wsData = [template.headers];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Template');
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.send(buffer);
    }

    const csvContent = template.headers.join(',') + '\n';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(csvContent);

  } catch (error) {
    console.error('Template download error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate template' });
  }
};

// POST /api/admin/bulk-upload
const handleBulkUpload = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const { storeType } = req.body;
    const csvFile = req.files['csvFile']?.[0];
    const zipFile = req.files['zipFile']?.[0];

    if (!storeType || !csvFile || !zipFile) {
      return res.status(400).json({ success: false, message: 'Missing required data (storeType, csvFile, zipFile)' });
    }

    // 1. Parse Data File
    console.log(`[BULK UPLOAD] Parsing ${csvFile.originalname} for ${storeType}...`);
    const parseResult = FileParser.parse(storeType, csvFile.buffer, csvFile.originalname);
    if (parseResult.errors.length > 0) {
      console.error(`[BULK UPLOAD] Parse errors:`, parseResult.errors);
      return res.status(400).json({ success: false, message: 'Data validation failed', errors: parseResult.errors });
    }
    console.log(`[BULK UPLOAD] Found ${parseResult.products.length} products to process.`);

    // 2. Extract ZIP
    console.log(`[BULK UPLOAD] Extracting ZIP: ${zipFile.originalname}...`);
    const imageFiles = new Map();
    const zip = new JSZip();
    let zipContent;
    try {
      zipContent = await zip.loadAsync(zipFile.buffer);
      console.log(`[BULK UPLOAD] ZIP loaded. Files inside:`, Object.keys(zipContent.files));
    } catch (zipErr) {
      console.error(`[BULK UPLOAD] ZIP load failed:`, zipErr);
      return res.status(400).json({ success: false, message: 'Failed to load ZIP file' });
    }
    
    for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
      if (!zipEntry.dir) {
        const fileName = relativePath.split('/').pop() || relativePath;
        const fileContent = await zipEntry.async('nodebuffer');
        imageFiles.set(fileName, fileContent);
      }
    }
    console.log(`[BULK UPLOAD] Extracted ${imageFiles.size} images from ZIP.`);

    // 3. Process Products
    const results = {
      successful: 0,
      failed: 0,
      errors: []
    };

    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif'
    };

    for (const productData of parseResult.products) {
      try {
        console.log(`[BULK UPLOAD] Processing: ${productData.productName}...`);
        
        let imageFileName = productData.imageName;
        let imageBuffer = null;
        let mimeType = 'image/jpeg';

        // 1. Try Exact Match
        if (imageFiles.has(imageFileName)) {
          imageBuffer = imageFiles.get(imageFileName);
        } 
        // 2. Try match without extension (case-insensitive)
        else {
          const zipFileNames = Array.from(imageFiles.keys());
          const match = zipFileNames.find(f => {
            const nameWithoutExt = f.substring(0, f.lastIndexOf('.')) || f;
            return nameWithoutExt.toLowerCase() === imageFileName.toLowerCase();
          });
          
          if (match) {
            imageFileName = match;
            imageBuffer = imageFiles.get(match);
            console.log(`[BULK UPLOAD] Found fuzzy match: ${imageFileName} for ${productData.imageName}`);
          }
        }

        if (!imageBuffer) {
          console.warn(`[BULK UPLOAD] Warning: ${imageFileName} (or similar) not found in ZIP.`);
          results.failed++;
          results.errors.push(`Image "${imageFileName}" not found in ZIP for product "${productData.productName}"`);
          continue;
        }

        const ext = imageFileName.toLowerCase().slice(imageFileName.lastIndexOf('.'));
        mimeType = mimeTypes[ext] || 'image/jpeg';

        // Upload to Cloudinary
        console.log(`[BULK UPLOAD] Uploading ${imageFileName} to Cloudinary...`);
        const uploadResult = await uploadToCloudinary(imageBuffer, imageFileName, mimeType, `nirali-sai-${storeType}`);
        console.log(`[BULK UPLOAD] Upload SUCCESS: ${uploadResult.secure_url}`);

        // Save to DB
        const newProduct = new Product({
          name: productData.productName,
          description: productData.description,
          category: productData.category,
          price: productData.price,
          stock: productData.stock,
          image: uploadResult.secure_url,
          cloudinary_public_id: uploadResult.public_id,
          brand: storeType,
          status: 'Active',
          storeType: storeType,
          attributes: productData.attributes
        });

        await newProduct.save();
        results.successful++;
        console.log(`[BULK UPLOAD] Created product: ${productData.productName}`);
      } catch (err) {
        console.error(`[BULK UPLOAD] ERROR processing ${productData.productName}:`, err.message);
        results.failed++;
        results.errors.push(`Failed to process "${productData.productName}": ${err.message}`);
      }
    }

    console.log(`[BULK UPLOAD] DONE. Successful: ${results.successful}, Failed: ${results.failed}`);
    res.status(200).json({
      success: true,
      message: 'Bulk upload completed',
      results
    });

  } catch (error) {
    console.error('Bulk upload fatal error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during bulk upload' });
  }
};

// @desc    Create a new staff account (Admin only)
const createStaff = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists in this database' });
    }

    const staff = await User.create({
      name,
      email,
      password,
      phone,
      role: 'sales',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Staff account created successfully',
      data: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        status: staff.status
      }
    });

    // Log activity
    await logActivity(req.dbModels, req.user.id, 'staff_created', `Created staff account: ${staff.email}`, staff._id);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all staff accounts (Admin only)
const getStaff = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const staff = await User.find({ role: 'sales' }).select('-password');
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle staff status (Admin only)
const toggleStaffStatus = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const staff = await User.findById(req.params.id);
    if (!staff || staff.role !== 'sales') {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }
    staff.status = staff.status === 'active' ? 'inactive' : 'active';
    await staff.save();
    res.status(200).json({
      success: true,
      message: `Staff account ${staff.status === 'active' ? 'activated' : 'disabled'} successfully`,
      data: staff
    });

    // Log activity
    await logActivity(req.dbModels, req.user.id, 'staff_status_toggled', `${staff.status === 'active' ? 'Activated' : 'Disabled'} staff: ${staff.email}`, staff._id);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const Order = req.dbModels.Order;
    const Subscriber = req.dbModels.Subscriber;
    
    const brand = req.query.brand || req.dbName.includes('sashti') ? 'sashtik' : 'boutique';
    
    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      totalSubscribers
    ] = await Promise.all([
      Product.countDocuments({}), 
      Order.countDocuments({}), 
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).then(result => result[0]?.total || 0),
      Subscriber.countDocuments({ status: 'active' })
    ]);

    // Get recent activity
    const recentProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name price stock status createdAt');

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber total status createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          products: totalProducts,
          orders: totalOrders,
          revenue: totalRevenue,
          subscribers: totalSubscribers
        },
        recentProducts,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update staff account (Admin only)
const updateStaff = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const { name, email, role, status, phone } = req.body;
    const staff = await User.findById(req.params.id);

    if (!staff || staff.role === 'user') {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    staff.name = name || staff.name;
    staff.email = email || staff.email;
    staff.role = role || staff.role;
    staff.status = status || staff.status;
    staff.phone = phone !== undefined ? phone : staff.phone;

    await staff.save();

    res.status(200).json({
      success: true,
      message: 'Staff account updated successfully',
      data: staff
    });

    // Log activity
    await logActivity(req.dbModels, req.user.id, 'staff_updated', `Updated staff info: ${staff.email}`, staff._id);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete staff account (Admin only)
const deleteStaff = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const staff = await User.findById(req.params.id);
    if (!staff || staff.role === 'user') {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    const staffEmail = staff.email;
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Staff account deleted permanently'
    });

    // Log activity
    await logActivity(req.dbModels, req.user.id, 'delete_product', `Deleted staff account: ${staffEmail}`, req.params.id);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get activity logs
const getActivityLogs = async (req, res) => {
  try {
    const ActivityLog = req.dbModels.ActivityLog;
    const { staffId, action, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (staffId) query.userId = staffId;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const logs = await ActivityLog.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get staff performance summary
const getStaffPerformance = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const ActivityLog = req.dbModels.ActivityLog;
    const staffList = await User.find({ role: 'sales' }).select('name email status lastLoginAt lastActiveAt');
    
    const performanceData = await Promise.all(staffList.map(async (staff) => {
      const [productsCount, ordersCount] = await Promise.all([
        ActivityLog.countDocuments({ userId: staff._id, action: 'add_product' }),
        ActivityLog.countDocuments({ userId: staff._id, action: 'update_order' })
      ]);

      return {
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        status: staff.status,
        lastLoginAt: staff.lastLoginAt,
        lastActiveAt: staff.lastActiveAt,
        productsCount,
        ordersCount
      };
    }));

    res.status(200).json({
      success: true,
      data: performanceData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBulkUploadTemplate,
  handleBulkUpload,
  createStaff,
  getStaff,
  toggleStaffStatus,
  getDashboardStats,
  updateStaff,
  deleteStaff,
  getActivityLogs,
  getStaffPerformance
};
