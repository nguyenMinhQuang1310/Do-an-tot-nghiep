const cartService = require('../services/cartService');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const cart = await cartService.addItem(req.user.id, req.body);
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const updateItemQuantity = async (req, res, next) => {
  try {
    const cart = await cartService.updateItemQuantity(
      req.user.id,
      req.params.itemId,
      req.body.quantity
    );
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(req.user.id, req.params.itemId);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user.id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addItem, updateItemQuantity, removeItem, clearCart };
