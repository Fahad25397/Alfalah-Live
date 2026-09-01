const connectDB = require('../../backend/config/db');
const Product = require('../../backend/models/Product');

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to fetch products', error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, category, description, image, variants } = req.body;
      const newProduct = new Product({ name, category, description, image, variants });
      const savedProduct = await newProduct.save();
      return res.status(201).json(savedProduct);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to add product', error: err.message });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
};
