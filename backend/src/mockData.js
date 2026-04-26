const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });
dotenv.config(); // fallback

const User = require('./models/User');
const Order = require('./models/Order');
const Address = require('./models/Address');
const Product = require('./models/Product');
const ProductVariant = require('./models/ProductVariant');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://khoilam3789_db_user:jERR73m7b3ZYEF1m@cluster0.lfdp1y7.mongodb.net/fashion_store';

const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const lastNames = ['An', 'Bình', 'Châu', 'Dương', 'Hà', 'Hải', 'Khang', 'Lâm', 'Nam', 'Phong', 'Quân', 'Sơn', 'Tâm', 'Tuấn', 'Vinh', 'Yến', 'Vy', 'Trang', 'Phương', 'Mai'];
const cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Fetch existing products and variants to make realistic orders
    const products = await Product.find().lean();
    const variants = await ProductVariant.find().lean();
    if (products.length === 0 || variants.length === 0) {
      console.log('No products or variants found. Please seed products first.');
      process.exit();
    }

    console.log('Generating 100 users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    
    // Check if we need to clean old mock users
    // Let's just create 100 fresh users and randomly pick from them
    let newUsers = [];
    for (let i = 0; i < 100; i++) {
        const fName = getRandomElement(firstNames);
        const lName = getRandomElement(lastNames);
        newUsers.push({
            fullName: `${fName} ${lName}`,
            email: `khachhang_${Date.now()}_${i}@example.com`,
            passwordHash: passwordHash,
            phone: `09${getRandomInt(10000000, 99999999)}`,
            role: 'customer',
            isActive: true
        });
    }
    const createdUsers = await User.insertMany(newUsers);
    console.log(`Created 100 users successfully.`);

    console.log('Generating 200 orders...');
    let orderStatusOptions = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    let orders = [];

    // Pre-calculate order dates distribution across the last 30 days
    const now = new Date();
    
    for (let i = 0; i < 200; i++) {
        const user = getRandomElement(createdUsers);
        
        // Items
        const numItems = getRandomInt(1, 3);
        let items = [];
        let totalAmount = 0;
        
        for(let j=0; j < numItems; j++) {
            const variant = getRandomElement(variants);
            const product = products.find(p => p._id.toString() === variant.productId.toString());
            const qty = getRandomInt(1, 2);
            const unitPrice = variant.price || getRandomInt(15, 35) * 10000;
            const itemSubtotal = qty * unitPrice;
            
            items.push({
                productId: product._id,
                variantId: variant._id,
                productName: product.name,
                sku: variant.sku,
                size: variant.size,
                color: variant.color,
                image: product.images[0] || 'https://placehold.co/400',
                quantity: qty,
                unitPrice: unitPrice,
                subtotal: itemSubtotal
            });
            totalAmount += itemSubtotal;
        }

        // Random Date within last 60 days
        const daysAgo = getRandomInt(0, 60);
        let createdAt = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        let orderStatus = getRandomElement(orderStatusOptions);

        let paymentStatus = 'unpaid';
        let paidAt = null;
        let confirmedAt = null;
        let shippedAt = null;
        let deliveredAt = null;
        let cancelledAt = null;

        // Simulate lifecycle
        if (orderStatus !== 'pending') {
            confirmedAt = new Date(createdAt.getTime() + 1000 * 60 * 30); // 30 mins after
        }
        if (['shipping', 'delivered'].includes(orderStatus)) {
            paymentStatus = 'paid';
            paidAt = new Date(createdAt.getTime() + 1000 * 60 * 15);
            shippedAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24); // 1 day after
        }
        if (orderStatus === 'delivered') {
            deliveredAt = new Date(shippedAt.getTime() + 1000 * 60 * 60 * 24 * 2); // 2 days after shipping
        }
        if (orderStatus === 'cancelled') {
            cancelledAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 2); // 2 hours after
        }

        orders.push({
            userId: user._id,
            totalAmount: totalAmount,
            inventoryRestored: false, // simplified
            paymentMethod: ['cod', 'bank_transfer'][getRandomInt(0,1)],
            paymentStatus: paymentStatus,
            orderStatus: orderStatus,
            createdAt: createdAt,
            updatedAt: createdAt,
            paidAt: paidAt,
            confirmedAt: confirmedAt,
            shippedAt: shippedAt,
            deliveredAt: deliveredAt,
            cancelledAt: cancelledAt,
            shippingAddress: {
                fullName: user.fullName,
                phone: user.phone,
                street: `${getRandomInt(10, 999)} Đường số ${getRandomInt(1, 20)}`,
                ward: `Phường ${getRandomInt(1, 15)}`,
                district: `Quận ${getRandomInt(1, 12)}`,
                cityProvince: getRandomElement(cities),
                note: ''
            },
            items: items
        });
    }

    await Order.insertMany(orders);
    console.log(`Created 200 orders successfully.`);
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

generateMockData();
