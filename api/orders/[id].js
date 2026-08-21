const mongoose = require('mongoose');
const connectDB = require('../../backend/config/db');
const Order = require('../../backend/models/Order');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      let order = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        order = await Order.findById(id);
      } else {
        order = await Order.findOne({ _id: id });
      }
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json(order);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to fetch order', error: err.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { status } = req.body;
      let order = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      } else {
        order = await Order.findOneAndUpdate({ _id: id }, { status }, { new: true });
      }
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json(order);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to update order status', error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      let deletedOrder = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        deletedOrder = await Order.findByIdAndDelete(id);
      } else {
        deletedOrder = await Order.findOneAndDelete({ _id: id });
      }
      if (!deletedOrder) {
        return res.status(404).json({ message: `Order #${id} not found` });
      }
      return res.status(200).json({ message: 'Order deleted successfully', id });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to delete order', error: err.message });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
};
