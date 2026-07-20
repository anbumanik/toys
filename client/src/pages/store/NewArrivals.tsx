import { useEffect, useState } from 'react';
import { getProducts } from '../../api/products';
import type { Product } from '../../types/product';
import ProductGrid from '../../components/storefront/ProductGrid';
import { Sparkles } from 'lucide-react';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data.reverse().slice(0, 12))) // just taking some subset reversed
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[70vh] bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <Sparkles className="text-[#2563EB]" size={32} />
          <h1 className="text-3xl font-extrabold text-[#111827]" style={{ fontFamily: 'Outfit' }}>
            New Arrivals
          </h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
