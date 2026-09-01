import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { BannerSlide } from '../types';
import { resolvePexelsUrl } from '../data/initialData';

interface HeroSliderProps {
  banners: BannerSlide[];
  onNavigate: (route: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  const current = banners[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleCtaClick = () => {
    if (current.href) {
      if (current.href.startsWith('#/')) {
        onNavigate(current.href.replace('#/', ''));
      } else if (current.href.startsWith('/')) {
        onNavigate(current.href.substring(1));
      } else {
        onNavigate(current.href);
      }
    } else {
      onNavigate('shop');
    }
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl h-[420px] sm:h-[480px] md:h-[540px] transition-all bg-gray-900 group">
      {/* Background Images */}
      {banners.map((b, idx) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-105 transition-transform duration-10000' : 'opacity-0 scale-100 pointer-events-none'
          }`}
        >
          <img
            src={resolvePexelsUrl(b.img)}
            alt={b.t}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/40 sm:to-transparent" />
        </div>
      ))}

      {/* Hero Copy Card */}
      <div className="absolute inset-0 flex items-end sm:items-center p-6 sm:p-12 z-10">
        <div className="glass-panel-strong rounded-3xl p-6 sm:p-10 max-w-xl shadow-2xl backdrop-blur-2xl border border-white/80 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="inline-block text-[11px] uppercase tracking-[0.25em] font-semibold text-amber-700 mb-2 font-bn">
            {current.bn}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-gray-950 leading-[1.08] mb-3">
            {current.t}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 max-w-md">
            {current.s}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCtaClick}
              className="gold-gradient-btn px-6 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 group/btn cursor-pointer"
            >
              <span>{current.cta}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-medium bg-white/70 hover:bg-white text-gray-800 border border-white/80 transition-all cursor-pointer"
            >
              View Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Nav Chevrons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 hover:bg-white text-gray-900 shadow-lg flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 hover:bg-white text-gray-900 shadow-lg flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
