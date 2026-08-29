const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const { protectAdmin } = require('../middleware/auth');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

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
    
    // Send WhatsApp Message asynchronously
    if (customer && customer.phone) {
      const customerName = customer.fullName || customer.name || 'Customer';
      const message = `Welcome to the Alfalah Honey family, ${customerName}.
Your step toward a healthier lifestyle is confirmed. We have received your order #${createdOrder._id.toString().slice(-6)} for our premium, pure honey.

Delivery Information:
Our team is carefully packaging your customizable sticker jar to ensure it reaches you securely. Delivery typically takes 3 to 5 business days.

Total Order Value: Rs. ${totalAmount}

"Eat Good, Live Good" is more than a mindset—it is a lifestyle. Thank you for choosing organic purity.

Best regards,
Team Alfalah Honey`;

      sendWhatsAppMessage(customer.phone, message).catch(err => {
        console.error('WhatsApp Error:', err);
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// GET /api/orders - Fetch all orders for admin
router.get('/', protectAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 0;
    const skip = (page - 1) * limit;

    let query = Order.find().sort({ createdAt: -1 });
    
    if (limit > 0) {
      query = query.skip(skip).limit(limit);
    }

    const orders = await query;
    const total = await Order.countDocuments();

    if (limit > 0) {
      res.json({
        data: orders,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      });
    } else {
      res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// GET /api/orders/:id - Fetch single order
router.get('/:id', protectAdmin, async (req, res) => {
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
router.put('/:id/status', protectAdmin, async (req, res) => {
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
router.delete('/:id', protectAdmin, async (req, res) => {
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