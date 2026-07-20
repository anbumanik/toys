import React, { useState } from 'react';
import type { Product, ProductImage } from '../../types/product';
import { Save, AlertCircle, Trash2 } from 'lucide-react';

interface ProductFormProps {
  initialData: Product;
  onSave: (product: Product) => Promise<void>;
  onDelete?: () => Promise<void>;
  saving: boolean;
  error: string | null;
  submitLabel: string;
}

type Tab = 'basic' | 'images' | 'pricing' | 'inventory' | 'shipping' | 'toys' | 'seo' | 'status';

export default function ProductForm({
  initialData,
  onSave,
  onDelete,
  saving,
  error,
  submitLabel,
}: ProductFormProps) {
  const [product, setProduct] = useState<Product>(initialData);
  const [activeTab, setActiveTab] = useState<Tab>('basic');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'images', label: 'Images' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'seo', label: 'SEO' },
    { id: 'status', label: 'Status & Visibility' },
  ];

  const handleField = (key: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedField = (parent: keyof Product, key: string, value: any) => {
    setProduct((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any || {}),
        [key]: value
      }
    }));
  };

  const handlePriceChange = (field: 'price' | 'salePrice' | 'discount', value: number | undefined) => {
    let { price = 0, salePrice, discount = 0 } = product;

    if (field === 'price') {
      price = value || 0;
      if (discount > 0) {
        salePrice = price - (price * (discount / 100));
      } else if (salePrice) {
        discount = ((price - salePrice) / price) * 100;
      }
    } else if (field === 'salePrice') {
      salePrice = value;
      if (price > 0 && salePrice && salePrice < price) {
        discount = ((price - salePrice) / price) * 100;
      } else {
        discount = 0;
      }
    } else if (field === 'discount') {
      discount = value || 0;
      if (price > 0) {
        salePrice = price - (price * (discount / 100));
      }
    }

    setProduct(prev => ({
      ...prev,
      price,
      salePrice: salePrice ? Number(Number(salePrice).toFixed(2)) : undefined,
      discount: discount ? Number(Number(discount).toFixed(2)) : 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-bold text-slate-800">{product.name || 'New Product'}</h2>
        <div className="flex gap-3">
          {onDelete && (
            <button 
              type="button" 
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>

      {error && (
        <div className="m-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex gap-3 items-center">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition font-medium text-sm ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {/* BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Name *</label>
                <input required value={product.name} onChange={e => handleField('name', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category *</label>
                <select required value={product.category || ''} onChange={e => handleField('category', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white">
                  <option value="" disabled>Select a category</option>
                  <option value="Fancy gadgets">Fancy gadgets</option>
                  <option value="Watches">Watches</option>
                  <option value="Toys and Gaming">Toys and Gaming</option>
                  <option value="Gift Items">Gift Items</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Brand</label>
                  <input value={product.brand || ''} onChange={e => handleField('brand', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Product Type</label>
                  <select value={product.productType || 'Simple'} onChange={e => handleField('productType', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                    <option value="Simple">Simple Product</option>
                    <option value="Variable">Variable Product (Variants)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
                <textarea rows={2} value={product.shortDescription || ''} onChange={e => handleField('shortDescription', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Description *</label>
                <textarea required rows={6} value={product.description} onChange={e => handleField('description', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
            </div>
          )}

          {/* IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm">
                Provide a direct URL to the product image.
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Image URL *</label>
                <input 
                  type="url" 
                  required 
                  value={product.images?.[0]?.imageUrl || ''} 
                  onChange={e => handleField('images', [{ 
                    imageId: product.images?.[0]?.imageId || 'url-' + Date.now(), 
                    imageUrl: e.target.value, 
                    thumbnailUrl: e.target.value, 
                    altText: product.name, 
                    order: 0 
                  }])} 
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              
              {product.images?.[0]?.imageUrl && (
                <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 inline-block">
                  <p className="text-sm font-bold text-slate-700 mb-2">Image Preview</p>
                  <img src={product.images[0].imageUrl} alt="Preview" className="h-48 object-contain rounded-lg border border-slate-200 bg-white" />
                </div>
              )}
            </div>
          )}

          {/* PRICING */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Regular Price (₹) *</label>
                  <input required type="number" min="0" step="0.01" value={product.price || ''} onChange={e => handlePriceChange('price', Number(e.target.value))} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Sale Price (₹)</label>
                  <input type="number" min="0" step="0.01" value={product.salePrice || ''} onChange={e => handlePriceChange('salePrice', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Cost Price (₹)</label>
                  <input type="number" min="0" step="0.01" value={product.costPrice || ''} onChange={e => handleField('costPrice', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Discount (%)</label>
                  <input type="number" min="0" max="100" value={product.discount || ''} onChange={e => handlePriceChange('discount', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tax (GST %)</label>
                <input type="number" min="0" value={product.tax || ''} onChange={e => handleField('tax', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2 border border-slate-300 rounded-lg md:w-1/2" />
              </div>
            </div>
          )}

          {/* INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">SKU</label>
                  <input value={product.sku} onChange={e => handleField('sku', e.target.value)} placeholder="Auto-generated if empty" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Barcode</label>
                  <input value={product.barcode || ''} onChange={e => handleField('barcode', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Stock Quantity *</label>
                  <input required type="number" min="0" value={product.stock} onChange={e => handleField('stock', Number(e.target.value))} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Low Stock Alert</label>
                  <input type="number" min="0" value={product.lowStockAlert ?? 5} onChange={e => handleField('lowStockAlert', Number(e.target.value))} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Stock Status</label>
                  <select value={product.stockStatus || 'In Stock'} onChange={e => handleField('stockStatus', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SHIPPING */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Weight (kg)</label>
                  <input type="number" step="0.01" value={product.shipping?.weight || ''} onChange={e => handleNestedField('shipping', 'weight', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Length (cm)</label>
                  <input type="number" step="0.1" value={product.shipping?.length || ''} onChange={e => handleNestedField('shipping', 'length', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Width (cm)</label>
                  <input type="number" step="0.1" value={product.shipping?.width || ''} onChange={e => handleNestedField('shipping', 'width', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Height (cm)</label>
                  <input type="number" step="0.1" value={product.shipping?.height || ''} onChange={e => handleNestedField('shipping', 'height', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Shipping Class</label>
                <input value={product.shipping?.shippingClass || ''} onChange={e => handleNestedField('shipping', 'shippingClass', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg md:w-1/2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Shipping Charge (₹) (0 for Free)</label>
                <input type="number" min="0" value={product.shipping?.charge ?? 0} onChange={e => handleNestedField('shipping', 'charge', e.target.value ? Number(e.target.value) : 0)} className="w-full px-4 py-2 border border-slate-300 rounded-lg md:w-1/2" />
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug</label>
                <input value={product.slug || ''} onChange={e => handleField('slug', e.target.value)} placeholder="Auto-generated if empty" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">SEO Title</label>
                <input value={product.seo?.title || ''} onChange={e => handleNestedField('seo', 'title', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Meta Description</label>
                <textarea rows={3} value={product.seo?.metaDescription || ''} onChange={e => handleNestedField('seo', 'metaDescription', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Meta Keywords</label>
                <input value={product.seo?.metaKeywords || ''} onChange={e => handleNestedField('seo', 'metaKeywords', e.target.value)} placeholder="Comma separated" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
            </div>
          )}

          {/* STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-2 gap-6 p-4 border border-slate-200 rounded-xl bg-slate-50 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Product Status</label>
                  <select value={product.status || 'Published'} onChange={e => handleField('status', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Enable Reviews</label>
                  <select value={product.enableReviews === false ? 'false' : 'true'} onChange={e => handleField('enableReviews', e.target.value === 'true')} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <h3 className="font-bold text-slate-800">Visibility Flags</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                  <input type="checkbox" checked={product.isFeatured || false} onChange={e => handleField('isFeatured', e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                  <span className="font-medium text-slate-700">Featured Product</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                  <input type="checkbox" checked={product.isBestSeller || false} onChange={e => handleField('isBestSeller', e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                  <span className="font-medium text-slate-700">Best Seller</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                  <input type="checkbox" checked={product.isNewArrival || false} onChange={e => handleField('isNewArrival', e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                  <span className="font-medium text-slate-700">New Arrival</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                  <input type="checkbox" checked={product.isTrending || false} onChange={e => handleField('isTrending', e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                  <span className="font-medium text-slate-700">Trending</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                  <input type="checkbox" checked={product.isFlashSale || false} onChange={e => handleField('isFlashSale', e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                  <span className="font-medium text-slate-700">Flash Sale</span>
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </form>
  );
}
