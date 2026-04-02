const getCart = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const userId = req.user.id;
    const user = await User.findById(userId).populate('cart.productId');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const userId = req.user.id;
    const { productId, quantity, rentalDays, size, rentalStartDate } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if item already exists in cart with same options
    const existingItemIndex = user.cart.findIndex(item => 
      item.productId.toString() === productId && 
      item.size === size &&
      item.rentalDays === rentalDays
    );

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += (quantity || 1);
    } else {
      user.cart.push({
        productId,
        quantity: quantity || 1,
        rentalDays: rentalDays || 1,
        size,
        rentalStartDate
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const userId = req.user.id;
    const { productId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const userId = req.user.id;
    const { productId, quantity, size } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      if (quantity !== undefined) user.cart[itemIndex].quantity = quantity;
      if (size !== undefined) user.cart[itemIndex].size = size;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const User = req.dbModels.User;
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
};
