import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Image as ImageIcon, Check, X, ArrowUpRight } from 'lucide-react';
import { BannerSlide } from '../../types';
import { resolvePexelsUrl } from '../../data/initialData';
import { api } from '../../services/api';

interface AdminBannersProps {
  banners: BannerSlide[];
  onRefresh: () => void;
}

export const AdminBanners: React.FC<AdminBannersProps> = ({ banners, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [bn, setBn] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [cta, setCta] = useState('Explore Collection');
  const [href, setHref] = useState('shop');
  const [img, setImg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSaving(true);
      await api.createBanner({
        t: title,
        bn: bn || title,
        s: subtitle,
        cta,
        href,
        img: img || '33257665',
      });
      setIsAdding(false);
      setTitle('');
      setBn('');
      setSubtitle('');
      setImg('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to add banner');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Delete this hero banner slide?')) return;
    try {
      await api.deleteBanner(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete banner');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Storefront Merchandising
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Hero Banners & Campaigns ({banners.length})
          </h1>
          <p className="text-xs text-slate-500 font-bn mt-0.5">
            ওয়েবসাইটের শীর্ষ স্লাইডার ব্যানার, বাংলা ট্যাগলাইন ও কল-টু-অ্যাকশন
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Banner</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Create New Hero Slide
            </h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddBanner} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Headline (English) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Eid Festive Royal Panjabi"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Bengali Eyebrow *
              </label>
              <input
                type="text"
                required
                value={bn}
                onChange={(e) => setBn(e.target.value)}
                placeholder="e.g. ঈদুল ফিতর লাক্সারি কালেকশন"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bn text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Subtitle Description
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Handcrafted silks with pure gold threadwork."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Button Text (CTA)
              </label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="Explore Collection"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Target Route
              </label>
              <input
                type="text"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="shop or shop?cat=panjabi"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Banner Image URL or Pexels Photo ID
              </label>
              <input
                type="text"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                placeholder="e.g. 33257665 or https://images.pexels.com/..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Add Banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between group hover:border-indigo-200 transition-colors"
          >
            <div className="relative h-44 bg-slate-900 overflow-hidden">
              <img
                src={resolvePexelsUrl(b.img)}
                alt={b.t}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-bn">
                  {b.bn}
                </span>
                <h3 className="text-base font-semibold leading-tight">{b.t}</h3>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500 min-w-0">
                <p className="truncate text-slate-700">{b.s}</p>
                <p className="text-[10.5px] font-mono text-indigo-600 mt-0.5">
                  Link: {b.href} ({b.cta})
                </p>
              </div>

              <button
                onClick={() => handleDeleteBanner(b.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                title="Delete Banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
