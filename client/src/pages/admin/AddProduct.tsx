import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import { createProduct } from '../../api/products';
import type { Product } from '../../types/product';

const emptyProduct: Product = {
  name: '',
  category: '',
  description: '',
  price: 0,
  discount: 0,
  stock: 0,
  sku: '',
  images: [],
  status: 'Draft', // Default to Draft for new products
  enableReviews: true,
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (productData: Product) => {
    setError(null);
    if (!productData.images.length) {
      setError('Please upload at least one product image.');
      return;
    }

    setSaving(true);
    try {
      const created = await createProduct(productData);
      navigate(`/admin/products/${created._id}/edit`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'Outfit' }}>Add New Product</h1>
      </div>
      <ProductForm 
        initialData={emptyProduct} 
        onSave={handleSave} 
        saving={saving} 
        error={error} 
        submitLabel="Create Product" 
      />
    </div>
  );
}
