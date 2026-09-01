import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Clock,
  DollarSign,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { AnalyticsSummary, Order } from '../../types';
import { formatBDT } from '../../utils/helpers';

interface AdminDashboardProps {
  analytics: AnalyticsSummary | null;
  orders: Order[];
  onSelectTab: (tab: string) => void;
  onOpenNewProduct: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  analytics,
  orders,
  onSelectTab,
  onOpenNewProduct,
}) => {
  if (!analytics) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading analytics data...
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatBDT(analytics.totalRevenue),
      sub: `${analytics.deliveredOrders} delivered orders`,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      badge: '+12% from last month',
      badgeBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders,
      sub: `${analytics.pendingOrders} pending confirmation`,
      icon: <ShoppingBag className="w-5 h-5 text-indigo-600" />,
      badge: `${analytics.pendingOrders} to dispatch`,
      badgeBg: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'Avg Order Value',
      value: formatBDT(analytics.averageOrderValue),
      sub: 'Per completed order',
      icon: <TrendingUp className="w-5 h-5 text-sky-600" />,
      badge: 'High Value Items',
      badgeBg: 'bg-sky-50 text-sky-700',
    },
    {
      title: 'Active Catalog',
      value: analytics.totalProducts,
      sub: `${analytics.lowStockProducts} low stock alerts`,
      icon: <Package className="w-5 h-5 text-amber-600" />,
      badge: `${analytics.outOfStockProducts} sold out`,
      badgeBg: 'bg-amber-50 text-amber-700',
    },
  ];

  const safeOrders = Array.isArray(orders) ? orders : [];
  const recentOrders = safeOrders.slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Quick Actions */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Operations & Performance
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Store Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-bn mt-0.5">
            রিয়েল-টাইম বিক্রয়, অর্ডার স্ট্যাটাস এবং ইনভেন্টরি ট্র্যাকিং
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectTab('ai-assistant')}
            className="px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Catalog Assistant</span>
          </button>

          <button
            onClick={onOpenNewProduct}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {c.title}
              </span>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                {c.icon}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {c.value}
              </h3>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">{c.sub}</span>
                <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${c.badgeBg}`}>
                  {c.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown & Low Stock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Category Inventory Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Total catalog density and active products per collection
              </p>
            </div>
            <button
              onClick={() => onSelectTab('products')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 pt-1">
            {Object.entries(analytics.categoryBreakdown || {}).length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No category data recorded yet.</p>
            ) : (
              Object.entries(analytics.categoryBreakdown || {}).map(([cat, count]) => {
                const numCount = Number(count) || 0;
                const percentage = Math.round((numCount / (analytics.totalProducts || 1)) * 100);
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span className="font-semibold text-slate-900">{cat}</span>
                      <span className="text-slate-500">{numCount} items ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Inventory Attention Alerts */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Inventory Alerts
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              SKUs requiring prompt replenishment or supplier contact.
            </p>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    Low Stock (≤10 items)
                  </p>
                  <p className="text-[11px] text-amber-700">
                    {analytics.lowStockProducts} products need restock
                  </p>
                </div>
                <span className="text-lg font-bold text-amber-900">
                  {analytics.lowStockProducts}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-rose-50/80 border border-rose-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-900">
                    Out of Stock (0 items)
                  </p>
                  <p className="text-[11px] text-rose-700">
                    {analytics.outOfStockProducts} products sold out
                  </p>
                </div>
                <span className="text-lg font-bold text-rose-900">
                  {analytics.outOfStockProducts}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('products')}
            className="w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Manage Inventory & Stock
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-slate-500">
              Latest incoming requests from website and WhatsApp checkout
            </p>
          </div>
          <button
            onClick={() => onSelectTab('orders')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Zone</th>
                <th className="py-3 px-3">Items Summary</th>
                <th className="py-3 px-3">Total Payable</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                    {o.id}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900">{o.customerName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{o.customerPhone}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="capitalize text-slate-700 font-medium">
                      {o.deliveryZone === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                    {o.items.length} item(s) • {o.items.map((i) => i.name).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {formatBDT(o.total)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : o.status === 'shipped'
                          ? 'bg-sky-100 text-sky-700'
                          : o.status === 'processing'
                          ? 'bg-indigo-100 text-indigo-700'
                          : o.status === 'confirmed'
                          ? 'bg-teal-100 text-teal-700'
                          : o.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
