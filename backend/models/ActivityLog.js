const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login', 
      'logout', 
      'add_product', 
      'update_product', 
      'delete_product', 
      'update_order',
      'bulk_upload',
      'staff_created',
      'staff_updated',
      'staff_status_toggled'
    ]
  },
  details: {
    type: String,
    required: true
  },
  targetId: {
    type: String, // ID of product, order, or staff member affected
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
