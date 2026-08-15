const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/products - Add a new product
router.post('/', async (req, res) => {
  try {
    // ✅ Added 'category' here so it extracts from the form data
    const { name, category, price, description, image, weight } = req.body;
    
    // ✅ Passed 'category' into the new product instance
    const newProduct = new Product({ name, category, price, description, image, weight });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

// PUT /api/products/:id - Edit an existing product
router.put('/:id', async (req, res) => {
  try {
    // Note: req.body passes all fields automatically to findByIdAndUpdate, 
    // but destructuring or ensuring category is explicitly handled is safe practice too.
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;