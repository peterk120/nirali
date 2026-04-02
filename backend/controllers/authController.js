const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { logActivity } = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'nirali-sai-boutique-secret-key-for-dev';
const JWT_EXPIRES_IN = '7d';

// Helper function to sign token
const signToken = (user, jti) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role, 
      jti 
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists in this store' });
    }

    const user = await User.create({ name, email, password, phone });

    // Auto-login after registration
    const jti = crypto.randomBytes(16).toString('hex');
    user.activeSessions.push(jti);
    await user.save();

    const token = signToken(user, jti);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'disabled') {
      return res.status(401).json({ success: false, message: 'Your account has been disabled. Please contact admin.' });
    }

    const jti = crypto.randomBytes(16).toString('hex');
    user.activeSessions.push(jti);
    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    await user.save();

    // Log login activity
    if (user.role === 'admin' || user.role === 'sales') {
      await logActivity(req.dbModels, user._id, 'login', `Staff logged in: ${user.email}`);
    }

    const token = signToken(user, jti);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout (current session)
exports.logout = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const { jti } = req.user; 
    const user = await User.findById(req.user.id);
    
    if (user) {
      user.activeSessions = user.activeSessions.filter(session => session !== jti);
      await user.save();
      
      // Log logout activity
      if (user.role === 'admin' || user.role === 'sales') {
        await logActivity(req.dbModels, user._id, 'logout', 'Staff logged out');
      }
    }

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout All
exports.logoutAll = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const user = await User.findById(req.user.id);
    if (user) {
      user.activeSessions = [];
      await user.save();
    }
    res.status(200).json({ success: true, message: 'Logged out from all devices' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Me
exports.me = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Update Me
exports.updateMe = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const { name, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Addresses
exports.getAddresses = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const user = await User.findById(req.user.id).select('addresses');
    res.status(200).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Address
exports.addAddress = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newAddress = req.body;
    
    // If it's default, unset others first
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ success: true, data: user.addresses, message: 'Address added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();

    res.status(200).json({ success: true, data: user.addresses, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
