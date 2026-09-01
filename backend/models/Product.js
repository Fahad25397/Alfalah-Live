const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true }, // e.g., "500g", "1000g"
  price: { type: Number, required: true },  // e.g., 15, 28
  isSale: { type: Boolean, default: false },
  oldPrice: { type: Number },
  outOfStock: { type: Boolean, default: false }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  urduName: { type: String, default: '' },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 }, // Order in which products are displayed
  variants: [variantSchema] // Stores multiple weight & price options
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);