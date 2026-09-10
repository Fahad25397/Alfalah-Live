const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow serving images cross-origin
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "res.cloudinary.com", "http://localhost:5000", "https://alfalah-eight.vercel.app"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Health check endpoint (placed first so it responds immediately)
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Alfalah Honey API is running' });
});
// Connect to MongoDB
connectDB();

// Force CORS properly
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://alfalah-eight.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Fallback
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Enable CORS for all routes
app.use(cors());

// Limit JSON / urlencoded payload sizes for security
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());

// Serve local uploads folder statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path, stat) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api', require('./routes/seoRoutes'));

// Global Error Handler - Security Hardened (No stack trace leaks)
app.use((err, req, res, next) => {
  // Internally log the error but don't expose stack to the client
  console.error('Intercepted Error:', err.stack || err);
  
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: 'An internal error occurred. Please try again later.',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
