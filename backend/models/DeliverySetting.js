const mongoose = require('mongoose');

const deliverySettingSchema = new mongoose.Schema({
  category: { type: String, required: true },
  weight: { type: String, required: true },
  charge: { type: Number, required: true, default: 0 }
}, { timestamps: true });

// Ensure unique combination of category and weight
deliverySettingSchema.index({ category: 1, weight: 1 }, { unique: true });

module.exports = mongoose.model('DeliverySetting', deliverySettingSchema);
