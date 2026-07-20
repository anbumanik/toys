import { Star, CheckCircle2 } from 'lucide-react';

const reviewsRow1 = [
  {
    id: 1, name: 'Priya S.', avatar: 'P', rating: 5,
    text: 'My daughter absolutely loves the toys! Packaging was beautiful and delivery was super fast. Will order again!',
    product: 'LEGO City Builder Set',
  },
  {
    id: 2, name: 'Rahul M.', avatar: 'R', rating: 5,
    text: 'Amazing quality and great value for money. The RC truck was a big hit at my son\'s birthday party!',
    product: 'RC Monster Truck',
  },
  {
    id: 3, name: 'Anjali K.', avatar: 'A', rating: 4,
    text: 'Loved the gift hamper — came in premium packaging and all products were intact. Will recommend to friends.',
    product: 'Premium Gift Hamper',
  },
  {
    id: 4, name: 'Neha R.', avatar: 'N', rating: 5,
    text: 'Customer service was very helpful when I needed to change the delivery address. Top notch experience!',
    product: 'Soft Plush Bear',
  }
];

const reviewsRow2 = [
  {
    id: 5, name: 'Karthik V.', avatar: 'K', rating: 5,
    text: 'Great collection of educational toys. My 3-year-old hasn\'t stopped playing with the wooden puzzles.',
    product: 'Wooden Animal Puzzles',
  },
  {
    id: 6, name: 'Vikas T.', avatar: 'V', rating: 4,
    text: 'Delivery took one extra day, but the toy itself is fantastic and safe for my toddler.',
    product: 'Musical Activity Table',
  },
  {
    id: 7, name: 'Sara W.', avatar: 'S', rating: 5,
    text: 'I buy all my kids\' birthday presents from here now. Quality is consistently amazing and prices are fair.',
    product: 'Art & Craft Kit',
  },
  {
    id: 8, name: 'Amit J.', avatar: 'A', rating: 5,
    text: 'The best toy store online! The filtering options helped me find the perfect age-appropriate gift.',
    product: 'Magnetic Building Blocks',
  }
];

const ReviewCard = ({ r }: { r: any }) => (
  <div className="w-[320px] flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#2563EB]/20 transition-all mx-3">
    <div className="flex text-[#FACC15] mb-4 gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={18} className={i < r.rating ? 'fill-[#FACC15]' : 'fill-gray-200 text-gray-200'} />
      ))}
    </div>
    <p className="text-[#111827] text-sm leading-relaxed mb-5 italic whitespace-normal">"{r.text}"</p>
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
      <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-extrabold text-base">
        {r.avatar}
      </div>
      <div>
        <div className="font-bold text-[#111827] text-sm">{r.name}</div>
        <div className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
          <CheckCircle2 size={12} className="text-green-500" /> Verified Buyer · {r.product}
        </div>
      </div>
    </div>
  </div>
);

export default function CustomerReviews() {
  return (
    <section className="py-14 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 bg-[#FACC15] text-[#111827] text-xs font-extrabold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            <Star size={14} className="fill-[#111827]" /> Reviews
          </span>
          <h2 className="text-3xl font-extrabold text-[#111827]" style={{ fontFamily: 'Outfit' }}>
            Happy Little Customers
          </h2>
          <p className="text-[#6B7280] mt-2 text-sm">Thousands of smiling families trust ChildToys</p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="flex flex-col gap-6">
        {/* Row 1 - Scrolling Left */}
        <div className="flex w-max animate-marquee">
          {reviewsRow1.map(r => <ReviewCard key={`row1-1-${r.id}`} r={r} />)}
          {reviewsRow1.map(r => <ReviewCard key={`row1-2-${r.id}`} r={r} />)}
        </div>

        {/* Row 2 - Scrolling Right */}
        <div className="flex w-max animate-marquee-reverse">
          {reviewsRow2.map(r => <ReviewCard key={`row2-1-${r.id}`} r={r} />)}
          {reviewsRow2.map(r => <ReviewCard key={`row2-2-${r.id}`} r={r} />)}
        </div>
      </div>
    </section>
  );
}
