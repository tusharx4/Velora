import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Layers, Check, X } from 'lucide-react';
import { Category } from '../../types';
import { resolvePexelsUrl } from '../../data/initialData';
import { api } from '../../services/api';

interface AdminCategoriesProps {
  categories: Category[];
  onRefresh: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onRefresh,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [bn, setBn] = useState('');
  const [slug, setSlug] = useState('');
  const [img, setImg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSaving(true);
      await api.createCategory({
        name,
        bn: bn || name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        img: img || '33257665',
      });
      setIsAdding(false);
      setName('');
      setBn('');
      setSlug('');
      setImg('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (catSlug: string) => {
    if (!window.confirm(`Delete category "${catSlug}"?`)) return;
    try {
      await api.deleteCategory(catSlug);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Store Taxonomy
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Collections & Categories ({categories.length})
          </h1>
          <p className="text-xs text-slate-500 font-bn mt-0.5">
            বুটিক কালেকশন তৈরি, এডিট ও ইমেজ থাম্বনেইল পরিচালনা
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Add Category Form Drawer/Card */}
      {isAdding && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Create New Category
            </h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Category Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. Wedding Couture"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Bengali Label *
              </label>
              <input
                type="text"
                required
                value={bn}
                onChange={(e) => setBn(e.target.value)}
                placeholder="e.g. ব্রাইডাল কালেকশন"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bn text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. wedding-couture"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Thumbnail Image URL or Pexels ID
              </label>
              <input
                type="text"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                placeholder="e.g. 33257665 or https://..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
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
                {isSaving ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div
            key={c.slug}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3 group hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                <img
                  src={resolvePexelsUrl(c.img)}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{c.name}</h3>
                <p className="text-[11px] font-bn text-slate-500">{c.bn}</p>
                <span className="text-[10px] font-mono text-indigo-700">
                  /{c.slug}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDeleteCategory(c.slug)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
