const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nirali-sai-boutique-secret-key-for-dev';

exports.protect = async (req, res, next) => {
  try {
    const User = req.dbModels.User; // Use tenant-specific model
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user and check if session is still active
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists in this database' });
    }

    // Check if user status is active
    if (user.status === 'disabled') {
      return res.status(401).json({ success: false, message: 'Your account has been disabled. Please contact admin.' });
    }

    // MULTI-SESSION CHECK: Verify JTI is in activeSessions array
    if (!user.activeSessions.includes(decoded.jti)) {
      return res.status(401).json({ success: false, message: 'Session expired or logged out' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }
    next();
  };
};

// Shorthand middlewares
exports.verifyUser = [exports.protect, exports.authorize('user')];
exports.verifyAdmin = [exports.protect, exports.authorize('admin')];
exports.verifySalesOrAdmin = [exports.protect, exports.authorize('sales', 'admin')];
