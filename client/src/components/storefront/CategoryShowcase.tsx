import { Link } from 'react-router-dom';
import { Laptop, Gamepad2, Gift, Watch } from 'lucide-react';

const categories = [
  { id: 1, name: 'Fancy Gadgets', value: 'Fancy gadgets', icon: Laptop, bg: 'bg-[#2563EB]', hover: 'hover:bg-[#1d4ed8]' },
  { id: 2, name: 'Toys & Gaming', value: 'Toys and Gaming', icon: Gamepad2, bg: 'bg-[#F97316]', hover: 'hover:bg-[#ea6b0b]' },
  { id: 3, name: 'Gift Items',    value: 'Gift Items', icon: Gift, bg: 'bg-[#FACC15]', hover: 'hover:bg-[#eab308]', dark: true },
  { id: 4, name: 'Watches',       value: 'Watches', icon: Watch, bg: 'bg-[#111827]', hover: 'hover:bg-gray-700' },
];

export default function CategoryShowcase() {
  return (
    <section className="py-8 sm:py-10 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]" style={{ fontFamily: 'Outfit' }}>
          Shop by Category
        </h2>
        <p className="text-[#6B7280] text-xs sm:text-sm mt-1">Find the perfect toy for every little one</p>
      </div>

      {/* 2x2 Grid on mobile, very compact so all 4 fit on screen at once */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.value)}`}
              className={`${cat.bg} ${cat.hover} group rounded-2xl py-5 px-3 sm:p-8 flex flex-col items-center justify-center gap-2 sm:gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center border border-transparent hover:border-white/20`}
            >
              <div className={`transition-transform duration-300 group-hover:scale-110 drop-shadow-sm ${cat.dark ? 'text-[#111827]' : 'text-white'}`}>
                <Icon className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={2.5} />
              </div>
              <span className={`font-extrabold text-[13px] sm:text-base leading-tight tracking-wide ${cat.dark ? 'text-[#111827]' : 'text-white'}`}>
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
