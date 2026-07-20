import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import { getProduct, updateProduct, deleteProduct } from '../../api/products';
import type { Product } from '../../types/product';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(setProduct)
      .catch(() => setError('Failed to load product.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (productData: Product) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProduct(id, productData);
      setProduct(updated);
      alert('Product saved successfully!');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this product and all its images? This cannot be undone.')) return;
    await deleteProduct(id);
    navigate('/admin/products');
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading product data...</div>;
  if (error && !product) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'Outfit' }}>Edit Product</h1>
      </div>
      <ProductForm 
        initialData={product} 
        onSave={handleSave} 
        onDelete={handleDelete}
        saving={saving} 
        error={error} 
        submitLabel="Save Changes" 
      />
    </div>
  );
}
