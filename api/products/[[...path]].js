const connectDB = require('./lib/db');
const Product = require('./lib/models/Product');

export default async function handler(req, res) {
    await connectDB();

    const { method } = req;
    const path = req.query.path || [];
    const pathString = Array.isArray(path) ? path.join('/') : path;

    // GET /api/products
    if (method === 'GET' && pathString === '') {
        try {
            const products = await Product.find({ isActive: true }).sort({ createdAt: 1 });
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // GET /api/products/featured
    if (method === 'GET' && pathString === 'featured') {
        try {
            const products = await Product.find({ isActive: true })
                .sort({ createdAt: 1 })
                .limit(3);
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // GET /api/products/:id
    if (method === 'GET' && pathString && pathString !== 'featured') {
        try {
            const product = await Product.findById(pathString);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // POST /api/products
    if (method === 'POST') {
        try {
            const product = new Product(req.body);
            const savedProduct = await product.save();
            return res.status(201).json(savedProduct);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // PUT /api/products/:id
    if (method === 'PUT' && pathString) {
        try {
            const product = await Product.findByIdAndUpdate(pathString, req.body, { new: true });
            if (!product) return res.status(404).json({ message: 'Product not found' });
            return res.status(200).json(product);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // DELETE /api/products/:id
    if (method === 'DELETE' && pathString) {
        try {
            const product = await Product.findByIdAndDelete(pathString);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            return res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
