/**
 * Script kiểm tra Phase 1: Database Design
 * - Kết nối MongoDB Atlas
 * - Tạo indexes cho tất cả models
 * - Test required field validation
 * - Test unique index (E11000)
 * - Test partial unique index trên Cart
 * - Liệt kê collections đã tạo
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const User = require('./src/models/User');
const Address = require('./src/models/Address');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const ProductVariant = require('./src/models/ProductVariant');
const Cart = require('./src/models/Cart');
const Order = require('./src/models/Order');
const BehaviorLog = require('./src/models/BehaviorLog');

const PASS = '✅ PASS';
const FAIL = '❌ FAIL';
let passed = 0;
let failed = 0;

function log(result, testName, detail = '') {
  if (result === PASS) passed++;
  else failed++;
  console.log(`${result} ${testName}${detail ? ' — ' + detail : ''}`);
}

async function runTests() {
  console.log('═══════════════════════════════════════════');
  console.log('  Phase 1 — Database Schema Verification');
  console.log('═══════════════════════════════════════════\n');

  // ─── Connect ───
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log(PASS, 'MongoDB connection');
  } catch (err) {
    log(FAIL, 'MongoDB connection', err.message);
    process.exit(1);
  }

  // ─── Sync indexes ───
  try {
    await Promise.all([
      User.syncIndexes(),
      Address.syncIndexes(),
      Category.syncIndexes(),
      Product.syncIndexes(),
      ProductVariant.syncIndexes(),
      Cart.syncIndexes(),
      Order.syncIndexes(),
      BehaviorLog.syncIndexes(),
    ]);
    log(PASS, 'All indexes synced');
  } catch (err) {
    log(FAIL, 'Index sync', err.message);
  }

  // ─── List collections ───
  const collections = await mongoose.connection.db.listCollections().toArray();
  const names = collections.map((c) => c.name).sort();
  console.log(`\nCollections in DB: [${names.join(', ')}]\n`);

  // ─── Test 1: User required field validation ───
  try {
    const user = new User({});
    await user.validate();
    log(FAIL, 'User required validation', 'should have thrown');
  } catch (err) {
    if (err.name === 'ValidationError') {
      const missing = Object.keys(err.errors);
      log(PASS, 'User required validation', `missing: ${missing.join(', ')}`);
    } else {
      log(FAIL, 'User required validation', err.message);
    }
  }

  // ─── Test 2: User email format validation ───
  try {
    const user = new User({
      fullName: 'Test',
      email: 'invalid-email',
      passwordHash: 'hash',
    });
    await user.validate();
    log(FAIL, 'User email regex', 'should have thrown');
  } catch (err) {
    if (err.name === 'ValidationError' && err.errors.email) {
      log(PASS, 'User email regex', 'rejected invalid email');
    } else {
      log(FAIL, 'User email regex', err.message);
    }
  }

  // ─── Test 3: User email unique index ───
  const testEmail = `test_${Date.now()}@verify.com`;
  try {
    await User.create({
      fullName: 'Test A',
      email: testEmail,
      passwordHash: 'hash1',
    });
    await User.create({
      fullName: 'Test B',
      email: testEmail,
      passwordHash: 'hash2',
    });
    log(FAIL, 'User email unique index', 'should have thrown E11000');
  } catch (err) {
    if (err.code === 11000) {
      log(PASS, 'User email unique index', 'E11000 duplicate key');
    } else {
      log(FAIL, 'User email unique index', err.message);
    }
  }

  // ─── Test 4: Product images min length ───
  try {
    const product = new Product({
      name: 'Test',
      slug: 'test',
      categoryId: new mongoose.Types.ObjectId(),
      targetGender: 'men',
      images: [],
    });
    await product.validate();
    log(FAIL, 'Product images min 1', 'should have thrown');
  } catch (err) {
    if (err.name === 'ValidationError') {
      log(PASS, 'Product images min 1', 'rejected empty images array');
    } else {
      log(FAIL, 'Product images min 1', err.message);
    }
  }

  // ─── Test 5: ProductVariant stock integer validation ───
  try {
    const variant = new ProductVariant({
      productId: new mongoose.Types.ObjectId(),
      size: 'M',
      color: 'Black',
      sku: 'TEST-SKU-INT',
      stock: 2.5,
      price: 100000,
      image: 'test.jpg',
    });
    await variant.validate();
    log(FAIL, 'ProductVariant stock integer', 'should have thrown');
  } catch (err) {
    if (err.name === 'ValidationError') {
      log(PASS, 'ProductVariant stock integer', 'rejected non-integer stock');
    } else {
      log(FAIL, 'ProductVariant stock integer', err.message);
    }
  }

  // ─── Test 6: ProductVariant compound unique [productId, size, color] ───
  const sharedProductId = new mongoose.Types.ObjectId();
  try {
    await ProductVariant.create({
      productId: sharedProductId,
      size: 'M',
      color: 'Red',
      sku: `SKU-A-${Date.now()}`,
      stock: 10,
      price: 200000,
      image: 'a.jpg',
    });
    await ProductVariant.create({
      productId: sharedProductId,
      size: 'M',
      color: 'Red',
      sku: `SKU-B-${Date.now()}`,
      stock: 5,
      price: 200000,
      image: 'b.jpg',
    });
    log(FAIL, 'ProductVariant compound unique', 'should have thrown E11000');
  } catch (err) {
    if (err.code === 11000) {
      log(PASS, 'ProductVariant compound unique', 'E11000 [productId, size, color]');
    } else {
      log(FAIL, 'ProductVariant compound unique', err.message);
    }
  }

  // ─── Test 7: Cart partial unique index (1 active cart per user) ───
  const cartUserId = new mongoose.Types.ObjectId();
  try {
    await Cart.create({ userId: cartUserId, status: 'active', items: [] });
    await Cart.create({ userId: cartUserId, status: 'active', items: [] });
    log(FAIL, 'Cart partial unique index', 'should have thrown E11000');
  } catch (err) {
    if (err.code === 11000) {
      log(PASS, 'Cart partial unique index', 'E11000 — 1 active cart per user');
    } else {
      log(FAIL, 'Cart partial unique index', err.message);
    }
  }

  // ─── Test 8: Cart allows multiple checked_out for same user ───
  const cartUserId2 = new mongoose.Types.ObjectId();
  try {
    await Cart.create({ userId: cartUserId2, status: 'checked_out', items: [] });
    await Cart.create({ userId: cartUserId2, status: 'checked_out', items: [] });
    log(PASS, 'Cart allows multiple checked_out', 'no conflict');
  } catch (err) {
    log(FAIL, 'Cart allows multiple checked_out', err.message);
  }

  // ─── Test 9: Order items min 1 ───
  try {
    const order = new Order({
      userId: new mongoose.Types.ObjectId(),
      totalAmount: 0,
      paymentMethod: 'cod',
      shippingAddress: {
        fullName: 'Test',
        phone: '0901234567',
        street: '123 Street',
        ward: 'Ward 1',
        district: 'District 1',
        cityProvince: 'HCM',
      },
      items: [],
    });
    await order.validate();
    log(FAIL, 'Order items min 1', 'should have thrown');
  } catch (err) {
    if (err.name === 'ValidationError') {
      log(PASS, 'Order items min 1', 'rejected empty items');
    } else {
      log(FAIL, 'Order items min 1', err.message);
    }
  }

  // ─── Test 10: Order status enum ───
  try {
    const order = new Order({
      userId: new mongoose.Types.ObjectId(),
      totalAmount: 100000,
      paymentMethod: 'cod',
      orderStatus: 'invalid_status',
      shippingAddress: {
        fullName: 'Test',
        phone: '0901234567',
        street: '123',
        ward: 'W1',
        district: 'D1',
        cityProvince: 'HCM',
      },
      items: [
        {
          productId: new mongoose.Types.ObjectId(),
          variantId: new mongoose.Types.ObjectId(),
          productName: 'Test',
          sku: 'SKU-1',
          size: 'M',
          color: 'Black',
          image: 'img.jpg',
          quantity: 1,
          unitPrice: 100000,
          subtotal: 100000,
        },
      ],
    });
    await order.validate();
    log(FAIL, 'Order status enum', 'should have thrown');
  } catch (err) {
    if (err.name === 'ValidationError') {
      log(PASS, 'Order status enum', 'rejected invalid orderStatus');
    } else {
      log(FAIL, 'Order status enum', err.message);
    }
  }

  // ─── Test 11: BehaviorLog eventType enum ───
  try {
    const behaviorLog = new BehaviorLog({
      userId: new mongoose.Types.ObjectId(),
      productId: new mongoose.Types.ObjectId(),
      eventType: 'invalid_event',
    });
    await behaviorLog.validate();
    log(FAIL, 'BehaviorLog eventType enum', 'should have thrown');
  } catch (err) {
    if (err.name === 'ValidationError') {
      log(PASS, 'BehaviorLog eventType enum', 'rejected invalid eventType');
    } else {
      log(FAIL, 'BehaviorLog eventType enum', err.message);
    }
  }

  // ─── Cleanup test data ───
  await User.deleteMany({ email: { $regex: /^test_.*@verify\.com$/ } });
  await ProductVariant.deleteMany({ productId: sharedProductId });
  await Cart.deleteMany({ userId: { $in: [cartUserId, cartUserId2] } });

  // ─── Summary ───
  console.log('\n═══════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('═══════════════════════════════════════════');

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
