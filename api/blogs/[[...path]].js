const connectDB = require('./lib/db');
const Blog = require('./lib/models/Blog');

export default async function handler(req, res) {
    await connectDB();

    const { method } = req;
    const path = req.query.path || [];
    const pathString = Array.isArray(path) ? path.join('/') : path;

    // GET /api/blogs
    if (method === 'GET' && pathString === '') {
        try {
            const { all } = req.query;
            const filter = all === 'true' ? {} : { isPublished: true };
            const blogs = await Blog.find(filter).sort({ createdAt: -1 });
            return res.status(200).json(blogs);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // GET /api/blogs/:id
    if (method === 'GET' && pathString) {
        try {
            const blog = await Blog.findById(pathString);
            if (!blog) return res.status(404).json({ message: 'Blog not found' });
            return res.status(200).json(blog);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // POST /api/blogs
    if (method === 'POST') {
        try {
            const blog = new Blog(req.body);
            const savedBlog = await blog.save();
            return res.status(201).json(savedBlog);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // PUT /api/blogs/:id
    if (method === 'PUT' && pathString) {
        try {
            const blog = await Blog.findByIdAndUpdate(pathString, req.body, { new: true });
            if (!blog) return res.status(404).json({ message: 'Blog not found' });
            return res.status(200).json(blog);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // DELETE /api/blogs/:id
    if (method === 'DELETE' && pathString) {
        try {
            const blog = await Blog.findByIdAndDelete(pathString);
            if (!blog) return res.status(404).json({ message: 'Blog not found' });
            return res.status(200).json({ message: 'Blog deleted' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
