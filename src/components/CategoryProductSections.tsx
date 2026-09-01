import React from 'react';
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Product, Category, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';

interface CategoryProductSectionsProps {
  categories: Category[];
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onSelectCategory: (slug: string) => void;
  onNavigate: (route: string) => void;
  settings: StoreSettings;
}

export const CategoryProductSections: React.FC<CategoryProductSectionsProps> = ({
  categories,
  products,
  onOpenProduct,
  onAddToCart,
  onSelectCategory,
  onNavigate,
  settings,
}) => {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="space-y-12">
      {safeCategories.map((category) => {
        const catProducts = safeProducts.filter((p) => p.cat === category.slug);
        if (catProducts.length === 0) return null;

        // Show up to 4 curated items per category
        const displayItems = catProducts.slice(0, 4);

        return (
          <section
            key={category.slug}
            className="space-y-4 pt-2 border-t border-black/5"
            id={`category-section-${category.slug}`}
          >
            {/* Header with Title, Bengali Subtitle, and View All */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-700 font-bn">
                    {category.bn}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                  <span className="text-[10px] text-slate-400 font-medium">
                    {catProducts.length} Items Available
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mt-0.5">
                  {category.name} Collection
                </h2>

                <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl mt-0.5">
                  {category.d}
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectCategory(category.slug);
                  onNavigate(`shop?category=${category.slug}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <span>View All ({catProducts.length})</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
            </div>

            {/* Products Grid for this category */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {displayItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenProduct={onOpenProduct}
                  onAddToCart={onAddToCart}
                  whatsappPhone={settings.whatsappNumber}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
