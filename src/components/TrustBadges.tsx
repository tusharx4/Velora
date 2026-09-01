import React from 'react';
import { Truck, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface TrustBadgesProps {
  settings: StoreSettings;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ settings }) => {
  const badges = [
    {
      icon: <Truck className="w-5 h-5 text-amber-600" />,
      title: 'Cash on Delivery',
      bn: 'সারা দেশে ক্যাশ অন ডেলিভারি',
      desc: 'Pay at your doorstep anywhere in Bangladesh after receiving the parcel.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      title: `Inside ৳${settings.shippingFeeInsideDhaka} | Outside ৳${settings.shippingFeeOutsideDhaka}`,
      bn: 'স্বচ্ছ ডেলিভারি চার্জ',
      desc: 'Fixed shipping fees clearly stated before confirming on WhatsApp or COD.',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-amber-600" />,
      title: '7-Day Easy Exchange',
      bn: '৭ দিনের সহজ পরিবর্তন',
      desc: 'Unworn pieces with intact tags can be exchanged with hassle-free pickup.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      title: '100% Authentic Handloom',
      bn: 'শতভাগ খাঁটি ও কোয়ালিটি চেকড',
      desc: 'Carefully curated and hand-checked at our Dhanmondi flagship boutique.',
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-8">
      {badges.map((b, i) => (
        <div
          key={i}
          className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 hover:-translate-y-1 transition-all duration-300 border border-white/80 shadow-sm"
        >
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 flex-shrink-0">
            {b.icon}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
              {b.title}
            </h3>
            <p className="text-[11px] font-bn text-amber-700 font-medium mt-0.5">
              {b.bn}
            </p>
            <p className="text-[11.5px] text-gray-500 mt-1 leading-relaxed">
              {b.desc}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};
