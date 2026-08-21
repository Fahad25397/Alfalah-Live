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
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Increase JSON / urlencoded payload limits (Secured to 10kb)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(cookieParser());

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

module.exports = app;
