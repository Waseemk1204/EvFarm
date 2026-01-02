const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    seating: { type: Number, required: true },
    tagline: { type: String, required: true },
    image: { type: String, required: true },
    speed: { type: String, required: true },
    range: { type: String, required: true },
    batteryType: { type: String, required: true },
    batteryCapacity: { type: String, required: true },
    motorPower: { type: String, required: true },
    chargingTime: { type: String, required: true },
    dimensions: { type: String, required: true },
    groundClearance: { type: String, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
