import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { Category } from '../types';
import { formatBDT } from '../utils/helpers';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  allTags: string[];
  maxPrice: number;
  onChangeMaxPrice: (val: number) => void;
  stockOnly: boolean;
  onToggleStockOnly: (val: boolean) => void;
  onResetFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedTag,
  onSelectTag,
  allTags,
  maxPrice,
  onChangeMaxPrice,
  stockOnly,
  onToggleStockOnly,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs sm:max-w-sm bg-[#f8f9fd] shadow-2xl border-r border-white/80 flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-gray-200/80 flex items-center justify-between glass-panel-strong">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-700" />
              <h2 className="text-base font-semibold text-gray-900">
                Filter Catalog
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200/80 text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Max Price
                </label>
                <span className="text-xs font-bold text-amber-800 font-mono">
                  {formatBDT(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={800}
                max={15000}
                step={100}
                value={maxPrice}
                onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>৳800</span>
                <span>৳15,000+</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-black/5">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(e) => onToggleStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-amber-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-800">
                  In-Stock Items Only
                </span>
              </label>
            </div>

            {/* Categories */}
            <div className="space-y-2 pt-2 border-t border-black/5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => onSelectCategory('all')}
                  className={`w-full p-2.5 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>All Categories</span>
                  {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-amber-700" />}
                </button>

                {categories.map((c) => {
                  const isSelected = selectedCategory === c.slug;
                  return (
                    <button
                      key={c.slug}
                      onClick={() => onSelectCategory(c.slug)}
                      className={`w-full p-2.5 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{c.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags / Vibes */}
            {allTags.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-black/5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                  Curated Tags & Vibes
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => onSelectTag('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedTag === 'all'
                        ? 'bg-[#12151f] text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    All
                  </button>
                  {allTags.map((t) => {
                    const isSelected = selectedTag === t;
                    return (
                      <button
                        key={t}
                        onClick={() => onSelectTag(t)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#12151f] text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        #{t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Reset & Apply */}
          <div className="p-4 border-t border-gray-200/80 bg-white/90 space-y-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#12151f] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
            >
              Show Results
            </button>
            <button
              onClick={onResetFilters}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
