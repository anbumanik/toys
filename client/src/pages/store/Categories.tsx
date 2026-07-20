import CategoryShowcase from '../../components/storefront/CategoryShowcase';
import { Package } from 'lucide-react';

export default function Categories() {
  return (
    <div className="min-h-[70vh] bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <Package className="text-[#F97316]" size={32} />
          <h1 className="text-3xl font-extrabold text-[#111827]" style={{ fontFamily: 'Outfit' }}>
            All Categories
          </h1>
        </div>
        <CategoryShowcase />
      </div>
    </div>
  );
}
