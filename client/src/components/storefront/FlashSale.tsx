import { useState, useEffect, Fragment } from 'react';
import type { Product } from '../../types/product';
import ProductCarousel from './ProductCarousels';
import { Zap } from 'lucide-react';

export default function FlashSale({ products }: { products: Product[] }) {
  const [timeLeft, setTimeLeft] = useState(3600 * 4);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  if (!products.length) return null;

  return (
    <section className="bg-[#2563EB] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FACC15] rounded-xl flex items-center justify-center text-[#111827] shadow-md animate-bounce">
              <Zap size={24} className="fill-[#111827]" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white leading-none" style={{ fontFamily: 'Outfit' }}>
                Flash Sale
              </h2>
              <p className="text-blue-200 text-xs font-medium">Limited stocks — grab yours now!</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-blue-200 text-sm font-semibold">Ends in:</span>
            {[pad(h), pad(m), pad(s)].map((unit, i) => (
              <Fragment key={i}>
                <div className="bg-white text-[#2563EB] font-black text-lg w-11 h-11 rounded-xl flex items-center justify-center shadow-md">
                  {unit}
                </div>
                {i < 2 && <span className="text-[#FACC15] font-black text-xl">:</span>}
              </Fragment>
            ))}
          </div>
        </div>

        <ProductCarousel title="" products={products} dark />
      </div>
    </section>
  );
}
