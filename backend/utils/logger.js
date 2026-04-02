// Static imports removed for multitenancy

/**
 * Log a staff activity
 * @param {object} dbModels - Initialized models for the tenant
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Action type (login, logout, add_product, etc.)
 * @param {string} details - Human-readable description
 * @param {string} targetId - Optional ID of the affected object
 * @param {object} metadata - Optional extra data
 */
const logActivity = async (dbModels, userId, action, details, targetId = null, metadata = {}) => {
  try {
    if (!dbModels || !dbModels.ActivityLog || !dbModels.User) {
      console.warn(`[ACTIVITY LOG WARNING] Missing models for ${action}`);
      return;
    }

    // 1. Create log entry
    await dbModels.ActivityLog.create({
      userId,
      action,
      details,
      targetId,
      metadata
    });

    // 2. Update user's last active timestamp
    await dbModels.User.findByIdAndUpdate(userId, {
      lastActiveAt: new Date()
    });

    console.log(`[ACTIVITY LOG] ${action} by ${userId}: ${details}`);
  } catch (error) {
    console.error(`[ACTIVITY LOG ERROR]`, error);
  }
};

module.exports = { logActivity };
