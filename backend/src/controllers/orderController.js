const orderService = require('../services/orderService');

// ─── Customer endpoints ───

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const result = await orderService.getOrdersByUser(req.user.id, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getMyOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.user.id, req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.user.id, req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ─── Admin endpoints ───

const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getOrderByIdAdmin = async (req, res, next) => {
  try {
    const order = await orderService.getOrderByIdAdmin(req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.orderStatus);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    const order = await orderService.updatePaymentStatus(req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelOrder,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  updatePaymentStatus,
};
