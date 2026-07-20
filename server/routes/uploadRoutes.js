const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadProductImages, deleteProductImage } = require('../controllers/uploadController');

const router = express.Router();

// POST /api/upload/image  (multipart/form-data, field name: "images", up to 10 files)
router.post('/image', protect, adminOnly, upload.array('images', 10), uploadProductImages);

// DELETE /api/upload/image/:imageId
router.delete('/image/:imageId', protect, adminOnly, deleteProductImage);

module.exports = router;
