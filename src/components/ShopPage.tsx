import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, Sparkles, ArrowUpDown, Filter, RefreshCw } from 'lucide-react';
import { Category, Product, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';
import { FilterDrawer } from './FilterDrawer';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  settings: StoreSettings;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenProduct,
  onAddToCart,
  settings,
  initialSearch = '',
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [selectedTag, setSelectedTag] = useState('all');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [stockOnly, setStockOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract all unique tags
  const safeProducts = Array.isArray(products) ? products : [];
  const allTags = useMemo(() => {
    const set = new Set<string>();
    safeProducts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 12);
  }, [safeProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return safeProducts
      .filter((p) => {
        const matchesCat =
          selectedCategory === 'all' ||
          p.cat.toLowerCase() === selectedCategory.toLowerCase() ||
          categories.find((c) => c.slug === selectedCategory)?.name === p.cat;

        const matchesSearch =
          !search.trim() ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.bn.toLowerCase().includes(search.toLowerCase()) ||
          p.cat.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

        const matchesTag = selectedTag === 'all' || p.tags.includes(selectedTag);
        const matchesPrice = p.price <= maxPrice;
        const matchesStock = !stockOnly || p.stock > 0;

        return matchesCat && matchesSearch && matchesTag && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.stock || 0) - (a.stock || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, search, selectedTag, maxPrice, stockOnly, sortBy, categories]);

  const handleResetFilters = () => {
    onSelectCategory('all');
    setSelectedTag('all');
    setMaxPrice(15000);
    setStockOnly(false);
    setSearch('');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedTag !== 'all' ? 1 : 0) +
    (maxPrice < 15000 ? 1 : 0) +
    (stockOnly ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-panel-strong rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 font-bn">
            বুটিক কালেকশন ও অনলাইন ক্যাটালগ
          </span>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-950 mt-0.5">
            {selectedCategory === 'all'
              ? 'Complete Boutique Catalog'
              : categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {filteredProducts.length} handcrafted items with nationwide cash on delivery
          </p>
        </div>

        {/* Quick Search in Header */}
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 w-full sm:w-72 shadow-xs">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, fabrics..."
            className="w-full text-xs outline-none bg-transparent text-gray-800"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Categories, Filters, Sorting */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0 flex-1 min-w-[280px]">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#12151f] text-white shadow-sm'
                : 'glass-panel text-gray-700 hover:bg-white'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => onSelectCategory(c.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.slug
                  ? 'bg-[#12151f] text-white shadow-sm'
                  : 'glass-panel text-gray-700 hover:bg-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Right Tools: Filter Drawer Trigger & Sort Dropdown */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="glass-panel px-3.5 py-2 rounded-full text-xs font-semibold text-gray-800 hover:bg-white flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[9.5px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="glass-panel rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-xs text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-gray-800 outline-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Most Available Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-gray-400 font-medium">Active:</span>
          {selectedCategory !== 'all' && (
            <span className="bg-amber-100/80 text-amber-900 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              Cat: {selectedCategory}
              <button onClick={() => onSelectCategory('all')}>×</button>
            </span>
          )}
          {selectedTag !== 'all' && (
            <span className="bg-amber-100/80 text-amber-900 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              #{selectedTag}
              <button onClick={() => setSelectedTag('all')}>×</button>
            </span>
          )}
          {stockOnly && (
            <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              In Stock Only
              <button onClick={() => setStockOnly(false)}>×</button>
            </span>
          )}
          {maxPrice < 15000 && (
            <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              Under ৳{maxPrice}
              <button onClick={() => setMaxPrice(15000)}>×</button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-gray-500 hover:text-gray-900 underline font-semibold text-xs ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center glass-panel-strong rounded-3xl p-8 border border-white/80 space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No matching products found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query, price filter, or category selection to find what you need.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-6 py-2.5 rounded-full bg-[#12151f] text-white text-xs font-semibold hover:bg-black"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredProducts.map((product) => (
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

      {/* Filter Slide Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          onSelectCategory(cat);
          setIsFilterOpen(false);
        }}
        selectedTag={selectedTag}
        onSelectTag={(tag) => {
          setSelectedTag(tag);
          setIsFilterOpen(false);
        }}
        allTags={allTags}
        maxPrice={maxPrice}
        onChangeMaxPrice={setMaxPrice}
        stockOnly={stockOnly}
        onToggleStockOnly={setStockOnly}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
