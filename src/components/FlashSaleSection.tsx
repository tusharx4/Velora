import React, { useState, useEffect } from 'react';
import { Zap, Clock, Flame, ArrowRight, ShoppingBag, MessageCircle, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatBDT, getWhatsAppUrl } from '../utils/helpers';

interface FlashSaleSectionProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onViewAllFlashDeals: () => void;
  whatsappPhone: string;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  onOpenProduct,
  onAddToCart,
  onViewAllFlashDeals,
  whatsappPhone,
}) => {
  const flashProducts = products.filter((p) => p.flashSale);

  // Live countdown timer: counts down to midnight / target end time
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target is midnight tonight or configured end time
      const target = new Date();
      target.setHours(23, 59, 59, 999);
      const diff = target.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c120c] via-[#2a1b12] to-[#12151f] p-5 sm:p-8 text-white border border-amber-900/40 shadow-xl">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar with Timer */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wider uppercase shadow-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Limited Time Deal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Festive Flash Sale</span>
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400 inline-block animate-bounce" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bn">
            হাতে বোনা লাক্সারি কালেকশনে সর্বোচ্চ ৫০% পর্যন্ত বিশেষ ঈদ ছাড় · স্টক সীমিত
          </p>
        </div>

        {/* Live Countdown Box */}
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">Ends In:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold text-white">
            <div className="bg-white/10 border border-white/15 px-2.5 py-1 rounded-lg min-w-[36px] text-center shadow-xs">
              {String(timeLeft.hours).padStart(2, '0')}
              <span className="block text-[8px] font-sans font-normal text-slate-400 uppercase tracking-tighter">Hours</span>
            </div>
            <span className="text-amber-400 font-bold">:</span>
            <div className="bg-white/10 border border-white/15 px-2.5 py-1 rounded-lg min-w-[36px] text-center shadow-xs">
              {String(timeLeft.minutes).padStart(2, '0')}
              <span className="block text-[8px] font-sans font-normal text-slate-400 uppercase tracking-tighter">Mins</span>
            </div>
            <span className="text-amber-400 font-bold">:</span>
            <div className="bg-amber-500/20 border border-amber-400/40 text-amber-300 px-2.5 py-1 rounded-lg min-w-[36px] text-center shadow-xs">
              {String(timeLeft.seconds).padStart(2, '0')}
              <span className="block text-[8px] font-sans font-normal text-amber-400 uppercase tracking-tighter">Secs</span>
            </div>
          </div>

          <button
            onClick={onViewAllFlashDeals}
            className="ml-2 hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <span>All Deals ({flashProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Flash Sale Product Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
        {flashProducts.slice(0, 4).map((product) => {
          const discountPercent =
            product.flashSaleDiscountPercent ||
            (product.was ? Math.round(((product.was - product.price) / product.was) * 100) : 25);
          const savings = product.was ? product.was - product.price : 0;
          const soldCount = product.flashSaleSold || 14;
          const quota = product.flashSaleStockQuota || (soldCount + (product.stock || 5));
          const progressPercent = Math.min(100, Math.round((soldCount / quota) * 100));

          return (
            <div
              key={product.id}
              onClick={() => onOpenProduct(product)}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 hover:border-amber-400/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={product.img[0]}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-white" />
                      -{discountPercent}% OFF
                    </span>
                    {savings > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[9px] font-bold shadow-sm">
                        Save {formatBDT(savings)}
                      </span>
                    )}
                  </div>

                  {/* Stock Quota Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm rounded-lg p-1.5 border border-white/10">
                    <div className="flex items-center justify-between text-[10px] text-slate-200 font-semibold mb-1">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Flame className="w-3 h-3 text-amber-400" /> {soldCount} Sold
                      </span>
                      <span className="text-slate-400">{product.stock} Left</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-300/80">
                    {product.cat}
                  </span>
                  <h3 className="font-semibold text-sm text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs font-bn text-slate-400 line-clamp-1">
                    {product.bn}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold text-amber-400">
                      {formatBDT(product.price)}
                    </span>
                    {product.was && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatBDT(product.was)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={(e) => onAddToCart(product, e)}
                  className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Claim Deal</span>
                </button>

                <a
                  href={getWhatsAppUrl(
                    whatsappPhone,
                    `Hello VELORA! I want to claim the Flash Sale deal for "${product.name}" at ${formatBDT(product.price)} (Save ৳${savings}). Please confirm availability.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-5 text-center lg:hidden">
        <button
          onClick={onViewAllFlashDeals}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
        >
          <span>View All Flash Deals ({flashProducts.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
