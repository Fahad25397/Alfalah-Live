const express = require('express');
const router = express.Router();
const DeliverySetting = require('../models/DeliverySetting');
const { protectAdmin } = require('../middleware/auth');

// GET /api/delivery-settings (Public access so cart can calculate)
router.get('/', async (req, res) => {
  try {
    const settings = await DeliverySetting.find({});
    res.json(settings);
  } catch (error) {
    console.error('Error fetching delivery settings:', error);
    res.status(500).json({ message: 'Server error fetching delivery settings' });
  }
});

// POST /api/admin/delivery-settings (Admin protected via server route setup or here)
// Wait, the mount point will determine auth. If I mount this at /api/delivery-settings it's public.
// But we need admin operations too.
// Let's create admin specific routes here, but we will mount it under /api/delivery-settings and use protectAdmin for specific routes.

router.post('/', protectAdmin, async (req, res) => {
  try {
    const { category, weight, charge } = req.body;
    if (!category || !weight || charge === undefined) {
      return res.status(400).json({ message: 'Category, weight, and charge are required' });
    }

    const setting = new DeliverySetting({ category, weight, charge });
    await setting.save();
    res.status(201).json(setting);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A delivery rule for this category and weight already exists' });
    }
    console.error('Error creating delivery setting:', error);
    res.status(500).json({ message: 'Server error creating delivery setting' });
  }
});

router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const { category, weight, charge } = req.body;
    const setting = await DeliverySetting.findByIdAndUpdate(
      req.params.id,
      { category, weight, charge },
      { new: true, runValidators: true }
    );
    if (!setting) {
      return res.status(404).json({ message: 'Delivery setting not found' });
    }
    res.json(setting);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A delivery rule for this category and weight already exists' });
    }
    console.error('Error updating delivery setting:', error);
    res.status(500).json({ message: 'Server error updating delivery setting' });
  }
});

router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const setting = await DeliverySetting.findByIdAndDelete(req.params.id);
    if (!setting) {
      return res.status(404).json({ message: 'Delivery setting not found' });
    }
    res.json({ message: 'Delivery setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery setting:', error);
    res.status(500).json({ message: 'Server error deleting delivery setting' });
  }
});

module.exports = router;
