import { Building2, Heart, Award, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-[70vh] bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2563EB] rounded-2xl text-white shadow-xl mb-6">
          <Building2 size={40} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6" style={{ fontFamily: 'Outfit' }}>
          About ChildToys
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Welcome to ChildToys! We are India's favorite destination for premium baby toys, educational games, and magical gift items. Our mission is to inspire creativity, learning, and endless joy in every child's life.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left mt-16">
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Heart className="text-[#F97316] mb-4" size={36} />
            <h3 className="text-xl font-bold text-[#111827] mb-3">Made with Love</h3>
            <p className="text-gray-600 leading-relaxed">Every toy we curate is selected with care to ensure it brings happiness and developmental value to your little ones.</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <ShieldCheck className="text-[#2563EB] mb-4" size={36} />
            <h3 className="text-xl font-bold text-[#111827] mb-3">100% Safe</h3>
            <p className="text-gray-600 leading-relaxed">Safety is our top priority. All our products meet international safety standards and are completely child-friendly.</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Award className="text-[#FACC15] mb-4" size={36} />
            <h3 className="text-xl font-bold text-[#111827] mb-3">Premium Quality</h3>
            <p className="text-gray-600 leading-relaxed">We partner with the world's best brands to bring you toys that are durable, beautiful, and timeless.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
