import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    model: { type: String },
    message: { type: String },
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted', 'rejected'],
        default: 'new'
    }
}, { timestamps: true });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
