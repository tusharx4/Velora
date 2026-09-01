import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, MessageCircle, Plus, Minus, ShieldCheck, Truck, RefreshCw, Check, Send, Sparkles, User, Cloud } from 'lucide-react';
import { Product, ProductReview, StoreSettings } from '../types';
import { formatBDT, getWhatsAppUrl, buildProductWhatsAppMessage } from '../utils/helpers';
import { ProductCard } from './ProductCard';
import { saveProductReviewToFirestore, subscribeToProductReviews } from '../services/firebase';

interface ProductDetailModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onOpenProduct: (product: Product) => void;
  settings: StoreSettings;
}


export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts,
  onClose,
  onAddToCart,
  onOpenProduct,
  settings,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.n || '');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  // Firebase Product Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(product.sizes?.[0] || '');
    setSelectedColor(product.colors?.[0]?.n || '');
    setQuantity(1);
    setReviewSuccess(false);

    // Subscribe to Firebase real-time reviews for this product
    if (product.id) {
      const unsub = subscribeToProductReviews(product.id, (revList) => {
        setReviews(revList);
      });
      return () => unsub();
    }
  }, [product]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      await saveProductReviewToFirestore({
        productId: product.id,
        userName: reviewerName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        verifiedPurchase: true,
      });

      setReviewSuccess(true);
      setReviewerName('');
      setReviewComment('');
      setReviewRating(5);
      setTimeout(() => setReviewSuccess(false), 5000);
    } catch (err) {
      console.error('Error saving review to Firestore:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };


  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const lineTotal = product.price * quantity;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x, y });
  };

  const handleWhatsAppOrder = () => {
    const variant = [selectedSize, selectedColor].filter(Boolean).join(' / ');
    const origin = window.location.origin + window.location.pathname;
    const msg = buildProductWhatsAppMessage(product, variant, quantity, settings.whatsappNumber, origin);
    window.open(getWhatsAppUrl(settings.whatsappNumber, msg), '_blank', 'noopener,noreferrer');
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
  };

  const safeAllProducts = Array.isArray(allProducts) ? allProducts : [];
  const relatedProducts = safeAllProducts
    .filter((p) => p.cat === product.cat && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-[#f8f9fd] rounded-[32px] shadow-2xl border border-white/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md border border-white transition-all hover:scale-105 active:scale-95"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            {/* Gallery Column */}
            <div className="space-y-3">
              {/* Main Stage */}
              <div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 border border-white/80 shadow-md cursor-crosshair"
              >
                <img
                  src={product.img[activeImageIndex] || product.img[0]}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80';
                  }}
                  className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                    isZoomed ? 'scale-175' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? { transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%` }
                      : undefined
                  }
                />

                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {isOutOfStock ? 'Sold Out' : `${product.stock} in stock`}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {product.img.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {product.img.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-amber-600 scale-102 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Information Column */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                    {product.cat}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-950 mt-1">
                    {product.name}
                  </h1>
                  <p className="text-sm font-bn text-gray-600 mt-0.5">
                    {product.bn}
                  </p>
                </div>

                {/* Price & Reviews */}
                <div className="flex items-baseline gap-3 flex-wrap pt-1">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-800">
                    {formatBDT(product.price)}
                  </span>
                  {product.was && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatBDT(product.was)}
                    </span>
                  )}
                  {product.flashSale && (
                    <span className="bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm animate-pulse flex items-center gap-1">
                      ⚡ Flash Sale Deal
                    </span>
                  )}
                  {product.was && product.was > product.price && !product.flashSale && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      Save {formatBDT(product.was - product.price)}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 ml-auto text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-800">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({product.rc} reviews)
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="glass-panel rounded-2xl p-4 text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 border border-white/60">
                  <p>{product.d}</p>
                  <p className="font-bn text-gray-600 border-t border-black/5 pt-2">
                    {product.db}
                  </p>
                </div>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="text-xs uppercase font-bold tracking-wider text-gray-500 block mb-2">
                      Color Selection
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => {
                        const isSelected = selectedColor === c.n;
                        return (
                          <button
                            key={c.n}
                            onClick={() => setSelectedColor(c.n)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-600'
                                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: c.h }}
                            />
                            <span>{c.n}</span>
                            {isSelected && <Check className="w-3 h-3 text-amber-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="text-xs uppercase font-bold tracking-wider text-gray-500 block mb-2">
                      Size & Fit
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => {
                        const isSelected = selectedSize === s;
                        return (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#12151f] text-white shadow-md'
                                : 'bg-white border border-gray-200 hover:border-gray-400 text-gray-800'
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity and Dynamic Total */}
                <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-full bg-white px-2 py-1 shadow-sm">
                      <button
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        disabled={isOutOfStock || quantity >= product.stock}
                        className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">Total Price</span>
                    <span className="text-lg font-bold text-amber-800">
                      {formatBDT(lineTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-black/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className="w-full py-3.5 px-5 rounded-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    disabled={isOutOfStock}
                    className="w-full py-3.5 px-5 rounded-full wa-gradient-btn text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md animate-wa-pulse active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-bn">WhatsApp-এ সরাসরি অর্ডার</span>
                  </button>
                </div>

                <div className="text-center text-[11px] text-gray-500 pt-1 flex items-center justify-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    Inside Dhaka ৳{settings.shippingFeeInsideDhaka} | Outside ৳{settings.shippingFeeOutsideDhaka}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Pay upon delivery
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Firebase Reviews & Rating Section */}
          <div className="pt-6 border-t border-black/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  Customer Reviews & Ratings ({reviews.length})
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span>Firebase Live Sync</span>
              </span>
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handleSubmitReview} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Write a Product Review</span>
              </h4>

              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Review successfully saved to Firebase Firestore! Thank you for your feedback.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-700 ml-2 font-mono">{reviewRating} / 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Feedback / Review *</label>
                <textarea
                  rows={2}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of fabric quality, fitting, and your overall boutique experience..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSubmittingReview ? 'Saving to Firebase...' : 'Submit Review'}</span>
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-2.5">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  No verified buyer reviews yet. Be the first to share your thoughts!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-200">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-black/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  You May Also Like
                </h3>
                <span className="text-xs text-amber-700 font-semibold">
                  More in {product.cat}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenProduct={(item) => {
                      onOpenProduct(item);
                    }}
                    onAddToCart={(item, e) => {
                      e.stopPropagation();
                      onAddToCart(item, 1, item.sizes[0], item.colors[0]?.n);
                    }}
                    whatsappPhone={settings.whatsappNumber}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
