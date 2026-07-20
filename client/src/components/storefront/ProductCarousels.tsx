import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { Baby, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getFinalPrice } from '../../utils/price';

interface Props {
  title: string;
  products: Product[];
  dark?: boolean;
}

export default function ProductCarousel({ title, products, dark = false }: Props) {
  const { addToCart } = useCart();
  if (!products || products.length === 0) return null;

  return (
    <div className="py-2">
      {title && (
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <h2
            className={`text-lg sm:text-2xl font-extrabold ${dark ? 'text-white' : 'text-[#111827]'}`}
            style={{ fontFamily: 'Outfit' }}
          >
            {title}
          </h2>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-[#2563EB]/20 to-transparent rounded-full" />
          <Link to="/shop" className="text-[10px] sm:text-xs font-bold text-[#F97316] hover:text-[#ea6b0b] transition whitespace-nowrap">
            View All →
          </Link>
        </div>
      )}
      {/* Container with snap scrolling for better mobile UX */}
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
        {products.map(product => (
          <Link
            key={product._id}
            to={`/product/${product.slug || product._id}`}
            className="snap-start shrink-0 min-w-[100px] max-w-[100px] sm:min-w-[220px] sm:max-w-[220px] bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#2563EB]/20 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-24 sm:h-44 bg-[#F8FAFC] overflow-hidden">
              {product.discount > 0 && (
                <span className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 bg-[#F97316] text-white text-[8px] sm:text-[11px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow">
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
                  <Baby className="w-6 h-6 sm:w-12 sm:h-12 opacity-20" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2 sm:p-3 flex flex-col flex-1">
              <span className="text-[8px] sm:text-[11px] font-bold text-[#2563EB] uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
                {product.category}
              </span>
              <h3 className="font-bold text-[#111827] text-[10px] sm:text-sm leading-tight sm:leading-snug mb-1.5 sm:mb-2 line-clamp-2">
                {product.name}
              </h3>

              <div className="mt-auto flex items-end justify-between gap-1">
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-base font-extrabold text-[#111827] leading-none">
                    ₹{getFinalPrice(product).toFixed(0)}
                  </span>
                  {getFinalPrice(product) < product.price && (
                    <span className="text-[8px] sm:text-xs text-gray-400 line-through mt-0.5">
                      ₹{product.price.toFixed(0)}
                    </span>
                  )}
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); addToCart(product); }}
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow hover:shadow-blue-300 transition-all shrink-0"
                >
                  <Plus className="w-3 h-3 sm:w-[18px] sm:h-[18px]" strokeWidth={3} />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
