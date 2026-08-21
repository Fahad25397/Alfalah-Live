const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders - Create guest order
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const order = new Order({
      customer,
      items,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// GET /api/orders - Fetch all orders for admin
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// GET /api/orders/:id - Fetch single order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ _id: id });
    }
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// PUT /api/orders/:id/status - Update order status (Pending -> Delivered / Processing)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      order = await Order.findOneAndUpdate({ _id: id }, { status }, { new: true });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    let deletedOrder = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedOrder = await Order.findByIdAndDelete(id);
    } else {
      deletedOrder = await Order.findOneAndDelete({ _id: id });
    }

    if (!deletedOrder) {
      return res.status(404).json({ message: `Order #${id} not found` });
    }
    res.json({ message: 'Order deleted successfully', id });
  } catch (error) {
    console.error('Delete order server error:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

module.exports = router;