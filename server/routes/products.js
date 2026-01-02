const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ createdAt: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get featured products (for Home page - first 3 products by creation date)
router.get('/featured', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .sort({ createdAt: 1 })
            .limit(3);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate PDF brochure for a product
router.get('/:id/brochure', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Create PDF document
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${product.name.replace(/\s+/g, '_')}_Brochure.pdf`);

        // Pipe to response
        doc.pipe(res);

        // Header
        doc.fontSize(10).fillColor('#D4AF37').text('EVFARM INDIA', 50, 50);
        doc.fontSize(8).fillColor('#666').text('Premium Electric Golf Carts', 50, 65);

        // Title
        doc.moveDown(2);
        doc.fontSize(28).fillColor('#14211A').text(product.name, { align: 'center' });
        doc.fontSize(12).fillColor('#666').text(product.tagline, { align: 'center' });

        // Horizontal line
        doc.moveDown(1);
        doc.strokeColor('#D4AF37').lineWidth(2)
            .moveTo(50, doc.y).lineTo(545, doc.y).stroke();

        // Specifications Section
        doc.moveDown(2);
        doc.fontSize(14).fillColor('#D4AF37').text('SPECIFICATIONS');
        doc.moveDown(0.5);

        const specs = [
            { label: 'Seating Capacity', value: `${product.seating} Passengers` },
            { label: 'Top Speed', value: product.speed },
            { label: 'Range', value: product.range },
            { label: 'Battery Type', value: product.batteryType },
            { label: 'Battery Capacity', value: product.batteryCapacity },
            { label: 'Motor Power', value: product.motorPower },
            { label: 'Charging Time', value: product.chargingTime },
            { label: 'Dimensions', value: product.dimensions },
            { label: 'Ground Clearance', value: product.groundClearance }
        ];

        specs.forEach(spec => {
            doc.fontSize(10).fillColor('#14211A').text(spec.label + ':', { continued: true });
            doc.fillColor('#666').text('  ' + spec.value);
            doc.moveDown(0.3);
        });

        // Features Section
        if (product.features && product.features.length > 0) {
            doc.moveDown(1);
            doc.fontSize(14).fillColor('#D4AF37').text('KEY FEATURES');
            doc.moveDown(0.5);

            product.features.forEach(feature => {
                doc.fontSize(10).fillColor('#666').text('• ' + feature);
                doc.moveDown(0.2);
            });
        }

        // Footer
        doc.moveDown(3);
        doc.strokeColor('#eee').lineWidth(1)
            .moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(8).fillColor('#999').text('EVFARM India | Premium Electric Mobility Solutions', { align: 'center' });
        doc.text('Contact: contact@evfarm.in | www.evfarm.in', { align: 'center' });

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product (Admin)
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update product (Admin)
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete product (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
