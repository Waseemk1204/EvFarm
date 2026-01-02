require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');

// Import routes
const productRoutes = require('./routes/products');
const inquiryRoutes = require('./routes/inquiries');
const blogRoutes = require('./routes/blogs');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const siteContentRoutes = require('./routes/siteContent');
const sitemapRoutes = require('./routes/sitemap');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/', sitemapRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
