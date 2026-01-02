import { put } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Parse multipart form data
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Extract file from multipart data
        const boundary = req.headers['content-type'].split('boundary=')[1];
        const parts = buffer.toString().split('--' + boundary);

        let fileBuffer = null;
        let filename = 'upload.jpg';

        for (const part of parts) {
            if (part.includes('filename=')) {
                const filenameMatch = part.match(/filename="([^"]+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }

                // Extract binary data after headers
                const headerEnd = part.indexOf('\r\n\r\n');
                if (headerEnd !== -1) {
                    const dataStart = headerEnd + 4;
                    const dataEnd = part.lastIndexOf('\r\n');
                    fileBuffer = Buffer.from(part.slice(dataStart, dataEnd), 'binary');
                }
            }
        }

        if (!fileBuffer) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Vercel Blob
        const blob = await put(filename, fileBuffer, {
            access: 'public',
        });

        return res.status(200).json({ url: blob.url });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: error.message });
    }
}
