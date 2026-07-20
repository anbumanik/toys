import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/products';
import type { Product } from '../../types/product';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      
      // Ensure we always set an array, even if the API shape changes slightly
      const productArray = Array.isArray(res.data) ? res.data : Array.isArray((res as any).data?.data) ? (res as any).data.data : [];
      setProducts(productArray);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this product and all its images?')) return;
    
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) return <div className="admin-page"><h2>Loading Products...</h2></div>;
  if (error) return <div className="admin-page"><h2 className="form-error">{error}</h2></div>;

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Products Dashboard</h1>
        <Link to="/admin/products/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products found. Add some to get started!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {products.map(product => (
            <div key={product._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0].thumbnailUrl} 
                    alt={product.images[0].altText || product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ color: '#aaa' }}>No Image</span>
                )}
              </div>
              
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
              <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>SKU: {product.sku}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', marginTop: 'auto' }}>
                <strong>₹{product.price?.toFixed(2)}</strong>
                <span style={{ color: product.stock > 0 ? 'green' : 'red' }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/admin/products/${product._id}/edit`} className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '0.5rem' }}>
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(product._id)}
                  style={{ flex: 1, padding: '0.5rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
