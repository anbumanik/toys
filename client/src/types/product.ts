export interface ProductImage {
  imageId: string;
  imageUrl: string;
  thumbnailUrl: string;
  altText: string;
  order: number;
}

export interface ProductVariant {
  _id?: string;
  color?: string;
  size?: string;
  ageGroup?: string;
  material?: string;
  price?: number;
  stock?: number;
}

export interface ProductShipping {
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  shippingClass?: string;
  charge?: number;
}

export interface ProductSEO {
  title?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface Product {
  _id?: string;
  
  // Basic Info
  name: string;
  slug?: string;
  brand?: string;
  category: string;
  productType?: 'Simple' | 'Variable';
  shortDescription?: string;
  description: string;

  // Pricing
  price: number;
  salePrice?: number;
  costPrice?: number;
  discount: number;
  tax?: number;

  // Inventory
  sku: string;
  barcode?: string;
  stock: number;
  lowStockAlert?: number;
  stockStatus?: 'In Stock' | 'Out of Stock';

  // Shipping
  shipping?: ProductShipping;

  // Status
  status?: 'Draft' | 'Published';
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;

  // SEO & Reviews
  seo?: ProductSEO;
  enableReviews?: boolean;

  // Images & Variants
  images: ProductImage[];
  variants?: ProductVariant[];

  createdAt?: string;
  updatedAt?: string;
}

export interface PendingImage {
  localId: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  errorMessage?: string;
  result?: ProductImage;
}
