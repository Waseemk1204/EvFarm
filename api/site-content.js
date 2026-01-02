const connectDB = require('./lib/db');
const SiteContent = require('./lib/models/SiteContent');

export default async function handler(req, res) {
    await connectDB();

    const { method } = req;

    // GET /api/site-content
    if (method === 'GET') {
        try {
            const content = await SiteContent.getContents();
            return res.status(200).json(content);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // POST /api/site-content
    if (method === 'POST') {
        try {
            const currentContent = await SiteContent.getContents();
            Object.assign(currentContent, req.body);
            await currentContent.save();
            return res.status(200).json(currentContent);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
