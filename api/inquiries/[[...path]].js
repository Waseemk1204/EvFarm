const connectDB = require('./lib/db');
const Inquiry = require('./lib/models/Inquiry');

export default async function handler(req, res) {
    await connectDB();

    const { method } = req;
    const path = req.query.path || [];
    const pathArray = Array.isArray(path) ? path : [path];
    const id = pathArray[0] || '';
    const action = pathArray[1] || '';

    // GET /api/inquiries
    if (method === 'GET' && !id) {
        try {
            const inquiries = await Inquiry.find().sort({ createdAt: -1 });
            return res.status(200).json(inquiries);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // POST /api/inquiries
    if (method === 'POST' && !id) {
        try {
            const inquiry = new Inquiry(req.body);
            const savedInquiry = await inquiry.save();
            return res.status(201).json(savedInquiry);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // PATCH /api/inquiries/:id/status
    if (method === 'PATCH' && id && action === 'status') {
        try {
            const { status } = req.body;
            const inquiry = await Inquiry.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );
            if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
            return res.status(200).json(inquiry);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // DELETE /api/inquiries/:id
    if (method === 'DELETE' && id) {
        try {
            const inquiry = await Inquiry.findByIdAndDelete(id);
            if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
            return res.status(200).json({ message: 'Inquiry deleted' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
