const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');

// Get site content
router.get('/', async (req, res) => {
    try {
        const content = await SiteContent.getContents();
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update site content
router.post('/', async (req, res) => {
    try {
        const currentContent = await SiteContent.getContents();
        Object.assign(currentContent, req.body);
        await currentContent.save();
        res.json(currentContent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
