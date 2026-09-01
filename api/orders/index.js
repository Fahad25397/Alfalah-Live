const connectDB = require('../../backend/config/db');
const Order = require('../../backend/models/Order');

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
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { customer, items, totalAmount } = req.body;
      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      const order = new Order({ customer, items, totalAmount });
      const createdOrder = await order.save();
      return res.status(201).json(createdOrder);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
};
