const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');

const MAX_DIMENSION = 2000; // px, cap before upload to keep storage/bandwidth sane

/**
 * Compress + normalize an incoming image buffer before it leaves our server.
 * Pre-compressing keeps the file small (faster upload, lower storage).
 */
async function compressBuffer(buffer) {
  return sharp(buffer)
    .rotate() // respect EXIF orientation
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true }) // safe universal intermediate format; CF re-encodes on delivery
    .toBuffer();
}

/**
 * POST /api/upload/image
 * Accepts one or more images (multipart/form-data, field name "images"),
 * compresses each, uploads to Cloudflare Images, and returns the resulting
 * image metadata (imageId, imageUrl, thumbnailUrl) for the client to attach
 * to a product's `images[]` array.
 *
 * Admin-only (enforced by route middleware).
 */
const uploadProductImages = asyncHandler(async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);

  if (!files.length) {
    return res.status(400).json({ success: false, message: 'No image files provided' });
  }
  if (files.length > 10) {
    return res.status(400).json({ success: false, message: 'Maximum 10 images allowed per upload' });
  }

  const results = [];
  const failures = [];

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  for (const file of files) {
    try {
      const compressed = await compressBuffer(file.buffer);
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = uniqueSuffix + '.jpg';
      const filepath = path.join(uploadsDir, filename);
      
      await fs.promises.writeFile(filepath, compressed);

      results.push({
        imageId: filename, // Use filename as the ID
        imageUrl: `/uploads/${filename}`,
        thumbnailUrl: `/uploads/${filename}`, // No separate thumbnail generation for now, browser will scale
        altText: '',
        order: 0,
      });
    } catch (err) {
      failures.push({ file: file.originalname, error: err.message });
    }
  }

  res.status(results.length ? 201 : 502).json({
    success: results.length > 0,
    uploaded: results,
    failed: failures,
  });
});

/**
 * DELETE /api/upload/image/:imageId
 * Removes an image from the local uploads folder. The caller (client or productController)
 * is responsible for also removing the reference from the product's images[] array.
 *
 * Admin-only.
 */
const deleteProductImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const filepath = path.join(__dirname, '..', 'uploads', imageId);
  
  if (fs.existsSync(filepath)) {
    await fs.promises.unlink(filepath);
  }
  
  res.json({ success: true, message: `Image ${imageId} deleted from local storage` });
});

module.exports = { uploadProductImages, deleteProductImage };
