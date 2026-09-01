const mongoose = require('mongoose');
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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      let product = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(id);
      } else {
        product = await Product.findOne({ _id: id });
      }
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching product', error: err.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      let updatedProduct = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      } else {
        updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });
      }
      if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(updatedProduct);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to update product', error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      let deletedProduct = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        deletedProduct = await Product.findByIdAndDelete(id);
      } else {
        deletedProduct = await Product.findOneAndDelete({ _id: id });
      }
      if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json({ message: 'Product deleted successfully', id });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to delete product', error: err.message });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
};
