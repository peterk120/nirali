const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

/**
 * Log a staff activity
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Action type (login, logout, add_product, etc.)
 * @param {string} details - Human-readable description
 * @param {string} targetId - Optional ID of the affected object
 * @param {object} metadata - Optional extra data
 */
const logActivity = async (userId, action, details, targetId = null, metadata = {}) => {
  try {
    // 1. Create log entry
    await ActivityLog.create({
      userId,
      action,
      details,
      targetId,
      metadata
    });

    // 2. Update user's last active timestamp
    await User.findByIdAndUpdate(userId, {
      lastActiveAt: new Date()
    });

    console.log(`[ACTIVITY LOG] ${action} by ${userId}: ${details}`);
  } catch (error) {
    console.error(`[ACTIVITY LOG ERROR]`, error);
  }
};

module.exports = { logActivity };
