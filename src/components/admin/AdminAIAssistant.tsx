import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RefreshCw, Wand2, Package, Tag } from 'lucide-react';
import { Category, Product } from '../../types';
import { formatBDT } from '../../utils/helpers';
import { api } from '../../services/api';

interface AdminAIAssistantProps {
  categories: Category[];
  onProductCreated: () => void;
}

export const AdminAIAssistant: React.FC<AdminAIAssistantProps> = ({
  categories,
  onProductCreated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Luxury Panjabi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<Partial<Product> | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [error, setError] = useState('');

  const samplePrompts = [
    'Handloom Dhakai Jamdani Saree with antique gold zari work and matching blouse piece',
    'Royal Velvet Midnight Black Sherwani with zardozi collar embroidery',
    'Pure Royal Oud & Cambodian Wood Luxury Attar with crystal decanter',
    'Hand-stitched Italian Cotton Semi-Formal Tailored Shirt in pastel azure',
    'Traditional Tangail Hand-Spun Khadi Kurta for Pohela Boishakh',
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return;

    setError('');
    setIsGenerating(true);
    setPublishedSuccess(false);

    try {
      const data = await api.generateProductWithAI(textToUse, category);
      setGeneratedData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate product copy using AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedData) return;

    try {
      setIsPublishing(true);
      setError('');
      await api.createProduct({
        name: generatedData.name || 'Artisanal Boutique Piece',
        bn: generatedData.bn || 'অনুপম কারুকাজ',
        cat: generatedData.cat || category,
        price: generatedData.price || 4500,
        was: generatedData.was,
        stock: generatedData.stock || 25,
        rating: 4.9,
        rc: 14,
        img: generatedData.img && generatedData.img.length > 0
          ? generatedData.img
          : ['https://images.pexels.com/photos/33257665/pexels-photo-33257665.jpeg?auto=compress&cs=tinysrgb&w=800'],
        sizes: generatedData.sizes || ['M', 'L', 'XL'],
        colors: generatedData.colors || [{ n: 'Classic', h: '#12151f' }],
        tags: generatedData.tags || ['Handcrafted', 'Festive'],
        d: generatedData.d || 'Hand-curated luxury item.',
        db: generatedData.db || 'শতভাগ খাঁটি হ্যান্ডলুম ও অভিজাত ফিনিশিং।',
        featured: true,
      });

      setPublishedSuccess(true);
      onProductCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to publish generated product.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Server-Side Gemini AI Suite
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          Intelligent Boutique Catalog Creator
        </h1>
        <p className="text-xs text-slate-500 font-bn mt-1 max-w-xl">
          যেকোনো পণ্যের বিবরণ বা থিম লিখুন — জেমিনাই এআই স্বয়ংক্রিয়ভাবে ইংরেজি ও বাংলা বিবরণ, ট্যাগ, মূল্য ও সাইজ জেনারেট করবে।
        </p>
      </div>

      {/* Generation Form */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Describe the luxury product or design concept *
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Royal Emerald Green Silk Panjabi with hand embroidery for Eid wedding"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm outline-none focus:border-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Target Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-indigo-500 text-slate-800"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name} ({c.bn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block mb-2">
            Or try one of these suggestions:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrompt(s);
                  handleGenerate(s);
                }}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-slate-700 transition-colors text-left cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-4 h-4 animate-spin" />
                <span>Crafting with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Complete Catalog Listing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Generated Result Preview Box */}
      {generatedData && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                AI Generation Ready
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Review & Publish to Store
              </h2>
            </div>

            {publishedSuccess ? (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Published to Catalog!</span>
              </div>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Package className="w-4 h-4" />
                <span>{isPublishing ? 'Publishing...' : 'Publish to Storefront'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {generatedData.cat}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {generatedData.name}
                </h3>
                <p className="text-sm font-bn text-slate-600 mt-0.5">
                  {generatedData.bn}
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-slate-900">
                  {formatBDT(generatedData.price || 0)}
                </span>
                {generatedData.was && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatBDT(generatedData.was)}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <p>{generatedData.d}</p>
                <p className="font-bn text-slate-600 border-t border-slate-200 pt-2">
                  {generatedData.db}
                </p>
              </div>
            </div>

            {/* Variants & Meta */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Available Sizes:
                </span>
                <div className="flex flex-wrap gap-2">
                  {generatedData.sizes?.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Color Swatches:
                </span>
                <div className="flex flex-wrap gap-2">
                  {generatedData.colors?.map((c) => (
                    <span
                      key={c.n}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium flex items-center gap-1.5 text-slate-700"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: c.h }}
                      />
                      <span>{c.n}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Tags & Search Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedData.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-100"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
