import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Check, Zap } from 'lucide-react';
import { Category, Product } from '../../types';
import { api } from '../../services/api';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onProductCreated: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  onProductCreated,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [bn, setBn] = useState('');
  const [cat, setCat] = useState(categories[0]?.name || 'Luxury Panjabi');
  const [price, setPrice] = useState<number>(3850);
  const [was, setWas] = useState<number | undefined>(4500);
  const [stock, setStock] = useState<number>(35);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashDiscount, setFlashDiscount] = useState<number>(30);
  const [sizes, setSizes] = useState<string>('38, 40, 42, 44');
  const [colors, setColors] = useState<string>('Ivory White (#FAF7F2), Royal Navy (#1B2A4A)');
  const [imgUrls, setImgUrls] = useState<string>(
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80'
  );
  const [tags, setTags] = useState<string>('Eid2025, Festive, Handloom, BestSeller');
  const [d, setD] = useState('Finely tailored boutique piece made from authentic handloom fabric.');
  const [db, setDb] = useState('শতভাগ প্রিমিয়াম কটন ও অভিজাত এমব্রয়ডারি সংমিশ্রণ।');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter a product title.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');

      // Parse colors
      const parsedColors = colors.split(',').map((c) => {
        const match = c.match(/(.*?)\((.*?)\)/);
        if (match) {
          return { n: match[1].trim(), h: match[2].trim() };
        }
        return { n: c.trim(), h: '#12151f' };
      }).filter((c) => c.n);

      const parsedImages = imgUrls
        .split('\n')
        .map((u) => u.trim())
        .filter(Boolean);

      await api.createProduct({
        name,
        bn: bn || name,
        cat,
        price: Number(price),
        was: was ? Number(was) : undefined,
        stock: Number(stock),
        rating: 5.0,
        rc: 1,
        sizes: sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: parsedColors.length > 0 ? parsedColors : [{ n: 'Classic', h: '#12151f' }],
        img: parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80'],
        imgs: parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80'],
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        d,
        db,
        featured: true,
        flashSale: isFlashSale,
        flashSaleDiscountPercent: isFlashSale ? flashDiscount : undefined,
        flashSaleSold: isFlashSale ? 5 : 0,
        flashSaleStockQuota: isFlashSale ? Number(stock) : undefined,
      });

      onProductCreated();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#f8f9fd] rounded-[32px] shadow-2xl border border-white/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-gray-200/80 flex items-center justify-between glass-panel-strong">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
              New Inventory Item
            </span>
            <h2 className="text-lg sm:text-xl font-medium text-gray-950">
              Add New Product to Store
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                English Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Emerald Jamdani Saree"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Bengali Title *
              </label>
              <input
                type="text"
                required
                value={bn}
                onChange={(e) => setBn(e.target.value)}
                placeholder="e.g. রয়্যাল এমারেল্ড জামদানি শাড়ি"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bn"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Category *
              </label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Price (৳ BDT) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Was Price (Strike)
              </label>
              <input
                type="number"
                value={was || ''}
                onChange={(e) => setWas(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Optional"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs"
              />
            </div>
          </div>

          {/* Flash Sale Checkbox */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
              <input
                type="checkbox"
                checked={isFlashSale}
                onChange={(e) => setIsFlashSale(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                Launch in Flash Deals
              </span>
            </label>

            {isFlashSale && (
              <div>
                <label className="text-xs font-semibold text-amber-900 block mb-1">
                  Flash Discount Percentage (% Off)
                </label>
                <input
                  type="number"
                  min="5"
                  max="80"
                  value={flashDiscount}
                  onChange={(e) => setFlashDiscount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs focus:border-amber-500 outline-none"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Initial Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Available Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="38, 40, 42, 44 or S, M, L, XL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Colors Format: <span className="font-normal text-gray-500">Name (#HexCode), Name (#HexCode)</span>
            </label>
            <input
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="e.g. Royal Navy (#1B2A4A), White (#FFFFFF)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Image URLs (one URL per line)
            </label>
            <textarea
              rows={3}
              value={imgUrls}
              onChange={(e) => setImgUrls(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Tags / Keywords (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Eid, Jamdani, Festive, Silk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              English Description
            </label>
            <textarea
              rows={2}
              value={d}
              onChange={(e) => setD(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Bengali Description
            </label>
            <textarea
              rows={2}
              value={db}
              onChange={(e) => setDb(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bn"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-full bg-[#12151f] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSaving ? 'Creating Product...' : 'Add to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
