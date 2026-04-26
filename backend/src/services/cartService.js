const Cart = require('../models/Cart');
const ProductVariant = require('../models/ProductVariant');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

/**
 * Lấy hoặc tạo cart active của user
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId, status: 'active' });
  if (!cart) {
    cart = await Cart.create({ userId, status: 'active', items: [] });
  }
  return cart;
};

/**
 * Lấy cart với thông tin populate đầy đủ + tính giá realtime
 */
const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  // Populate variant details
  await cart.populate({
    path: 'items.variantId',
    select: 'productId size color sku price stock image',
    populate: {
      path: 'productId',
      select: 'name slug images',
    },
  });

  // Tính giá realtime
  let totalAmount = 0;
  const items = cart.items.map((item) => {
    const variant = item.variantId;
    if (!variant) return null; // variant bị xóa

    const product = variant.productId;
    const subtotal = variant.price * item.quantity;
    totalAmount += subtotal;

    return {
      _id: item._id,
      variantId: variant._id,
      productId: product?._id,
      productName: product?.name,
      productSlug: product?.slug,
      thumbnail: product?.images?.[0],
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      image: variant.image,
      price: variant.price,
      stock: variant.stock,
      quantity: item.quantity,
      subtotal,
    };
  }).filter(Boolean);

  return {
    _id: cart._id,
    items,
    totalAmount,
    itemCount: items.length,
  };
};

/**
 * Thêm item vào cart
 */
const addItem = async (userId, { variantId, quantity }) => {
  // Kiểm tra variant tồn tại
  const variant = await ProductVariant.findById(variantId);
  if (!variant) {
    throw new ApiError(404, 'Sản phẩm không tồn tại');
  }

  // Kiểm tra product còn active
  const product = await Product.findOne({
    _id: variant.productId,
    isDeleted: false,
    status: 'active',
  });
  if (!product) {
    throw new ApiError(400, 'Sản phẩm không còn bán');
  }

  const cart = await getOrCreateCart(userId);

  // Kiểm tra variant đã có trong cart chưa
  const existingItem = cart.items.find(
    (item) => item.variantId.toString() === variantId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > variant.stock) {
      throw new ApiError(400, `Chỉ còn ${variant.stock} sản phẩm trong kho`);
    }
    existingItem.quantity = newQuantity;
  } else {
    if (quantity > variant.stock) {
      throw new ApiError(400, `Chỉ còn ${variant.stock} sản phẩm trong kho`);
    }
    cart.items.push({ variantId, quantity });
  }

  await cart.save();
  return getCart(userId);
};

/**
 * Cập nhật quantity
 */
const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ userId, status: 'active' });
  if (!cart) {
    throw new ApiError(404, 'Giỏ hàng không tồn tại');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new ApiError(404, 'Item không tồn tại trong giỏ hàng');
  }

  // Kiểm tra stock
  const variant = await ProductVariant.findById(item.variantId);
  if (!variant) {
    throw new ApiError(404, 'Sản phẩm không tồn tại');
  }
  if (quantity > variant.stock) {
    throw new ApiError(400, `Chỉ còn ${variant.stock} sản phẩm trong kho`);
  }

  item.quantity = quantity;
  await cart.save();

  return getCart(userId);
};

/**
 * Xóa item khỏi cart
 */
const removeItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ userId, status: 'active' });
  if (!cart) {
    throw new ApiError(404, 'Giỏ hàng không tồn tại');
  }

  cart.items.pull({ _id: itemId });
  await cart.save();

  return getCart(userId);
};

/**
 * Xóa toàn bộ items (clear cart)
 */
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId, status: 'active' });
  if (!cart) {
    throw new ApiError(404, 'Giỏ hàng không tồn tại');
  }

  cart.items = [];
  await cart.save();

  return { _id: cart._id, items: [], totalAmount: 0, itemCount: 0 };
};

module.exports = { getCart, addItem, updateItemQuantity, removeItem, clearCart, getOrCreateCart };
