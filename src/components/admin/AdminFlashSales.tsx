import React, { useState } from 'react';
import { Flame, Zap, Clock, Save, Plus, Trash2, CheckCircle2, AlertCircle, Percent, Sparkles, RefreshCw } from 'lucide-react';
import { Product, StoreSettings } from '../../types';
import { formatBDT } from '../../utils/helpers';
import { api } from '../../services/api';

interface AdminFlashSalesProps {
  products: Product[];
  settings: StoreSettings;
  onRefresh: () => void;
}

export const AdminFlashSales: React.FC<AdminFlashSalesProps> = ({
  products,
  settings,
  onRefresh,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [discountPercent, setDiscountPercent] = useState(30);
  const [stockQuota, setStockQuota] = useState(25);

  const safeProducts = Array.isArray(products) ? products : [];
  const flashProducts = safeProducts.filter((p) => p.flashSale);
  const nonFlashProducts = safeProducts.filter((p) => !p.flashSale);

  const handleToggleProductFlash = async (product: Product, enable: boolean, discount = 25) => {
    try {
      setIsSaving(true);
      setSuccessMessage('');
      const calculatedWas = product.was || Math.round(product.price * (1 + discount / 100));
      const calculatedPrice = enable ? Math.round(calculatedWas * (1 - discount / 100)) : (product.was || product.price);

      await api.updateProduct(product.id, {
        flashSale: enable,
        flashSaleDiscountPercent: enable ? discount : undefined,
        flashSaleSold: enable ? (product.flashSaleSold || 10) : 0,
        flashSaleStockQuota: enable ? (product.flashSaleStockQuota || 25) : undefined,
        was: calculatedWas,
        price: enable ? calculatedPrice : calculatedWas,
      });

      setSuccessMessage(
        enable
          ? `Added "${product.name}" to Flash Sale with -${discount}% discount!`
          : `Removed "${product.name}" from Flash Sale.`
      );
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update flash sale status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    const product = safeProducts.find((p) => p.id === selectedProductId);
    if (!product) return;

    await handleToggleProductFlash(product, true, Number(discountPercent));
    setSelectedProductId('');
  };

  const handleUpdateDiscount = async (product: Product, newDiscount: number) => {
    try {
      setIsSaving(true);
      const baseOriginal = product.was || product.price;
      const discountedPrice = Math.round(baseOriginal * (1 - newDiscount / 100));

      await api.updateProduct(product.id, {
        flashSaleDiscountPercent: newDiscount,
        was: baseOriginal,
        price: discountedPrice,
      });

      onRefresh();
    } catch (err: any) {
      alert('Failed to update discount');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 border border-amber-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Flash Deals Campaign Manager</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Active Flash Sales</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-xs font-black">
              {flashProducts.length} LIVE
            </span>
          </h1>
          <p className="text-xs text-slate-300 font-bn mt-1">
            নির্দিষ্ট পণ্যে বিশেষ ছাড় ও রিয়েল-টাইম কাউন্টডাউন অফার পরিচালনা করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Deals</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Product to Flash Sale Form */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Zap className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-bold text-slate-900">Enlist Item into Flash Sale</h2>
        </div>

        <form onSubmit={handleQuickAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Select Product to Promote
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-indigo-500 outline-none"
            >
              <option value="">-- Choose from Catalog ({nonFlashProducts.length} available) --</option>
              {nonFlashProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.cat}) - {formatBDT(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Discount (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="80"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white pr-8 focus:border-indigo-500 outline-none"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
            </div>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={!selectedProductId || isSaving}
              className="w-full py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Flash Sale</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Flash Deals Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">Current Flash Sale Catalog</h3>
          </div>
          <span className="text-xs text-slate-500">{flashProducts.length} items live</span>
        </div>

        {flashProducts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No products are currently in Flash Sale. Use the selector above to enlist items.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Deal Price</th>
                  <th className="py-3 px-4 font-semibold">Was Price</th>
                  <th className="py-3 px-4 font-semibold">Discount</th>
                  <th className="py-3 px-4 font-semibold">Claimed Progress</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flashProducts.map((p) => {
                  const discount = p.flashSaleDiscountPercent || (p.was ? Math.round(((p.was - p.price) / p.was) * 100) : 25);
                  const sold = p.flashSaleSold || 10;
                  const quota = p.flashSaleStockQuota || (sold + p.stock);
                  const percent = Math.min(100, Math.round((sold / quota) * 100));

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.img[0]}
                            alt=""
                            className="w-10 h-12 object-cover rounded-md border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">
                              {p.name}
                            </span>
                            <span className="text-[11px] font-bn text-slate-500 block">
                              {p.bn}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-700">
                        {formatBDT(p.price)}
                      </td>
                      <td className="py-3 px-4 text-slate-400 line-through">
                        {p.was ? formatBDT(p.was) : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px]">
                          -{discount}% OFF
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                            <span>{sold} sold</span>
                            <span>{p.stock} left</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleProductFlash(p, false)}
                          disabled={isSaving}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition-colors cursor-pointer"
                        >
                          Remove Deal
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
