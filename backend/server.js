const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { initWhatsApp } = require('./utils/whatsapp');

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
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

// WhatsApp QR Code endpoint
app.get('/api/whatsapp/qr', (req, res) => {
  try {
    const fs = require('fs');
    if (fs.existsSync('qr.txt')) {
      const qrText = fs.readFileSync('qr.txt', 'utf8');
      res.send(`
        <html>
          <head>
            <title>WhatsApp QR Code</title>
            <meta http-equiv="refresh" content="5">
            <style>body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #faf8f5; font-family: sans-serif; text-align: center; }</style>
          </head>
          <body>
            <h2>Scan with WhatsApp (Linked Devices)</h2>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}" />
            <p>This page auto-refreshes every 5 seconds.</p>
            <p>Once you scan it from the WhatsApp app, this page will still refresh but you can close it.</p>
            <p>Check your backend terminal to confirm it says "Client is ready".</p>
          </body>
        </html>
      `);
    } else {
      res.send('<h2>Waiting for QR code... If you already scanned it, the bot is authenticated.</h2><script>setTimeout(()=>window.location.reload(),5000);</script>');
    }
  } catch (e) {
    res.send('<h2>Error loading QR code</h2>');
  }
});

// Connect to MongoDB
connectDB();

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Alternative dev port
      process.env.FRONTEND_URL, // Production frontend URL from env
    ].filter(Boolean);
    
    // Allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Increase JSON / urlencoded payload limits for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors(corsOptions));
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: isProd ? 'Internal Server Error' : err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize WhatsApp Bot Client
  initWhatsApp();
});
