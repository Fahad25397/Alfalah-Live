const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/config/db');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

app.use(cors());

connectDB();

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Alfalah Honey Server is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is healthy' });
});

app.use('/api/products', require('./backend/routes/productRoutes'));
app.use('/api/orders', require('./backend/routes/orderRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;