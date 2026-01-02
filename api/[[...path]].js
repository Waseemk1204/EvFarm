const connectDB = require('./lib/db');

// Import models
const Product = require('./lib/models/Product');
const Blog = require('./lib/models/Blog');
const Inquiry = require('./lib/models/Inquiry');
const AdminSettings = require('./lib/models/AdminSettings');
const SiteContent = require('./lib/models/SiteContent');

// Rate limiting for admin login
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
}

function isLockedOut(ip) {
    const attempts = loginAttempts.get(ip);
    if (!attempts) return false;
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) return true;
    if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
        loginAttempts.delete(ip);
        return false;
    }
    return false;
}

function recordFailedAttempt(ip) {
    const attempts = loginAttempts.get(ip) || { count: 0, lockedUntil: null };
    attempts.count++;
    if (attempts.count >= MAX_ATTEMPTS) {
        attempts.lockedUntil = Date.now() + LOCKOUT_DURATION;
    }
    loginAttempts.set(ip, attempts);
    return attempts;
}

function clearAttempts(ip) {
    loginAttempts.delete(ip);
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await connectDB();

    const { method } = req;
    const pathArray = req.query.path || [];
    const resource = pathArray[0] || '';
    const id = pathArray[1] || '';
    const action = pathArray[2] || '';

    try {
        // ============ PRODUCTS ============
        if (resource === 'products') {
            if (method === 'GET' && !id) {
                const products = await Product.find({ isActive: true }).sort({ createdAt: 1 });
                return res.status(200).json(products);
            }
            if (method === 'GET' && id === 'featured') {
                const products = await Product.find({ isActive: true }).sort({ createdAt: 1 }).limit(3);
                return res.status(200).json(products);
            }
            if (method === 'GET' && id) {
                const product = await Product.findById(id);
                if (!product) return res.status(404).json({ message: 'Product not found' });
                return res.status(200).json(product);
            }
            if (method === 'POST') {
                const product = new Product(req.body);
                const saved = await product.save();
                return res.status(201).json(saved);
            }
            if (method === 'PUT' && id) {
                const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
                if (!product) return res.status(404).json({ message: 'Product not found' });
                return res.status(200).json(product);
            }
            if (method === 'DELETE' && id) {
                const product = await Product.findByIdAndDelete(id);
                if (!product) return res.status(404).json({ message: 'Product not found' });
                return res.status(200).json({ message: 'Product deleted' });
            }
        }

        // ============ BLOGS ============
        if (resource === 'blogs') {
            if (method === 'GET' && !id) {
                const { all } = req.query;
                const filter = all === 'true' ? {} : { isPublished: true };
                const blogs = await Blog.find(filter).sort({ createdAt: -1 });
                return res.status(200).json(blogs);
            }
            if (method === 'GET' && id) {
                const blog = await Blog.findById(id);
                if (!blog) return res.status(404).json({ message: 'Blog not found' });
                return res.status(200).json(blog);
            }
            if (method === 'POST') {
                const blog = new Blog(req.body);
                const saved = await blog.save();
                return res.status(201).json(saved);
            }
            if (method === 'PUT' && id) {
                const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
                if (!blog) return res.status(404).json({ message: 'Blog not found' });
                return res.status(200).json(blog);
            }
            if (method === 'DELETE' && id) {
                const blog = await Blog.findByIdAndDelete(id);
                if (!blog) return res.status(404).json({ message: 'Blog not found' });
                return res.status(200).json({ message: 'Blog deleted' });
            }
        }

        // ============ INQUIRIES ============
        if (resource === 'inquiries') {
            if (method === 'GET' && !id) {
                const inquiries = await Inquiry.find().sort({ createdAt: -1 });
                return res.status(200).json(inquiries);
            }
            if (method === 'POST' && !id) {
                const inquiry = new Inquiry(req.body);
                const saved = await inquiry.save();
                return res.status(201).json(saved);
            }
            if (method === 'PATCH' && id && action === 'status') {
                const { status } = req.body;
                const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
                if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
                return res.status(200).json(inquiry);
            }
            if (method === 'DELETE' && id) {
                const inquiry = await Inquiry.findByIdAndDelete(id);
                if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
                return res.status(200).json({ message: 'Inquiry deleted' });
            }
        }

        // ============ ADMIN ============
        if (resource === 'admin') {
            const ip = getClientIP(req);

            if (method === 'POST' && id === 'login') {
                const { password } = req.body;
                if (isLockedOut(ip)) {
                    const attempts = loginAttempts.get(ip);
                    const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
                    return res.status(429).json({ success: false, error: 'Too many failed attempts', lockedOut: true, remainingMinutes: remainingTime });
                }
                const settings = await AdminSettings.getSettings();
                if (password === settings.password) {
                    clearAttempts(ip);
                    return res.status(200).json({ success: true });
                }
                const attempts = recordFailedAttempt(ip);
                const remaining = MAX_ATTEMPTS - attempts.count;
                if (attempts.lockedUntil) {
                    return res.status(429).json({ success: false, error: 'Too many failed attempts. Account locked for 15 minutes.', lockedOut: true, remainingMinutes: 15 });
                }
                return res.status(401).json({ success: false, error: `Invalid password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`, attemptsRemaining: remaining });
            }

            if (method === 'POST' && id === 'reset-password') {
                const { recoveryKey, newPassword } = req.body;
                const settings = await AdminSettings.getSettings();
                if (recoveryKey !== settings.recoveryKey) {
                    return res.status(401).json({ success: false, error: 'Invalid recovery key' });
                }
                settings.password = newPassword;
                await settings.save();
                return res.status(200).json({ success: true });
            }

            if (method === 'GET' && id === 'lockout-status') {
                const attempts = loginAttempts.get(ip);
                if (!attempts || !attempts.lockedUntil) return res.status(200).json({ lockedOut: false });
                if (Date.now() >= attempts.lockedUntil) {
                    loginAttempts.delete(ip);
                    return res.status(200).json({ lockedOut: false });
                }
                const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
                return res.status(200).json({ lockedOut: true, remainingMinutes: remainingTime });
            }
        }

        // ============ SITE-CONTENT ============
        if (resource === 'site-content') {
            if (method === 'GET') {
                const content = await SiteContent.getContents();
                return res.status(200).json(content);
            }
            if (method === 'POST') {
                const currentContent = await SiteContent.getContents();
                Object.assign(currentContent, req.body);
                await currentContent.save();
                return res.status(200).json(currentContent);
            }
        }

        // ============ HEALTH ============
        if (resource === 'health') {
            return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
        }

        return res.status(404).json({ message: 'Not found' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ message: error.message });
    }
}
