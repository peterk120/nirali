const sendEmail = require('../utils/emailService');

// @desc    Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const Subscriber = req.dbModels.Subscriber;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    // Basic email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'You are already subscribed to our newsletter'
        });
      } else {
        // Re-activate
        subscriber.status = 'active';
        await subscriber.save();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription is re-activated',
          data: subscriber
        });
      }
    }

    // Create new subscriber
    subscriber = await Subscriber.create({ email, status: 'active' });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter',
      data: subscriber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all subscribers (Admin only)
exports.getSubscribers = async (req, res) => {
  try {
    const Subscriber = req.dbModels.Subscriber;
    const { search } = req.query;
    let query = {};

    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const subscribers = await Subscriber.find(query).sort('-subscribedAt');

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unsubscribe
exports.unsubscribe = async (req, res) => {
  try {
    const Subscriber = req.dbModels.Subscriber;
    const { email } = req.body;
    
    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    subscriber.status = 'unsubscribed';
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete subscriber (Admin only)
exports.deleteSubscriber = async (req, res) => {
  try {
    const Subscriber = req.dbModels.Subscriber;
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle subscriber status (Admin only)
exports.toggleStatus = async (req, res) => {
  try {
    const Subscriber = req.dbModels.Subscriber;
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    subscriber.status = subscriber.status === 'active' ? 'unsubscribed' : 'active';
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: `Subscriber status updated to ${subscriber.status}`,
      data: subscriber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send bulk email (Admin only)
exports.sendBulkEmail = async (req, res) => {
  try {
    const Subscriber = req.dbModels.Subscriber;
    const { subject, message, subscriberIds } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject and message'
      });
    }

    let subscribers;
    if (subscriberIds && subscriberIds.length > 0) {
      subscribers = await Subscriber.find({
        _id: { $in: subscriberIds },
        status: 'active'
      });
    } else {
      subscribers = await Subscriber.find({ status: 'active' });
    }

    if (subscribers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active subscribers found'
      });
    }

    // Send emails asynchronously
    const emailPromises = subscribers.map(sub => 
      sendEmail({
        email: sub.email,
        subject: subject,
        message: message
      }).catch(err => {
        console.error(`Failed to send email to ${sub.email}:`, err.message);
        return { error: true, email: sub.email };
      })
    );

    const results = await Promise.all(emailPromises);
    const failedCount = results.filter(r => r && r.error).length;
    const successCount = subscribers.length - failedCount;

    res.status(200).json({
      success: true,
      message: `Emails sent successfully. Success: ${successCount}, Failed: ${failedCount}`,
      data: {
        total: subscribers.length,
        success: successCount,
        failed: failedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
