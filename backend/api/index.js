const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('../config/db');

// Only load .env in local dev - Vercel injects environment variables natively
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Increase JSON / urlencoded payload limits for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Enable CORS for all routes (since we removed withCredentials, a wildcard * works perfectly)
app.use(cors());

// Standard CORS configuration for Express routes (Removed in favor of manual override)

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

// Health checks
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Alfalah API is running' });
});
app.get('/api', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Alfalah API is running' });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Health check passed' });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Health check passed' });
});

// Local uploads fallback handler for Vercel
app.use('/uploads', (req, res) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  res.set('Access-Control-Allow-Origin', '*');
  res.status(404).json({ error: "Local uploads are not supported on Vercel. Please configure Cloudinary environment variables." });
});

// API Routes
app.use('/api/admin', require('../routes/adminRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));
app.use('/orders', require('../routes/orderRoutes'));
app.use('/api', require('../routes/seoRoutes'));

if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Global Error Handler for Vercel
app.use((err, req, res, next) => {
  console.error('Express Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? err.toString() : err,
  });
});

module.exports = app;
