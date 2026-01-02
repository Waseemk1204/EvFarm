const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'EVFARM Team' },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
