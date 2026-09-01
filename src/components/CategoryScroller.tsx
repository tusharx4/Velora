import React from 'react';
import { Category } from '../types';
import { resolvePexelsUrl } from '../data/initialData';

interface CategoryScrollerProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryScroller: React.FC<CategoryScrollerProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="my-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700">
            Curated Boutiques
          </span>
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900 mt-0.5">
            Shop by Category
          </h2>
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs font-semibold text-gray-600 hover:text-gray-950 transition-colors"
        >
          View All →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-3 rounded-full pl-2 pr-5 py-2 whitespace-nowrap transition-all duration-300 flex-shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#12151f] text-white shadow-md'
              : 'glass-panel hover:bg-white text-gray-800'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-xs">
            ★
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold">All Items</p>
            <p className="text-[10px] opacity-75 font-bn">সব ক্যাটাগরি</p>
          </div>
        </button>

        {categories.map((c) => {
          const isSelected = selectedCategory === c.slug;
          return (
            <button
              key={c.slug}
              onClick={() => onSelectCategory(c.slug)}
              className={`flex items-center gap-3 rounded-full pl-2 pr-5 py-2 whitespace-nowrap transition-all duration-300 flex-shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#12151f] text-white shadow-md scale-102'
                  : 'glass-panel hover:bg-white text-gray-800 hover:-translate-y-0.5'
              }`}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/60">
                <img
                  src={resolvePexelsUrl(c.img)}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold">{c.name}</p>
                <p className="text-[10px] opacity-75 font-bn">{c.bn}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
