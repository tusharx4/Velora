import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Check,
  X,
  Star,
  Flame,
  Zap,
} from 'lucide-react';
import { Category, Product } from '../../types';
import { formatBDT } from '../../utils/helpers';
import { api } from '../../services/api';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
  onOpenAI: () => void;
  onOpenNewProduct: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onRefresh,
  onOpenAI,
  onOpenNewProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Inline stock edits
  const [quickStockEditingId, setQuickStockEditingId] = useState<string | null>(null);
  const [quickStockValue, setQuickStockValue] = useState<number>(0);

  // Filtered products
  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.bn.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.cat === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleToggleFlash = async (p: Product) => {
    try {
      const nextFlash = !p.flashSale;
      const discount = nextFlash ? (p.flashSaleDiscountPercent || 25) : undefined;
      const calculatedWas = p.was || Math.round(p.price * 1.25);
      const calculatedPrice = nextFlash ? Math.round(calculatedWas * (1 - (discount || 25) / 100)) : (p.was || p.price);

      await api.updateProduct(p.id, {
        flashSale: nextFlash,
        flashSaleDiscountPercent: discount,
        was: calculatedWas,
        price: calculatedPrice,
      });
      onRefresh();
    } catch (err: any) {
      alert('Failed to update flash sale status');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setIsSaving(true);
      setErrorMessage('');
      await api.updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveQuickStock = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { stock: quickStockValue });
      setQuickStockEditingId(null);
      onRefresh();
    } catch (err: any) {
      alert('Failed to update stock');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Catalog & Inventory
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Products Directory ({products.length})
          </h1>
          <p className="text-xs text-slate-500 font-bn mt-0.5">
            পণ্য তৈরি, মূল্য ও স্টক আপডেট, এবং ইমেজ পরিবর্তন
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAI}
            className="px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Generate with AI</span>
          </button>

          <button
            onClick={onOpenNewProduct}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3.5 py-2 border border-slate-200 flex-1 max-w-sm focus-within:border-indigo-500 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, Bengali, or slug..."
            className="w-full text-xs outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name} ({c.bn})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Flash Deal</th>
                <th className="py-3 px-4">Inventory Stock</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Media and Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.img[0]}
                        alt={p.name}
                        className="w-11 h-13 object-cover rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                        <p className="text-[11px] font-bn text-slate-500 truncate">{p.bn}</p>
                        <span className="font-mono text-[10px] text-slate-400">
                          {p.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                      {p.cat}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">
                      {formatBDT(p.price)}
                    </div>
                    {p.was && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatBDT(p.was)}
                      </span>
                    )}
                  </td>

                  {/* Flash Sale Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleFlash(p)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold cursor-pointer transition-colors ${
                        p.flashSale
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <Zap className={`w-3 h-3 ${p.flashSale ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}`} />
                      <span>{p.flashSale ? `${p.flashSaleDiscountPercent || 25}% OFF` : 'Inactive'}</span>
                    </button>
                  </td>

                  {/* Stock Quick Editor */}
                  <td className="py-3.5 px-4">
                    {quickStockEditingId === p.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={quickStockValue}
                          onChange={(e) => setQuickStockValue(Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-indigo-500 rounded text-xs outline-none bg-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveQuickStock(p)}
                          className="p-1 text-emerald-600 hover:text-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setQuickStockEditingId(null)}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setQuickStockEditingId(p.id);
                          setQuickStockValue(p.stock);
                        }}
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
                          p.stock <= 0
                            ? 'bg-rose-100 text-rose-700'
                            : p.stock <= 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                        title="Click to edit stock count"
                      >
                        {p.stock <= 0 ? 'Sold Out (0)' : `${p.stock} in stock`}
                      </button>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-800 text-xs">
                        {p.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Product: {editingProduct.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">ID: {editingProduct.id}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 flex-1">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    English Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Bengali Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.bn}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, bn: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bn focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.cat}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, cat: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-indigo-500 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Price (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Was Price / Strike (৳ BDT)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.was || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        was: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Flash Sale Controls in Edit Modal */}
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.flashSale)}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        flashSale: e.target.checked,
                        flashSaleDiscountPercent: e.target.checked ? (editingProduct.flashSaleDiscountPercent || 25) : undefined,
                      })
                    }
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>⚡ Include in Festive Flash Sale</span>
                </label>

                {editingProduct.flashSale && (
                  <div>
                    <label className="text-xs font-semibold text-amber-900 block mb-1">
                      Flash Discount (% Off)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="80"
                      value={editingProduct.flashSaleDiscountPercent || 25}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          flashSaleDiscountPercent: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white focus:border-amber-500 outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sizes.join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Product Image URLs (one per line) *
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.img.join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').map((u) => u.trim()).filter(Boolean);
                    setEditingProduct({
                      ...editingProduct,
                      img: lines,
                      imgs: lines,
                    });
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono focus:border-indigo-500 outline-none"
                />
                
                {/* Live Image Previews */}
                {editingProduct.img && editingProduct.img.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-2 overflow-x-auto py-1">
                    <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Preview:</span>
                    {editingProduct.img.map((url, i) => (
                      <div key={i} className="relative group w-12 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                        <img
                          src={url}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80';
                          }}
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  English Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.d}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, d: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Bengali Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.db}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, db: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bn focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
