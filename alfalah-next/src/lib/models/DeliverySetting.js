import mongoose from 'mongoose';

const deliverySettingSchema = new mongoose.Schema({
  category: { type: String, required: true },
  weight: { type: String, required: true },
  charge: { type: Number, required: true, default: 0 }
}, { timestamps: true });

deliverySettingSchema.index({ category: 1, weight: 1 }, { unique: true });

export default mongoose.models.DeliverySetting || mongoose.model('DeliverySetting', deliverySettingSchema);
