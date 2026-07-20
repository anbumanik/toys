import { useEffect, useState } from 'react';
import { getProducts } from '../api/products';
import type { Product } from '../types/product';
import HeroSlider from '../components/storefront/HeroSlider';
import CategoryShowcase from '../components/storefront/CategoryShowcase';
import FlashSale from '../components/storefront/FlashSale';
import ProductCarousel from '../components/storefront/ProductCarousels';

import CustomerReviews from '../components/storefront/CustomerReviews';


export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 20 })
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading store…</p>
        </div>
      </div>
    );
  }

  const flashSale = products.slice(0, 5);
  const todaysDeals = products.slice(0, 8);
  const newArrivals = products.slice(0, 6);
  const bestSellers = products.slice(2, 10);
  const recommended = products.slice(1, 7);
  const comboOffers = products.slice(3, 9);
  const recentlyViewed = products.slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSlider />

      <div className="bg-white">
        <CategoryShowcase />
      </div>

      <FlashSale products={flashSale} />

      <div className="max-w-7xl mx-auto px-4 space-y-8 py-10">
        <ProductCarousel title="🔥 Today's Deals" products={todaysDeals} />
        <ProductCarousel title="✨ New Arrivals" products={newArrivals} />
        <ProductCarousel title="🏆 Best Sellers" products={bestSellers} />
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-8 py-10">
        <ProductCarousel title="🎁 Combo Offers" products={comboOffers} />
        <ProductCarousel title="💡 Recommended For You" products={recommended} />
        <ProductCarousel title="🕐 Recently Viewed" products={recentlyViewed} />
      </div>

      <CustomerReviews />
    </div>
  );
}
