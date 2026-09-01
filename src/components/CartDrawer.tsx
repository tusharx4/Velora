import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { CartItem, DeliveryZone, StoreSettings } from '../types';
import { formatBDT, getWhatsAppUrl, buildCartWhatsAppMessage } from '../utils/helpers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (pid: string, size?: string, color?: string, delta?: number) => void;
  onRemoveItem: (pid: string, size?: string, color?: string) => void;
  onOpenCheckout: (zone: DeliveryZone) => void;
  settings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  settings,
}) => {
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('dhaka');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShipping = settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : deliveryZone === 'dhaka' ? settings.shippingFeeInsideDhaka : settings.shippingFeeOutsideDhaka;
  const total = subtotal + shippingFee;

  const amountNeededForFreeShip = Math.max(0, settings.freeShippingThreshold - subtotal);
  const freeShipProgress = Math.min(100, Math.round((subtotal / settings.freeShippingThreshold) * 100));

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const origin = window.location.origin + window.location.pathname;
    const msg = buildCartWhatsAppMessage(cart, deliveryZone, shippingFee, '', '', '', '', origin);
    window.open(getWhatsAppUrl(settings.whatsappNumber, msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#f8f9fd] shadow-2xl border-l border-white/80 flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-gray-200/80 flex items-center justify-between glass-panel-strong">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <div>
                <h2 className="text-base font-semibold text-gray-900 leading-tight">
                  Your Shopping Bag
                </h2>
                <p className="text-[11px] text-gray-500 font-bn">
                  {cart.length} টি আইটেম ব্যাগে রয়েছে
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200/80 text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {settings.freeShippingThreshold > 0 && (
            <div className="bg-amber-50/80 px-5 py-2.5 border-b border-amber-200/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-amber-900">
                  {isFreeShipping ? (
                    '🎉 You have unlocked Free Nationwide Delivery!'
                  ) : (
                    <>Add <b className="text-amber-700">{formatBDT(amountNeededForFreeShip)}</b> more for Free Shipping</>
                  )}
                </span>
                <span className="text-[11px] font-bold text-amber-800">
                  {freeShipProgress}%
                </span>
              </div>
              <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShipProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Your shopping bag is empty
                </p>
                <p className="text-xs text-gray-500 font-bn">
                  আপনার পছন্দের পণ্য যোগ করুন এবং সহজে অর্ডার করুন
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2 rounded-full bg-[#12151f] text-white text-xs font-semibold hover:bg-black"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              cart.map((item, idx) => {
                const variantKey = `${item.pid}-${item.size}-${item.color}`;
                return (
                  <div
                    key={variantKey || idx}
                    className="glass-panel rounded-2xl p-3 flex gap-3 items-center border border-white/90 shadow-sm"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-xl flex-shrink-0 bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(' • ') || 'Standard'}
                      </p>
                      <p className="text-xs font-bold text-amber-800 mt-1">
                        {formatBDT(item.price)}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-300 rounded-full bg-white px-2 py-0.5 shadow-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.pid, item.size, item.color, -1)}
                            className="p-1 hover:text-amber-600 text-gray-600 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-gray-900">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.pid, item.size, item.color, 1)}
                            className="p-1 hover:text-amber-600 text-gray-600 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.pid, item.size, item.color)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Controls */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-200/80 bg-white/90 backdrop-blur-xl space-y-4">
              {/* Delivery Zone Selector */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                  Delivery Destination
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryZone('dhaka')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      deliveryZone === 'dhaka'
                        ? 'border-amber-600 bg-amber-50/80 text-amber-900 shadow-xs ring-1 ring-amber-600'
                        : 'border-gray-200 bg-gray-50/50 text-gray-700'
                    }`}
                  >
                    <div>Inside Dhaka</div>
                    <div className="text-[10.5px] opacity-75 font-normal">
                      ৳{settings.shippingFeeInsideDhaka} (24-48 hrs)
                    </div>
                  </button>

                  <button
                    onClick={() => setDeliveryZone('outside')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      deliveryZone === 'outside'
                        ? 'border-amber-600 bg-amber-50/80 text-amber-900 shadow-xs ring-1 ring-amber-600'
                        : 'border-gray-200 bg-gray-50/50 text-gray-700'
                    }`}
                  >
                    <div>Outside Dhaka</div>
                    <div className="text-[10.5px] opacity-75 font-normal">
                      ৳{settings.shippingFeeOutsideDhaka} (48-72 hrs)
                    </div>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee ({deliveryZone === 'dhaka' ? 'Dhaka' : 'Nationwide'})</span>
                  <span className="font-semibold text-gray-900">
                    {isFreeShipping ? <span className="text-emerald-600">FREE</span> : formatBDT(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-950 pt-2 border-t border-gray-200">
                  <span>Total Payable</span>
                  <span className="text-base text-amber-800">{formatBDT(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onOpenCheckout(deliveryZone)}
                  className="w-full py-3.5 px-4 rounded-full bg-[#12151f] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <span>Confirm Cash on Delivery Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-4 rounded-full wa-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm animate-wa-pulse active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-bn">WhatsApp-এ এক ক্লিকে অর্ডার</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10.5px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified boutique checkout · Cash on Delivery nationwide</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
