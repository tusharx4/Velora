import React, { useState } from 'react';
import { X, Search, PackageCheck, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatBDT } from '../utils/helpers';
import { api } from '../services/api';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError('');
    setIsLoading(true);
    try {
      const results = await api.trackOrder(query);
      setOrders(results);
    } catch (err: any) {
      setOrders([]);
      setError(err.message || 'No orders found matching this query.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStep = (status: OrderStatus): number => {
    switch (status) {
      case 'pending':
        return 1;
      case 'confirmed':
        return 2;
      case 'processing':
        return 3;
      case 'shipped':
        return 4;
      case 'delivered':
        return 5;
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const steps = [
    { title: 'Placed', desc: 'Order received' },
    { title: 'Confirmed', desc: 'Verified on phone' },
    { title: 'Packaging', desc: 'Quality inspected' },
    { title: 'In Transit', desc: 'Handed to courier' },
    { title: 'Delivered', desc: 'Completed' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#f8f9fd] rounded-[32px] shadow-2xl border border-white/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200/80 flex items-center justify-between glass-panel-strong">
          <div className="flex items-center gap-2.5">
            <PackageCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-gray-950">
                Track Your VELORA Order
              </h2>
              <p className="text-xs text-gray-500 font-bn">
                মোবাইল নম্বর অথবা অর্ডার রেফারেন্স দিয়ে ট্র্যাক করুন
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

        {/* Search Input Box */}
        <div className="p-5 sm:p-6 border-b border-gray-200/60 bg-white/60">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Mobile Number (e.g. 0171...) or Order ID (e.g. VEL-8921)"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-full bg-[#12151f] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {error && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {orders && orders.length > 0 ? (
            orders.map((order) => {
              const currentStep = getStatusStep(order.status);
              const isCancelled = order.status === 'cancelled';

              return (
                <div
                  key={order.id}
                  className="glass-panel rounded-3xl p-5 border border-white/90 shadow-sm space-y-5"
                >
                  {/* Order Top Summary */}
                  <div className="flex items-start justify-between gap-4 flex-wrap pb-3 border-b border-black/5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Order Reference
                      </span>
                      <h3 className="text-base font-bold text-gray-950 font-mono">
                        {order.id}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'processing'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="text-sm font-bold text-amber-800 mt-1">
                        {formatBDT(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Progress Bar */}
                  {!isCancelled ? (
                    <div className="pt-2">
                      <div className="grid grid-cols-5 gap-1 relative text-center">
                        {steps.map((step, idx) => {
                          const stepNum = idx + 1;
                          const isDone = currentStep >= stepNum;
                          const isCurrent = currentStep === stepNum;

                          return (
                            <div key={idx} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                  isDone
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                } ${isCurrent ? 'ring-4 ring-amber-500/20' : ''}`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                              </div>
                              <span
                                className={`text-[11px] font-semibold mt-1.5 line-clamp-1 ${
                                  isDone ? 'text-gray-900' : 'text-gray-400'
                                }`}
                              >
                                {step.title}
                              </span>
                              <span className="text-[9.5px] text-gray-400 hidden sm:block">
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium text-center">
                      This order was cancelled. Please contact our support team for assistance.
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="pt-2 border-t border-black/5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Ordered Items:
                    </span>
                    <div className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs text-gray-700 bg-white/60 p-2.5 rounded-xl border border-white"
                        >
                          <div className="flex items-center gap-2.5">
                            {item.img && (
                              <img
                                src={item.img}
                                alt=""
                                className="w-9 h-11 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-[11px] text-gray-500">{item.variant}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">Qty: {item.quantity}</span>
                            <p className="font-semibold text-amber-800">{formatBDT(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destination & Tracking details */}
                  <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-200/60 text-xs space-y-1 text-gray-600">
                    <p>
                      <b className="text-gray-800">Recipient:</b> {order.customerName} ({order.customerPhone})
                    </p>
                    <p>
                      <b className="text-gray-800">Delivery Address:</b> {order.address} ({order.city || order.deliveryZone})
                    </p>
                    {order.trackingNumber && (
                      <p>
                        <b className="text-gray-800">Tracking Code:</b> <span className="font-mono text-gray-900">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : orders && orders.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-xs">
              No orders found for "{query}". Please verify your phone number or Order ID.
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <Clock className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">
                Enter your mobile number or order code above to view real-time delivery status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
