import React, { useState, useEffect } from 'react';
import { Zap, Clock, Flame, ArrowLeft, Filter, Sparkles, ShoppingBag, MessageCircle, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { Product, StoreSettings, Category } from '../types';
import { formatBDT, getWhatsAppUrl } from '../utils/helpers';
import { ProductCard } from './ProductCard';

interface FlashSalePageProps {
  products: Product[];
  categories: Category[];
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onNavigate: (route: string) => void;
  settings: StoreSettings;
}

export const FlashSalePage: React.FC<FlashSalePageProps> = ({
  products,
  categories,
  onOpenProduct,
  onAddToCart,
  onNavigate,
  settings,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [discountFilter, setDiscountFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'discount' | 'price-asc' | 'price-desc' | 'claimed'>('discount');

  // Live countdown timer: counts down to midnight / target end time
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 7,
    minutes: 48,
    seconds: 22,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
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

  const safeProducts = Array.isArray(products) ? products : [];
  const flashProducts = safeProducts.filter((p) => p.flashSale);

  // Filtering
  const filtered = flashProducts.filter((p) => {
    if (selectedCat !== 'all' && p.cat !== selectedCat) return false;
    const discount = p.flashSaleDiscountPercent || (p.was ? Math.round(((p.was - p.price) / p.was) * 100) : 25);
    if (discountFilter !== 'all' && discount < discountFilter) return false;
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    const discA = a.flashSaleDiscountPercent || (a.was ? Math.round(((a.was - a.price) / a.was) * 100) : 25);
    const discB = b.flashSaleDiscountPercent || (b.was ? Math.round(((b.was - b.price) / b.was) * 100) : 25);

    if (sortBy === 'discount') return discB - discA;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'claimed') return (b.flashSaleSold || 0) - (a.flashSaleSold || 0);
    return 0;
  });

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-300">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 text-xs font-semibold border border-black/5 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Home</span>
          <span>/</span>
          <span className="text-amber-700 font-semibold">Flash Deals</span>
        </div>
      </div>

      {/* Hero Mega Flash Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b120c] via-[#2d1b11] to-[#12151f] p-6 sm:p-10 text-white border border-amber-500/30 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Limited Stock Flash Deals</span>
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Festive Flash Deals</span>
              <Zap className="w-8 h-8 text-amber-400 fill-amber-400 inline-block animate-bounce" />
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-bn leading-relaxed">
              সারা দেশে ক্যাশ অন ডেলিভারি সুবিধাসহ ঐতিহ্যবাহী জামদানি, সিল্ক শাড়ি, প্রিমিয়াম পাঞ্জাবি ও লাক্সারি লেদার সামগ্রীতে বিশেষ ছাড়! স্টক ফুরিয়ে যাওয়ার আগেই আপনার পছন্দের পণ্যটি সংগ্রহ করুন।
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex flex-col items-center lg:items-end gap-2 bg-black/50 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Offer Expires In</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-black text-white">
              <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl min-w-[48px] text-center shadow-xs">
                {String(timeLeft.hours).padStart(2, '0')}
                <span className="block text-[9px] font-sans font-normal text-slate-400 uppercase tracking-tighter">Hours</span>
              </div>
              <span className="text-amber-400 font-bold text-lg">:</span>
              <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl min-w-[48px] text-center shadow-xs">
                {String(timeLeft.minutes).padStart(2, '0')}
                <span className="block text-[9px] font-sans font-normal text-slate-400 uppercase tracking-tighter">Mins</span>
              </div>
              <span className="text-amber-400 font-bold text-lg">:</span>
              <div className="bg-amber-500/30 border border-amber-400/50 text-amber-300 px-3 py-1.5 rounded-xl min-w-[48px] text-center shadow-xs">
                {String(timeLeft.seconds).padStart(2, '0')}
                <span className="block text-[9px] font-sans font-normal text-amber-400 uppercase tracking-tighter">Secs</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Home Delivery · No Advance Payment Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-black/5 shadow-xs space-y-4">
        {/* Category & Discount Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Categories ({flashProducts.length})
            </button>
            {categories.map((c) => {
              const count = flashProducts.filter((p) => p.cat === c.slug).length;
              if (count === 0) return null;
              return (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCat(c.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCat === c.slug
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {c.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="discount">Highest Discount %</option>
              <option value="claimed">Most Claimed</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Discount tier chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Minimum Discount:</span>
          {[
            { label: 'All Deals', val: 'all' as const },
            { label: '20%+ OFF', val: 20 },
            { label: '30%+ OFF', val: 30 },
            { label: '40%+ OFF', val: 40 },
          ].map((tier) => (
            <button
              key={String(tier.val)}
              onClick={() => setDiscountFilter(tier.val)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                discountFilter === tier.val
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Results Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-black/5 p-8">
          <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Flash Deals match this filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the category or discount tier filter.</p>
          <button
            onClick={() => {
              setSelectedCat('all');
              setDiscountFilter('all');
            }}
            className="mt-4 px-5 py-2 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {sorted.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenProduct={onOpenProduct}
              onAddToCart={onAddToCart}
              whatsappPhone={settings.whatsappNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
};
