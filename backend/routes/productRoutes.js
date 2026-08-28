const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/products - Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 0; // 0 means no limit for backwards compatibility during transition

    const skip = (page - 1) * limit;

    let query = Product.find().sort({ createdAt: -1 });
    
    if (limit > 0) {
      query = query.skip(skip).limit(limit);
    }

    const products = await query;
    const total = await Product.countDocuments();

    if (limit > 0) {
      res.json({
        data: products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      });
    } else {
      // Legacy format for unupdated frontends
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/products - Add a new product (Protected)
router.post('/', protectAdmin, upload, async (req, res) => {
  try {
    const { name, category, description, image } = req.body;
    let variants = req.body.variants;

    // Parse variants if they come in as a JSON string (from FormData)
    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        variants = [];
      }
    }

    // Use Cloudinary URL if a file was uploaded, otherwise fallback to the image body field
    let imageUrl = image;
    if (req.file) {
      if (req.file.path && req.file.path.startsWith('http')) {
        imageUrl = req.file.path; // Cloudinary
      } else {
        imageUrl = `/uploads/${req.file.filename}`; // Local fallback
      }
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newProduct = new Product({ name, category, description, image: imageUrl, variants });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

// PUT /api/products/:id - Edit an existing product (Protected)
router.put('/:id', protectAdmin, upload, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (typeof updateData.variants === 'string') {
      try {
        updateData.variants = JSON.parse(updateData.variants);
      } catch (e) {
        delete updateData.variants;
      }
    }

    if (req.file) {
      if (req.file.path && req.file.path.startsWith('http')) {
        updateData.image = req.file.path;
      } else {
        updateData.image = `/uploads/${req.file.filename}`;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// DELETE /api/products/:id - Delete a product (Protected)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;