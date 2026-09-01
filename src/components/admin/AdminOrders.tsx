import React, { useState } from 'react';
import {
  Search,
  MessageCircle,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  XCircle,
  Eye,
  Edit,
  Check,
  X,
  Cloud,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatBDT, getWhatsAppUrl } from '../../utils/helpers';
import { api } from '../../services/api';
import { updateOrderStatusInFirestore } from '../../services/firebase';

interface AdminOrdersProps {
  orders: Order[];
  onRefresh: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = safeOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setIsUpdating(true);
      await api.updateOrderStatus(orderId, newStatus);
      // Sync to Firebase Firestore
      updateOrderStatusInFirestore(orderId, newStatus).catch((err) => console.warn(err));
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTracking = async (order: Order) => {
    try {
      await api.updateOrderStatus(order.id, order.status, trackingNumberInput);
      // Sync to Firebase Firestore
      updateOrderStatusInFirestore(order.id, order.status, trackingNumberInput).catch((err) => console.warn(err));
      setEditingTrackingId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to save tracking number');
    }
  };

  const handleWhatsAppCustomer = (order: Order) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const msg = [
      `Assalamu Alaikum *${order.customerName}*,`,
      `Thank you for shopping with *VELORA*.`,
      ``,
      `Your Order Reference: *${order.id}*`,
      `Current Status: *${order.status.toUpperCase()}*`,
      order.trackingNumber ? `Tracking Code: *${order.trackingNumber}*` : '',
      `Total Payable: *${formatBDT(order.total)}* (${order.paymentMethod.toUpperCase()})`,
      ``,
      `If you have any questions or would like to confirm your delivery timing, please reply to this message.`,
    ].filter(Boolean).join('\n');

    window.open(getWhatsAppUrl(cleanPhone, msg), '_blank', 'noopener,noreferrer');
  };

  const statuses: { id: OrderStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Fulfillment & Delivery
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Customer Orders ({orders.length})
          </h1>
          <p className="text-xs text-slate-500 font-bn mt-0.5">
            সরাসরি ক্যাশ অন ডেলিভারি ও হোয়াটসঅ্যাপ অর্ডারের তালিকা এবং স্ট্যাটাস পরিবর্তন
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3.5 py-2 border border-slate-200 flex-1 max-w-sm focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer name, phone, tracking..."
              className="w-full text-xs outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === s.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Order ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                    {o.id}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">{o.customerName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{o.customerPhone}</p>
                  </td>

                  {/* Destination */}
                  <td className="py-3.5 px-4 max-w-xs truncate">
                    <span className="capitalize font-medium text-slate-900">
                      {o.deliveryZone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'}
                    </span>
                    <p className="text-[11px] text-slate-500 truncate">{o.address}</p>
                  </td>

                  {/* Amount & Method */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{formatBDT(o.total)}</p>
                    <span className="uppercase text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {o.paymentMethod}
                    </span>
                  </td>

                  {/* Tracking Number */}
                  <td className="py-3.5 px-4">
                    {editingTrackingId === o.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={trackingNumberInput}
                          onChange={(e) => setTrackingNumberInput(e.target.value)}
                          className="w-24 px-2 py-1 border border-indigo-500 rounded text-xs font-mono bg-white outline-none"
                          placeholder="TRK-..."
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveTracking(o)}
                          className="p-1 text-emerald-600 hover:text-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingTrackingId(null)}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
                        <span>{o.trackingNumber || '—'}</span>
                        <button
                          onClick={() => {
                            setEditingTrackingId(o.id);
                            setTrackingNumberInput(o.trackingNumber || '');
                          }}
                          className="text-slate-400 hover:text-slate-700"
                          title="Edit Tracking Code"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      disabled={isUpdating}
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider outline-none cursor-pointer border ${
                        o.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : o.status === 'shipped'
                          ? 'bg-sky-100 text-sky-700 border-sky-200'
                          : o.status === 'confirmed'
                          ? 'bg-teal-100 text-teal-700 border-teal-200'
                          : o.status === 'processing'
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          : o.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleWhatsAppCustomer(o)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Chat with Customer on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="View Full Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Order Breakdown
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Customer Box */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-1.5">
                <p className="font-bold text-sm text-slate-900">{selectedOrder.customerName}</p>
                <p className="text-slate-600 font-mono">{selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && (
                  <p className="text-slate-500">{selectedOrder.customerEmail}</p>
                )}
                <p className="text-slate-700 pt-1 border-t border-slate-200">
                  <b>Delivery Address:</b> {selectedOrder.address} ({selectedOrder.city})
                </p>
                {selectedOrder.note && (
                  <p className="text-indigo-900 bg-indigo-50 p-2 rounded-md mt-1 border border-indigo-100">
                    <b>Customer Note:</b> {selectedOrder.note}
                  </p>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                  Purchased Items
                </span>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.img && (
                        <img src={item.img} alt="" className="w-9 h-11 object-cover rounded bg-slate-100 border border-slate-200" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-[11px] text-slate-500">{item.variant}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">{item.quantity} × {formatBDT(item.price)}</span>
                      <p className="font-bold text-slate-900">{formatBDT(item.quantity * item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-1.5 text-right">
                <p className="text-slate-600">Subtotal: {formatBDT(selectedOrder.subtotal)}</p>
                <p className="text-slate-600">Shipping ({selectedOrder.deliveryZone}): {formatBDT(selectedOrder.shippingFee)}</p>
                <p className="text-base font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  Total Payable: {formatBDT(selectedOrder.total)}
                </p>
              </div>

              {/* WhatsApp Action */}
              <div className="pt-2">
                <button
                  onClick={() => handleWhatsAppCustomer(selectedOrder)}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Update to Customer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
