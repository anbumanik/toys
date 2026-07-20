const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const fs = require('fs');
const path = require('path');

const deleteLocalImage = async (imageId) => {
  try {
    const filepath = path.join(__dirname, '..', 'uploads', imageId);
    if (fs.existsSync(filepath)) {
      await fs.promises.unlink(filepath);
    }
  } catch (err) {
    console.error(`Failed to delete local image ${imageId}:`, err.message);
  }
};

/**
 * POST /api/products
 * Creates a product. Expects `images[]` already uploaded via /api/upload/image,
 * with the returned { imageId, imageUrl, thumbnailUrl } objects passed in the body.
 */
const createProduct = asyncHandler(async (req, res) => {
  const { images = [], ...productData } = req.body;

  if (images.length > 10) {
    return res.status(400).json({ success: false, message: 'A product cannot have more than 10 images' });
  }

  // Duplicate-image prevention: no repeated imageId within the same product
  const ids = images.map((img) => img.imageId);
  if (new Set(ids).size !== ids.length) {
    return res.status(400).json({ success: false, message: 'Duplicate images are not allowed on the same product' });
  }

  const product = await Product.create({
    ...productData,
    images: images.map((img, idx) => ({ ...img, order: img.order ?? idx })),
  });

  res.status(201).json({ success: true, data: product });
});

/**
 * GET /api/products
 * Supports pagination, category filter, and text search — needed to scale to 100k+ products.
 * Query params: page, limit, category, search, sort
 */
const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.$text = { $search: req.query.search };

  const sort = req.query.sort ? JSON.parse(req.query.sort) : { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

/**
 * GET /api/products/:id
 */
const getProductById = asyncHandler(async (req, res) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  const filter = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

  const product = await Product.findOne(filter).lean();
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
});

/**
 * PUT /api/products/:id
 * Updates product fields. If `images[]` is provided, it fully replaces the current
 * image set — any Cloudflare images that were removed are deleted from Cloudflare
 * to keep storage in sync (no orphaned images).
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const { images, ...updateData } = req.body;

  if (images) {
    if (images.length > 10) {
      return res.status(400).json({ success: false, message: 'A product cannot have more than 10 images' });
    }
    const ids = images.map((img) => img.imageId);
    if (new Set(ids).size !== ids.length) {
      return res.status(400).json({ success: false, message: 'Duplicate images are not allowed on the same product' });
    }

    // Diff old vs new image sets; delete removed images from Cloudflare (image replace/delete sync)
    const oldIds = new Set(product.images.map((img) => img.imageId));
    const newIds = new Set(ids);
    const removedIds = [...oldIds].filter((id) => !newIds.has(id));

    await Promise.allSettled(removedIds.map((id) => deleteLocalImage(id)));

    product.images = images.map((img, idx) => ({ ...img, order: img.order ?? idx }));
  }

  Object.assign(product, updateData);

  await product.save();
  res.json({ success: true, data: product });
});

/**
 * DELETE /api/products/:id
 * Deletes the product and all of its images from Cloudflare Images (cleanup sync).
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  await Promise.allSettled(product.images.map((img) => deleteLocalImage(img.imageId)));
  await product.deleteOne();

  res.json({ success: true, message: 'Product and associated images deleted' });
});

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
