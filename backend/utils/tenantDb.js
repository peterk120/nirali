const mongoose = require('mongoose');

// Import all schemas
const { ProductSchema } = require('../models/Product');
const { UserSchema } = require('../models/User');
const { OrderSchema } = require('../models/Order');
const { ActivityLogSchema } = require('../models/ActivityLog');
const { SubscriberSchema } = require('../models/Subscriber');

const modelCache = new Map();

/**
 * Get or create models for a specific database
 * @param {string} dbName The name of the database (e.g. 'sashti-sparkle')
 * @returns {Object} Object containing all initialized models
 */
const getModels = (dbName) => {
  const cacheKey = dbName;
  
  if (modelCache.has(cacheKey)) {
    return modelCache.get(cacheKey);
  }

  // Use the existing connection to switch databases
  const db = mongoose.connection.useDb(dbName, { useCache: true });

  // Initialize models on this specific connection
  const models = {
    Product: db.model('Product', ProductSchema),
    User: db.model('User', UserSchema),
    Order: db.model('Order', OrderSchema),
    ActivityLog: db.model('ActivityLog', ActivityLogSchema),
    Subscriber: db.model('Subscriber', SubscriberSchema)
  };

  modelCache.set(cacheKey, models);
  return models;
};

module.exports = { getModels };
