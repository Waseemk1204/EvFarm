import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    seating: { type: Number, required: true },
    tagline: { type: String, required: true },
    image: { type: String, required: true },
    imageFit: { type: String, enum: ['contain', 'cover'], default: 'contain' },
    power: { type: String, required: true },
    range: { type: String, required: true },
    battery: { type: String, required: true },
    chargingTime: { type: String, required: true },
    tires: { type: String, required: true },
    braking: { type: String, required: true },
    steering: { type: String, required: true },
    lights: { type: String, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
