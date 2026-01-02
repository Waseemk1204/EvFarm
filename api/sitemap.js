const connectDB = require('./lib/db');
const Product = require('./lib/models/Product');
const Blog = require('./lib/models/Blog');

export default async function handler(req, res) {
    await connectDB();

    try {
        const baseUrl = 'https://evfarmindia.co.in';

        // Fetch dynamic data
        const products = await Product.find({ isActive: true }).select('_id updatedAt');
        const blogs = await Blog.find({ isPublished: true }).select('_id updatedAt');

        // Static routes
        const routes = [
            { url: '/', changefreq: 'weekly', priority: 1.0 },
            { url: '/products', changefreq: 'weekly', priority: 0.9 },
            { url: '/blogs', changefreq: 'daily', priority: 0.8 },
            { url: '/get-quote', changefreq: 'monthly', priority: 0.7 },
        ];

        // XML Header
        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Add static routes
        routes.forEach(route => {
            xml += `
            <url>
                <loc>${baseUrl}${route.url}</loc>
                <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
                <changefreq>${route.changefreq}</changefreq>
                <priority>${route.priority}</priority>
            </url>`;
        });

        // Add dynamic product routes
        products.forEach(product => {
            xml += `
            <url>
                <loc>${baseUrl}/products/${product._id}</loc>
                <lastmod>${product.updatedAt ? product.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>`;
        });

        // Add dynamic blog routes
        blogs.forEach(blog => {
            xml += `
            <url>
                <loc>${baseUrl}/blogs/${blog._id}</loc>
                <lastmod>${blog.updatedAt ? blog.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.7</priority>
            </url>`;
        });

        xml += '</urlset>';

        res.setHeader('Content-Type', 'application/xml');
        return res.status(200).send(xml);

    } catch (error) {
        console.error('Sitemap generation error:', error);
        return res.status(500).end();
    }
}
