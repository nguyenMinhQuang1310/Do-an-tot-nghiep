/**
 * Phase 2 — Full Flow Verification Script
 * Test: Register → Login → Create Category → Create Product → Create Variant
 *       → Add to Cart → Create Address → Checkout → Admin update status → Stats
 */
require('dotenv').config();
const mongoose = require('mongoose');

const BASE = 'http://localhost:5000/api';

async function api(method, path, body, token) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();

  if (!data.success) {
    throw new Error(`${method} ${path} → ${res.status}: ${data.message}`);
  }

  return data.data;
}

const PASS = '✅';
const FAIL = '❌';
let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`${PASS} ${name}`);
    passed++;
  } catch (err) {
    console.log(`${FAIL} ${name} — ${err.message}`);
    failed++;
  }
}

async function run() {
  console.log('═══════════════════════════════════════════');
  console.log('  Phase 2 — Full Flow Verification');
  console.log('═══════════════════════════════════════════\n');

  // Connect mongoose for direct DB operations (set admin role, cleanup)
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('./src/models/User');
  const Product = require('./src/models/Product');
  const ProductVariant = require('./src/models/ProductVariant');
  const Cart = require('./src/models/Cart');
  const Order = require('./src/models/Order');
  const Address = require('./src/models/Address');
  const Category = require('./src/models/Category');

  const ts = Date.now();
  let customerToken, adminToken;
  let categoryId, productId, variantId, addressId, orderId;

  // ─── Auth ───
  await test('Register customer', async () => {
    const data = await api('POST', '/auth/register', {
      fullName: 'Test Customer',
      email: `customer_${ts}@test.com`,
      password: 'password123',
    });
    customerToken = data.token;
    if (!customerToken) throw new Error('No token');
  });

  await test('Register + promote admin', async () => {
    await api('POST', '/auth/register', {
      fullName: 'Test Admin',
      email: `admin_${ts}@test.com`,
      password: 'password123',
    });
    // Set admin role directly in DB
    await User.updateOne({ email: `admin_${ts}@test.com` }, { role: 'admin' });
    // Re-login to get admin token
    const data = await api('POST', '/auth/login', {
      email: `admin_${ts}@test.com`,
      password: 'password123',
    });
    adminToken = data.token;
    if (!adminToken) throw new Error('No admin token');
  });

  await test('Login customer', async () => {
    const data = await api('POST', '/auth/login', {
      email: `customer_${ts}@test.com`,
      password: 'password123',
    });
    if (!data.token) throw new Error('No token');
  });

  await test('Get profile (me)', async () => {
    const data = await api('GET', '/auth/me', null, customerToken);
    if (data.fullName !== 'Test Customer') throw new Error('Wrong name');
  });

  // ─── Category (Admin) ───
  await test('Create category', async () => {
    const data = await api('POST', '/categories', { name: 'Áo Polo' }, adminToken);
    categoryId = data._id;
    if (!categoryId) throw new Error('No category id');
  });

  await test('List categories', async () => {
    const data = await api('GET', '/categories');
    if (!Array.isArray(data)) throw new Error('Not array');
  });

  // ─── Product (Admin) ───
  await test('Create product', async () => {
    const data = await api('POST', '/products', {
      name: 'Polo Classic Navy',
      categoryId,
      targetGender: 'men',
      brand: 'TestBrand',
      description: 'Áo polo classic màu navy',
      images: ['https://example.com/polo1.jpg'],
      status: 'active',
    }, adminToken);
    productId = data._id;
    if (!productId) throw new Error('No product id');
  });

  // ─── Variant (Admin) ───
  await test('Create variant (M)', async () => {
    const data = await api('POST', `/products/${productId}/variants`, {
      size: 'M', color: 'Navy', sku: `POLO-M-${ts}`,
      stock: 20, price: 350000, image: 'https://example.com/m.jpg',
    }, adminToken);
    variantId = data._id;
    if (!variantId) throw new Error('No variant id');
  });

  await test('Create variant (L)', async () => {
    await api('POST', `/products/${productId}/variants`, {
      size: 'L', color: 'Navy', sku: `POLO-L-${ts}`,
      stock: 15, price: 370000, image: 'https://example.com/l.jpg',
    }, adminToken);
  });

  await test('Get product with 2 variants', async () => {
    const data = await api('GET', `/products/${productId}`);
    if (data.variants.length !== 2) throw new Error(`Expected 2 variants, got ${data.variants.length}`);
  });

  // ─── Search ───
  await test('Search products', async () => {
    const data = await api('GET', '/products?search=polo');
    if (data.products.length < 1) throw new Error('No search results');
  });

  // ─── Cart ───
  await test('Add to cart (qty 2)', async () => {
    const data = await api('POST', '/cart/items', { variantId, quantity: 2 }, customerToken);
    if (data.itemCount !== 1) throw new Error('Wrong item count');
    if (data.totalAmount !== 700000) throw new Error(`Wrong total: ${data.totalAmount}`);
  });

  await test('Add same variant again (qty +1 = 3)', async () => {
    const data = await api('POST', '/cart/items', { variantId, quantity: 1 }, customerToken);
    if (data.items[0].quantity !== 3) throw new Error('Should be 3');
    if (data.totalAmount !== 1050000) throw new Error(`Wrong total: ${data.totalAmount}`);
  });

  await test('Update cart item quantity to 2', async () => {
    const cart = await api('GET', '/cart', null, customerToken);
    const itemId = cart.items[0]._id;
    const data = await api('PUT', `/cart/items/${itemId}`, { quantity: 2 }, customerToken);
    if (data.totalAmount !== 700000) throw new Error(`Wrong total: ${data.totalAmount}`);
  });

  // ─── Address ───
  await test('Create address (auto default)', async () => {
    const data = await api('POST', '/addresses', {
      fullName: 'Nguyễn Văn Test', phone: '0901234567',
      street: '123 Nguyễn Huệ', ward: 'Phường Bến Nghé',
      district: 'Quận 1', cityProvince: 'TP.HCM',
    }, customerToken);
    addressId = data._id;
    if (!data.isDefault) throw new Error('First address should be default');
  });

  // ─── Checkout ───
  await test('Create order (checkout COD)', async () => {
    const data = await api('POST', '/orders', {
      addressId, paymentMethod: 'cod',
    }, customerToken);
    orderId = data._id;
    if (data.totalAmount !== 700000) throw new Error(`Wrong totalAmount: ${data.totalAmount}`);
    if (data.items.length !== 1) throw new Error('Wrong items count');
    if (data.items[0].unitPrice !== 350000) throw new Error('Wrong unitPrice');
    if (data.items[0].subtotal !== 700000) throw new Error('Wrong subtotal');
    if (data.orderStatus !== 'pending') throw new Error('Wrong status');
    if (data.shippingAddress.fullName !== 'Nguyễn Văn Test') throw new Error('Wrong address snapshot');
  });

  await test('Stock deducted after checkout', async () => {
    const data = await api('GET', `/products/${productId}`);
    const v = data.variants.find(v => v._id === variantId);
    if (v.stock !== 18) throw new Error(`Expected 18, got ${v.stock}`);
  });

  // ─── Admin Order Flow ───
  await test('Admin: list all orders', async () => {
    const data = await api('GET', '/admin/orders', null, adminToken);
    if (data.orders.length < 1) throw new Error('No orders');
  });

  await test('Admin: confirm order (pending → confirmed)', async () => {
    const data = await api('PATCH', `/admin/orders/${orderId}/status`, { orderStatus: 'confirmed' }, adminToken);
    if (data.orderStatus !== 'confirmed') throw new Error('Wrong status');
    if (!data.confirmedAt) throw new Error('No confirmedAt');
  });

  await test('Admin: ship order (confirmed → shipping)', async () => {
    const data = await api('PATCH', `/admin/orders/${orderId}/status`, { orderStatus: 'shipping' }, adminToken);
    if (data.orderStatus !== 'shipping') throw new Error('Wrong status');
    if (!data.shippedAt) throw new Error('No shippedAt');
  });

  await test('Admin: deliver order (COD → auto paid)', async () => {
    const data = await api('PATCH', `/admin/orders/${orderId}/status`, { orderStatus: 'delivered' }, adminToken);
    if (data.orderStatus !== 'delivered') throw new Error('Wrong status');
    if (data.paymentStatus !== 'paid') throw new Error('COD should auto-set paid');
    if (!data.paidAt) throw new Error('No paidAt');
    if (!data.deliveredAt) throw new Error('No deliveredAt');
  });

  await test('Cannot cancel delivered order', async () => {
    try {
      await api('PATCH', `/admin/orders/${orderId}/status`, { orderStatus: 'cancelled' }, adminToken);
      throw new Error('Should have thrown');
    } catch (err) {
      if (!err.message.includes('Không thể chuyển')) throw err;
    }
  });

  // ─── Cancel Flow (new order) ───
  let cancelOrderId;
  await test('Cancel flow: checkout + cancel + stock restored', async () => {
    await api('POST', '/cart/items', { variantId, quantity: 3 }, customerToken);
    const order = await api('POST', '/orders', { addressId, paymentMethod: 'bank_transfer' }, customerToken);
    cancelOrderId = order._id;

    // Stock should be 18 - 3 = 15
    let prod = await api('GET', `/products/${productId}`);
    let v = prod.variants.find(v => v._id === variantId);
    if (v.stock !== 15) throw new Error(`Before cancel: expected 15, got ${v.stock}`);

    // Cancel
    const cancelled = await api('PATCH', `/orders/${cancelOrderId}/cancel`, null, customerToken);
    if (cancelled.orderStatus !== 'cancelled') throw new Error('Not cancelled');
    if (!cancelled.inventoryRestored) throw new Error('inventoryRestored should be true');

    // Stock restored: 15 + 3 = 18
    prod = await api('GET', `/products/${productId}`);
    v = prod.variants.find(v => v._id === variantId);
    if (v.stock !== 18) throw new Error(`After cancel: expected 18, got ${v.stock}`);
  });

  // ─── Stats ───
  await test('Stats: overview', async () => {
    const data = await api('GET', '/admin/stats/overview', null, adminToken);
    if (data.totalRevenue === undefined) throw new Error('No totalRevenue');
    if (data.totalOrders === undefined) throw new Error('No totalOrders');
  });

  await test('Stats: revenue by day', async () => {
    const data = await api('GET', '/admin/stats/revenue?groupBy=day', null, adminToken);
    if (!Array.isArray(data)) throw new Error('Not array');
    // Should have data from the delivered order
    if (data.length < 1) throw new Error('No revenue data');
  });

  await test('Stats: best-selling', async () => {
    const data = await api('GET', '/admin/stats/best-selling?limit=5', null, adminToken);
    if (!Array.isArray(data)) throw new Error('Not array');
    if (data.length < 1) throw new Error('No best-selling data');
    if (data[0].productName !== 'Polo Classic Navy') throw new Error('Wrong product');
  });

  // ─── Users (Admin) ───
  await test('Admin: list users with pagination', async () => {
    const data = await api('GET', '/users?page=1&limit=5', null, adminToken);
    if (!data.users || data.users.length < 1) throw new Error('No users');
    if (!data.pagination) throw new Error('No pagination');
  });

  // ─── Cleanup ───
  await User.deleteMany({ email: { $regex: new RegExp(`_${ts}@test\\.com$`) } });
  await Product.deleteMany({ _id: productId });
  await ProductVariant.deleteMany({ productId });
  await Cart.deleteMany({});
  await Order.deleteMany({ _id: { $in: [orderId, cancelOrderId].filter(Boolean) } });
  await Address.deleteMany({ _id: addressId });
  await Category.deleteMany({ _id: categoryId });

  // ─── Summary ───
  console.log('\n═══════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('═══════════════════════════════════════════');

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

run();
