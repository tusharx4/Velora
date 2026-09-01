import React, { useState } from 'react';
import { X, CheckCircle2, MessageCircle, Truck, Package, Copy, Check, ArrowRight, Cloud } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, DeliveryZone, Order, PaymentMethod, StoreSettings } from '../types';
import { formatBDT, getWhatsAppUrl, buildCartWhatsAppMessage } from '../utils/helpers';
import { api } from '../services/api';
import { saveOrderToFirestore } from '../services/firebase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  deliveryZone: DeliveryZone;
  settings: StoreSettings;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  deliveryZone,
  settings,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(deliveryZone === 'dhaka' ? 'Dhaka' : '');
  const [zone, setZone] = useState<DeliveryZone>(deliveryZone);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShipping = settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : zone === 'dhaka' ? settings.shippingFeeInsideDhaka : settings.shippingFeeOutsideDhaka;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMessage('Please enter a valid Bangladeshi phone number.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please enter your detailed delivery address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = await api.createOrder({
        customerName: name,
        customerPhone: phone,
        customerEmail: email || undefined,
        deliveryZone: zone,
        address,
        city: city || (zone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'),
        note: note || undefined,
        paymentMethod,
        items: cart.map((c) => ({
          slug: c.slug,
          name: c.name,
          variant: [c.size, c.color].filter(Boolean).join(' / ') || 'Standard',
          price: c.price,
          quantity: c.qty,
          img: c.img,
        })),
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b07a1b', '#25d366', '#d8ab4d', '#12151f'],
      });

      // Save into Firebase Firestore in background / immediate
      saveOrderToFirestore(newOrder).catch((fireErr) => {
        console.warn('Firestore sync warning:', fireErr);
      });

      setPlacedOrder(newOrder);
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderId = () => {
    if (!placedOrder) return;
    navigator.clipboard.writeText(placedOrder.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleWhatsAppConfirm = () => {
    if (!placedOrder) return;
    const origin = window.location.origin + window.location.pathname;
    const msg = buildCartWhatsAppMessage(
      cart,
      zone,
      shippingFee,
      name,
      phone,
      address,
      placedOrder.id,
      origin
    );
    window.open(getWhatsAppUrl(settings.whatsappNumber, msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#f8f9fd] rounded-[32px] shadow-2xl border border-white/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200/80 flex items-center justify-between glass-panel-strong">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
              {placedOrder ? 'Order Confirmed' : 'Fast Checkout'}
            </span>
            <h2 className="text-lg sm:text-xl font-medium text-gray-950">
              {placedOrder ? 'Thank You For Your Order!' : 'Cash on Delivery Nationwide'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200/80 text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1">
          {placedOrder ? (
            /* Order Placed Success View */
            <div className="space-y-6 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-bn mt-1">
                  আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করে অর্ডারটি কনফার্ম করবেন।
                </p>
              </div>

              {/* Order ID & Tracking Code Box */}
              <div className="glass-panel rounded-2xl p-4 max-w-md mx-auto text-left border border-white space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Order Reference:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-amber-800">
                      {placedOrder.id}
                    </span>
                    <button
                      onClick={handleCopyOrderId}
                      className="p-1 text-gray-400 hover:text-gray-700"
                      title="Copy ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-black/5">
                  <span className="text-gray-500">Tracking Code:</span>
                  <span className="font-mono font-semibold text-gray-800">
                    {placedOrder.trackingNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-black/5">
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="font-bold text-gray-900">{formatBDT(placedOrder.total)}</span>
                </div>
              </div>

              {/* Instant WhatsApp Sync Button */}
              <div className="space-y-2 max-w-md mx-auto pt-2">
                <button
                  onClick={handleWhatsAppConfirm}
                  className="w-full py-3.5 px-5 rounded-full wa-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md animate-wa-pulse cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-bn">WhatsApp-এ ইনভয়েস পাঠান</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Order Summary Pill */}
              <div className="glass-panel rounded-2xl p-3.5 flex items-center justify-between border border-white">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-semibold text-gray-800">
                    {cart.reduce((s, i) => s + i.qty, 0)} items in bag
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 mr-2">Total Payable:</span>
                  <span className="text-sm font-bold text-amber-800">{formatBDT(total)}</span>
                </div>
              </div>

              {/* Customer Info Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              {/* Delivery Zone Selector */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Delivery Region *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setZone('dhaka');
                      if (!city) setCity('Dhaka');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                      zone === 'dhaka'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <div>Inside Dhaka</div>
                    <div className="text-[10px] opacity-75 font-normal">
                      Delivery fee: ৳{settings.shippingFeeInsideDhaka}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setZone('outside');
                      if (city === 'Dhaka') setCity('');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                      zone === 'outside'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <div>Outside Dhaka</div>
                    <div className="text-[10px] opacity-75 font-normal">
                      Delivery fee: ৳{settings.shippingFeeOutsideDhaka}
                    </div>
                  </button>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Detailed Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Block/Sector, Area (e.g. House 14, Road 5, Dhanmondi)"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    District / City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dhaka / Chittagong / Sylhet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For invoice copies"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              {/* Order Note */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Delivery Note / Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Call before delivery, gift packaging, preferred time"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when delivered' },
                    { id: 'bkash', label: 'bKash', sub: 'Send Money / Mar' },
                    { id: 'nagad', label: 'Nagad', sub: 'Instant payment' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                        paymentMethod === p.id
                          ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{p.label}</div>
                      <div className="text-[10px] text-gray-500">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 rounded-full bg-[#12151f] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Confirm Order ({formatBDT(total)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
