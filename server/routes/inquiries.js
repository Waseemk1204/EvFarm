const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// Get all inquiries
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create inquiry (from quote form)
router.post('/', async (req, res) => {
    try {
        const inquiry = new Inquiry(req.body);
        const savedInquiry = await inquiry.save();
        res.status(201).json(savedInquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update inquiry status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
        res.json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete inquiry
router.delete('/:id', async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
        res.json({ message: 'Inquiry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
