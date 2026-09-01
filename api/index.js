const express = require('express');
const cors = require('cors');
const connectDB = require('../backend/config/db');

// Only load .env in local dev - Vercel injects environment variables natively
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// Increase JSON / urlencoded payload limits to support Base64 images from admin
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Standard CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.vercel.app') || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection middleware error:', err);
    res.status(500).json({ error: 'Database connection failed', message: err.message });
  }
});

// Health check endpoints
app.get('/api', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Alfalah Honey API is running' });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Health check passed' });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Health check passed' });
});

// Register API Routes (support both /api/* and direct /* prefix for flexible serverless rewrites)
app.use('/api/admin', require('../backend/routes/adminRoutes'));
app.use('/admin', require('../backend/routes/adminRoutes'));
app.use('/api/products', require('../backend/routes/productRoutes'));
app.use('/products', require('../backend/routes/productRoutes'));
app.use('/api/orders', require('../backend/routes/orderRoutes'));
app.use('/orders', require('../backend/routes/orderRoutes'));
app.use('/api/seo', require('../backend/routes/seoRoutes'));
app.use('/seo', require('../backend/routes/seoRoutes'));

// For local testing outside serverless
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
