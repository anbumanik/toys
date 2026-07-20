import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { Baby, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getFinalPrice } from '../../utils/price';

export default function ProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart();
  if (!products.length) {
    return <div className="text-center py-20 text-gray-500">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map(product => (
        <Link
          key={product._id}
          to={`/product/${product.slug || product._id}`}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#2563EB]/20 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden group"
        >
          {/* Image */}
          <div className="relative h-48 bg-[#F8FAFC] overflow-hidden">
            {product.discount > 0 && (
              <span className="absolute top-2 left-2 z-10 bg-[#F97316] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow">
                -{product.discount}%
              </span>
            )}
            {product.images?.[0] ? (
              <img
                src={product.images[0].thumbnailUrl}
                alt={product.images[0].altText || product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#2563EB]">
                <Baby size={48} className="opacity-20" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 flex flex-col flex-1">
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wide mb-1">{product.category}</span>
            <h3 className="font-bold text-[#111827] text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>

            <div className="mt-auto flex items-center justify-between">
              <div>
              <span className="text-base font-extrabold text-[#111827]">₹{getFinalPrice(product).toFixed(0)}</span>
              {getFinalPrice(product) < product.price && (
                <span className="text-xs text-gray-400 line-through ml-1">
                  ₹{product.price.toFixed(0)}
                </span>
              )}
              </div>
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  addToCart(product);
                  // Optional: add a tiny toast/visual feedback here in the future
                }}
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white w-8 h-8 rounded-full flex items-center justify-center text-base font-bold shadow hover:shadow-blue-300 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
