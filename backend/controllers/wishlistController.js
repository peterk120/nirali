const getWishlist = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const userId = req.user.id;
    const user = await User.findById(userId).populate('wishlist.productId');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const userId = req.user.id;
    const { productId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if item already exists in wishlist
    const exists = user.wishlist.some(item => item.productId.toString() === productId);

    if (!exists) {
      user.wishlist.push({ productId });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Item added to wishlist',
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const userId = req.user.id;
    const { productId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(item => item.productId.toString() !== productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist',
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
