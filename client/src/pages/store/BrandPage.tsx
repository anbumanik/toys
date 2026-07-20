import { Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const brands = [
  { name: 'LEGO', color: 'bg-red-500' },
  { name: 'Fisher-Price', color: 'bg-blue-500' },
  { name: 'Hasbro', color: 'bg-purple-500' },
  { name: 'Mattel', color: 'bg-pink-500' },
  { name: 'Hot Wheels', color: 'bg-orange-500' },
  { name: 'Barbie', color: 'bg-pink-400' },
  { name: 'Nerf', color: 'bg-orange-600' },
  { name: 'Play-Doh', color: 'bg-yellow-500' },
];

export default function BrandPage() {
  return (
    <div className="min-h-[70vh] bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <Tag className="text-[#2563EB]" size={32} />
          <h1 className="text-3xl font-extrabold text-[#111827]" style={{ fontFamily: 'Outfit' }}>
            Our Brands
          </h1>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {brands.map((brand, i) => (
            <Link
              key={i}
              to={`/shop?brand=${brand.name.toLowerCase().replace(' ', '-')}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-[#2563EB]/30 transition-all p-8 flex flex-col items-center justify-center gap-4 group"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${brand.color} group-hover:scale-110 transition-transform`}>
                {brand.name[0]}
              </div>
              <span className="font-bold text-gray-800 text-lg group-hover:text-[#2563EB]">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
