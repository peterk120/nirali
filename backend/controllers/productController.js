const { logActivity } = require('../utils/logger');

// Get all products (with optional filtering)
const getProducts = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const { brand, category, search, limit } = req.query;
    
    let query = {};
    if (category) {
      // Case-insensitive matching + basic plural/singular support
      const singular = category.toLowerCase().replace(/s$/, '');
      query.category = { $regex: new RegExp(`^${singular}s?$`, 'i') };
    }
    if (brand) query.brand = brand;
    
    if (search) {
      // Fuzzy-ish search using regex on name and category
      const searchRegex = new RegExp(search.split('').join('.*'), 'i'); // Very basic fuzzy
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      
      // Fallback for misspellings like "bangels" -> "bangles"
      if (search.toLowerCase().includes('bangel')) {
        query.$or.push({ category: /bangle/i });
      }
    }

    const limitNum = limit ? parseInt(limit, 10) : 0;
    const productsQuery = Product.find(query).sort({ createdAt: -1 });

    if (limitNum > 0) {
      productsQuery.limit(limitNum);
    }

    const products = await productsQuery;

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
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
    
    // Find matching categories and product names
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

// Create product
const createProduct = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const product = await Product.create(req.body);
    
    // Log activity
    if (req.user && (req.user.role === 'admin' || req.user.role === 'sales')) {
      await logActivity(req.dbModels, req.user.id, 'add_product', `Added new product: ${product.name}`, product._id);
    }

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const Product = req.dbModels.Product;
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
