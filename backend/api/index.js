const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');

// Only load .env file in local development — Vercel injects env vars natively
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// Health checks
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Alfalah API is running' });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Health check passed' });
});

connectDB();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Allow all vercel.app subdomains + localhost
    if (origin.endsWith('.vercel.app') || origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));

// Vercel handles listening — only start manually outside production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
