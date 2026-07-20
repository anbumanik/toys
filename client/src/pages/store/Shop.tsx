import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/products';
import type { Product } from '../../types/product';
import ProductGrid from '../../components/storefront/ProductGrid';
import { ShoppingBag } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    setLoading(true);
    getProducts(category ? { category } : undefined)
      .then(res => {
        const productArray = Array.isArray(res.data) ? res.data : Array.isArray((res as any).data?.data) ? (res as any).data.data : [];
        setProducts(productArray);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-[70vh] bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <ShoppingBag className="text-[#2563EB]" size={32} />
          <h1 className="text-3xl font-extrabold text-[#111827]" style={{ fontFamily: 'Outfit' }}>
            {category ? category : 'All Products'}
          </h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800">No products found</h2>
            <p className="text-gray-500 mt-2">Check back later for new arrivals in this category.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
