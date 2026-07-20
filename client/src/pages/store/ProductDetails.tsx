import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../../api/products';
import type { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { getFinalPrice } from '../../utils/price';
import { ShoppingCart, Package, ShieldCheck, ChevronRight, Home } from 'lucide-react';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProduct(slug)
      .then(res => setProduct(res as any)) // Our api returns res.data but type says Product, actually returns Product directly because of api wrapper
      .catch(err => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link to="/shop" className="mt-4 text-blue-600 font-bold hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="bg-gray-50 min-h-[80vh] py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600"><Home size={16} /></Link>
          <ChevronRight size={16} />
          <Link to="/shop" className="hover:text-blue-600">Shop</Link>
          <ChevronRight size={16} />
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left: Image Gallery */}
          <div className="md:w-1/2 bg-[#F8FAFC] p-8 flex items-center justify-center relative min-h-[400px]">
            {product.discount > 0 && (
              <span className="absolute top-6 left-6 z-10 bg-[#F97316] text-white text-sm font-extrabold px-3 py-1 rounded-full shadow-lg">
                -{product.discount}% OFF
              </span>
            )}
            {product.images?.[0] ? (
              <img 
                src={product.images[0].imageUrl} 
                alt={product.name} 
                className="max-w-full max-h-[500px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="text-gray-400 font-bold">No Image</div>
            )}
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <span className="text-blue-600 font-extrabold uppercase tracking-widest text-sm mb-2">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-gray-100">
              <span className="text-4xl font-extrabold text-gray-900">₹{getFinalPrice(product).toFixed(0)}</span>
              {getFinalPrice(product) < product.price && (
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.price.toFixed(0)}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4 mb-10 flex-1">
              <div className="flex items-center gap-3 text-gray-700 font-medium">
                <Package className="text-orange-500" /> 
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-gray-700 font-medium">
                <ShieldCheck className="text-blue-500" /> 100% Genuine & Safe for Kids
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border-2 border-gray-200 rounded-full bg-gray-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-600 hover:text-blue-600 transition-colors"
                >-</button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-600 hover:text-blue-600 transition-colors"
                >+</button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-full font-bold text-lg transition-all shadow-lg ${
                  product.stock > 0 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-300' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
