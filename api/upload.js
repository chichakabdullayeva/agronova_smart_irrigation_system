import { uploadToCloudinary } from './_utils/cloudinary.js';
import { parseFormBody } from './_utils/bodyParser.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    // Parse the multipart form data
    const body = await parseFormBody(req);
    const fields = body.fields || {};
    const files = body.files || {};

    const file = files.file || fields.file;
    const type = fields.type || 'image';

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    // Get the file buffer
    let buffer;
    if (file._writeStream) {
      // Formidable file object
      const fs = await import('fs');
      buffer = fs.readFileSync(file.filepath);
    } else if (Buffer.isBuffer(file)) {
      buffer = file;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, {
      resource_type: type === 'video' ? 'video' : 'image',
      format: type === 'video' ? 'mp4' : 'jpg'
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
}