const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const productVariantRoutes = require('./routes/productVariantRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const statsRoutes = require('./routes/statsRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

// ─── Global Middlewares ───
app.use(cors());
app.use(express.json());

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Fashion Store API is running' });
});

// ─── Mount Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/variants', productVariantRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/stats', statsRoutes);
app.use('/api/recommendations', recommendationRoutes);

// ─── 404 Handler ───
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route không tồn tại' });
});

// ─── Global Error Handler ───
app.use(errorHandler);

module.exports = app;
