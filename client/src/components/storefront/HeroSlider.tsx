import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=90&w=1600',
    alt: 'Summer Toy Sale',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=90&w=1600',
    alt: 'New Toy Arrivals',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=90&w=1600',
    alt: 'Best Sellers',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((next: number) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => { setCurrent(next); setFading(false); }, 300);
  }, [fading]);

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [current, goTo]);

  return (
    <section className="relative w-full overflow-hidden bg-[#F8FAFC]" style={{ borderBottom: '4px solid #FACC15' }}>
      {/* Images */}
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={s.image}
          alt={s.alt}
          className={`w-full block object-cover object-center transition-opacity duration-500 ${
            i === current ? 'opacity-100' : 'opacity-0 absolute inset-0'
          }`}
          style={{ height: 'clamp(200px, 44vw, 580px)' }}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      {/* Prev */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        aria-label="Previous"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 bg-[#2563EB]/80 hover:bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold backdrop-blur-sm transition-all shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next */}
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        aria-label="Next"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 bg-[#2563EB]/80 hover:bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold backdrop-blur-sm transition-all shadow-lg"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-7 h-3 bg-[#FACC15] shadow-md'
                : 'w-3 h-3 bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-10">
        <div
          key={`pb-${current}`}
          className="h-full bg-[#FACC15]"
          style={{ animation: 'heroProgress 5s linear forwards' }}
        />
      </div>
    </section>
  );
}
