import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';
import { resolvePexelsUrl } from '../data/initialData';

interface AboutPageProps {
  settings: StoreSettings;
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="space-y-12 py-6 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden h-[340px] sm:h-[420px] shadow-xl">
        <img
          src={resolvePexelsUrl(33257665)}
          alt="VELORA Dhanmondi Boutique"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end p-6 sm:p-12">
          <div className="glass-panel-strong rounded-3xl p-6 sm:p-8 max-w-xl border border-white/80">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-700 font-bn">
              প্রতিষ্ঠিত ২০২৪ · ধানমন্ডি, ঢাকা
            </span>
            <h1 className="text-2xl sm:text-4xl font-medium tracking-tight text-gray-950 mt-1">
              A Boutique for Everyday Elegance, Across Bangladesh.
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-bn mt-2">
              ঐতিহ্য ও আধুনিকতার এক অপূর্ব সংমিশ্রণ — প্রতিটি সৃষ্টিতে ভালোবাসার ছোঁয়া।
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel rounded-3xl p-6 border border-white/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Direct WhatsApp Ordering
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Most of Bangladesh lives on WhatsApp. We bring the complete luxury shopping concierge right into your personal chat without needing app downloads.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Cash on Delivery Nationwide
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Pay with peace of mind. Delivery inside Dhaka is ৳{settings.shippingFeeInsideDhaka}, and nationwide delivery is ৳{settings.shippingFeeOutsideDhaka} with open inspection.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Artisanal Heritage
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            From hand-spun Tangail Jamdani to pure Benarasi zari weaving and tailored Italian-cut shirts, every single product is hand-inspected for uncompromising quality.
          </p>
        </div>
      </section>

      {/* Flagship Store Card & OpenStreetMap Embed */}
      <section className="glass-panel-strong rounded-3xl overflow-hidden border border-white/80 shadow-xl grid grid-cols-1 md:grid-cols-2">
        <div className="relative min-h-[300px] bg-gray-200">
          <iframe
            title="VELORA Boutique Dhanmondi Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=90.365%2C23.735%2C90.392%2C23.755&layer=mapnik&marker=23.7461%2C90.3760"
            className="w-full h-full border-0 absolute inset-0 filter grayscale contrast-125"
          />
        </div>

        <div className="p-6 sm:p-10 flex flex-col justify-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
            Our Flagship Store
          </span>
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-950">
            Experience VELORA in Dhanmondi
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>{settings.addressEn}</span>
            </p>
            <p className="font-bn text-gray-500 pl-6">
              {settings.addressBn}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Open Daily: 10:00 AM – 10:00 PM</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>{settings.phone}</span>
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="gold-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

function MessageCircle(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
