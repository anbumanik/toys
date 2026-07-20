const mongoose = require('mongoose');
const slugify = require('slugify');
const crypto = require('crypto');

const imageSchema = new mongoose.Schema(
  {
    imageId: { type: String, required: true }, // Local or Cloud ID
    imageUrl: { type: String, required: true }, // Full size URL
    thumbnailUrl: { type: String, required: true }, // Thumbnail URL
    altText: { type: String, default: '', trim: true, maxlength: 150 },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    color: { type: String, trim: true },
    size: { type: String, trim: true },
    ageGroup: { type: String, trim: true },
    material: { type: String, trim: true },
    price: { type: Number, min: 0 },
    stock: { type: Number, min: 0, default: 0 },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true, maxlength: 200, index: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    brand: { type: String, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    productType: { type: String, enum: ['Simple', 'Variable'], default: 'Simple' },
    shortDescription: { type: String, trim: true, maxlength: 500 },
    description: { type: String, required: true, trim: true },

    // Images
    images: {
      type: [imageSchema],
      default: [],
      validate: [arr => arr.length <= 10, 'A product cannot have more than 10 images.'],
    },

    // Pricing
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    tax: { type: Number, default: 0, min: 0 },

    // Inventory
    sku: { type: String, unique: true, uppercase: true, trim: true },
    barcode: { type: String, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockAlert: { type: Number, min: 0, default: 5 },
    stockStatus: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' },

    // Variants
    variants: [variantSchema],

    // Shipping
    shipping: {
      weight: { type: Number, min: 0 },
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      shippingClass: { type: String, trim: true },
      charge: { type: Number, default: 0, min: 0 },
    },

    // Status
    status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },

    // SEO
    seo: {
      title: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      metaKeywords: { type: String, trim: true },
    },

    // Reviews
    enableReviews: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text', 'seo.metaKeywords': 'text' });

// Auto-generate Slug and SKU
productSchema.pre('validate', async function generateFields(next) {
  // Slug Generation
  if (this.isModified('name') || !this.slug) {
    const base = slugify(this.name || '', { lower: true, strict: true });
    let candidate = base || 'product';
    let counter = 1;

    const Product = mongoose.model('Product');
    while (await Product.exists({ slug: candidate, _id: { $ne: this._id } })) {
      candidate = `${base}-${counter++}`;
    }
    this.slug = candidate;
  }

  // Auto SKU Generation (if empty)
  if (!this.sku) {
    const prefix = (this.category ? this.category.substring(0, 3).toUpperCase() : 'TOY');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
    this.sku = `${prefix}-${random}`;
  }

  next();
});

// Calculate stock status automatically
productSchema.pre('save', function normalizeStock(next) {
  if (this.isModified('stock')) {
    this.stockStatus = this.stock > 0 ? 'In Stock' : 'Out of Stock';
  }
  
  if (this.isModified('images')) {
    this.images
      .sort((a, b) => a.order - b.order)
      .forEach((img, idx) => {
        img.order = idx;
      });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
