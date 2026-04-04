const { logActivity } = require('../utils/logger');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Get all products (with optional filtering)
const getProducts = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const { brand, category, search, limit } = req.query;
    
    const pageNum = parseInt(req.query.page, 10) || 1;
    const limitNum = parseInt(req.query.limit, 10) || 20;
    const skipNum = (pageNum - 1) * limitNum;

    // Build query
    let queryObj = {};
    if (category) {
      const singular = category.toLowerCase().replace(/s$/, '');
      queryObj.category = { $regex: new RegExp(`^${singular}s?$`, 'i') };
    }
    if (brand) queryObj.brand = brand;
    
    if (search) {
      // Use text search for performance and relevance
      queryObj.$text = { $search: search };
    }

    // Default fields for listing views to reduce payload size
    const selectFields = 'name price originalPrice image slug category brand stock status averageRating totalReviews';

    const [products, totalCount] = await Promise.all([
      Product.find(queryObj)
        .select(selectFields)
        .sort({ createdAt: -1 })
        .skip(skipNum)
        .limit(limitNum),
      Product.countDocuments(queryObj)
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get search suggestions
const getSuggestions = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const { q } = req.query;
    if (!q) return res.status(200).json({ success: true, data: [] });

    const regex = new RegExp(q, 'i');
    
    const [categories, names] = await Promise.all([
      Product.distinct('category', { category: regex }),
      Product.find({ name: regex }).limit(5).select('name _id category')
    ]);

    const suggestions = [
      ...categories.map(c => ({ type: 'category', text: c })),
      ...names.map(n => ({ type: 'product', text: n.name, id: n._id, category: n.category }))
    ];

    res.status(200).json({
      success: true,
      data: suggestions.slice(0, 8)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: Parse product data from req.body (handles JSON string from FormData)
const parseProductData = (req) => {
  if (req.body.product) {
    try {
      return JSON.parse(req.body.product);
    } catch (e) {
      throw new Error('Invalid product data format');
    }
  }
  return req.body;
};

// Create product
const createProduct = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const productData = parseProductData(req);

    // Handle image upload if present
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer, 
        req.file.originalname, 
        req.file.mimetype,
        'products'
      );
      productData.image = uploadResult.secure_url;
      productData.cloudinary_public_id = uploadResult.public_id;
    }

    const product = await Product.create(productData);
    
    // Log activity
    if (req.user && (req.user.role === 'admin' || req.user.role === 'sales')) {
      await logActivity(req.dbModels, req.user.id, 'add_product', `Added new product: ${product.name}`, product._id);
    }

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const productData = parseProductData(req);

    // Handle image upload if present
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer, 
        req.file.originalname, 
        req.file.mimetype,
        'products'
      );
      productData.image = uploadResult.secure_url;
      productData.cloudinary_public_id = uploadResult.public_id;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Log activity
    if (req.user && (req.user.role === 'admin' || req.user.role === 'sales')) {
      await logActivity(req.dbModels, req.user.id, 'update_product', `Updated product: ${product.name}`, product._id);
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Log activity
    if (req.user && (req.user.role === 'admin' || req.user.role === 'sales')) {
      await logActivity(req.dbModels, req.user.id, 'delete_product', `Deleted product: ${product.name}`, product._id);
    }

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getSuggestions,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
