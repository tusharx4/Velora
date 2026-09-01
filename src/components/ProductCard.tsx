import React from 'react';
import { Star, ShoppingBag, Eye, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { formatBDT, getWhatsAppUrl, buildProductWhatsAppMessage } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  whatsappPhone: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenProduct,
  onAddToCart,
  whatsappPhone,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const discountPercent = product.was && product.was > product.price
    ? Math.round(((product.was - product.price) / product.was) * 100)
    : 0;

  const handleWhatsAppQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = window.location.origin + window.location.pathname;
    const msg = buildProductWhatsAppMessage(product, product.sizes[0] || 'Standard', 1, whatsappPhone, origin);
    window.open(getWhatsAppUrl(whatsappPhone, msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={() => onOpenProduct(product)}
      className="glass-panel rounded-3xl overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border border-white/70 relative"
    >
      {/* Media Aspect Container */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <img
          src={product.img[0]}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Gradient Shadow at Bottom for Price */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.flashSale && (
            <span className="bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[9.5px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
              ⚡ Flash Sale
            </span>
          )}
          {product.rating >= 4.8 && !product.flashSale && (
            <span className="bg-white/90 backdrop-blur-md text-[#12151f] text-[9.5px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm border border-white/60">
              Trending
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-amber-600 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="bg-red-600/90 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-md">
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        {/* Quick Action Overlay Buttons (on hover) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenProduct(product);
            }}
            className="p-3 rounded-full bg-white/90 text-gray-900 hover:bg-white hover:scale-110 shadow-lg transition-transform"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleWhatsAppQuickOrder}
            className="p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-110 shadow-lg transition-transform"
            title="Order via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Price Over Media */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between z-10 text-white">
          <span className="text-base sm:text-lg font-semibold tracking-tight text-white drop-shadow-md">
            {formatBDT(product.price)}
          </span>
          {product.was && (
            <span className="text-xs text-white/70 line-through">
              {formatBDT(product.was)}
            </span>
          )}
        </div>
      </div>

      {/* Body Information */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9.5px] uppercase font-bold tracking-[0.18em] text-amber-700 block">
            {product.cat}
          </span>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-1 mt-0.5">
            {product.name}
          </h3>
          <p className="text-[11px] font-bn text-gray-500 line-clamp-1 mt-0.5">
            {product.bn}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-gray-800 ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[10.5px] text-gray-400">
              ({product.rc})
            </span>
          </div>
        </div>

        {/* Add to Bag Button */}
        <button
          onClick={(e) => onAddToCart(product, e)}
          disabled={isOutOfStock}
          className={`w-full mt-3 py-2 px-3 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black/5 hover:bg-[#12151f] hover:text-white text-gray-800 active:scale-95'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
        </button>
      </div>
    </article>
  );
};
