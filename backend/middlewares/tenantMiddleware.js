const { getModels } = require('../utils/tenantDb');

/**
 * Middleware to select the correct database models based on the X-App-Source header
 */
const tenantMiddleware = (req, res, next) => {
  // Extract the app source from headers
  const appSource = req.headers['x-app-source'] || 'sasthik';
  
  // Map app source to database name
  let dbName = 'sashti-sparkle'; // Default
  
  if (appSource === 'boutique') {
    dbName = 'nirali_sai_boutique';
  } else if (appSource === 'sasthik') {
    dbName = 'sashti-sparkle';
  }
  
  // Attach models to the request object
  try {
    req.dbModels = getModels(dbName);
    req.dbName = dbName;
    next();
  } catch (error) {
    console.error(`Error connecting to database ${dbName}:`, error);
    res.status(500).json({ success: false, message: 'Database connection error' });
  }
};

module.exports = tenantMiddleware;
