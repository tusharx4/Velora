import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, MessageCircle, Truck, MapPin, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../../types';
import { api } from '../../services/api';

interface AdminSettingsProps {
  settings: StoreSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onRefresh,
}) => {
  const [form, setForm] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await api.updateSettings(form);
      if (updated) {
        setForm(updated);
      }
      setSavedSuccess(true);
      if (onRefresh) {
        await onRefresh();
      }
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            System Preferences
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Store Configuration & Logistics
          </h1>
          <p className="text-xs text-slate-500 font-bn mt-0.5">
            হোয়াটসঅ্যাপ নম্বর, ডেলিভারি চার্জ এবং ধানমন্ডি বুটিকের ঠিকানা
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* WhatsApp & Phone Config */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <MessageCircle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">
              WhatsApp Concierge & Hotline Number
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            All one-click customer purchase orders, status updates, and customer chat buttons will open this phone number. Include country code (e.g. 88017...).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                WhatsApp Phone Number (with Country Code) *
              </label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Customer Support Hotline Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Configuration */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Truck className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">
              Nationwide Delivery Rates (৳ BDT)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Inside Dhaka Shipping (৳)
              </label>
              <input
                type="number"
                required
                value={form.shippingFeeInsideDhaka}
                onChange={(e) =>
                  setForm({ ...form, shippingFeeInsideDhaka: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Outside Dhaka Shipping (৳)
              </label>
              <input
                type="number"
                required
                value={form.shippingFeeOutsideDhaka}
                onChange={(e) =>
                  setForm({ ...form, shippingFeeOutsideDhaka: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Free Shipping Threshold (৳)
              </label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) =>
                  setForm({ ...form, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Announcement Ticker Bar */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Top Announcement Ticker Bar
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.showTicker}
                onChange={(e) => setForm({ ...form, showTicker: e.target.checked })}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
              />
              <span>Enable Ticker</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                English Announcement
              </label>
              <input
                type="text"
                value={form.tickerNoticeEn}
                onChange={(e) => setForm({ ...form, tickerNoticeEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Bengali Announcement
              </label>
              <input
                type="text"
                value={form.tickerNoticeBn}
                onChange={(e) => setForm({ ...form, tickerNoticeBn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bn text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <MapPin className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">
              Physical Boutique Location
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Address (English)
              </label>
              <input
                type="text"
                value={form.addressEn}
                onChange={(e) => setForm({ ...form, addressEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Address (Bengali)
              </label>
              <input
                type="text"
                value={form.addressBn}
                onChange={(e) => setForm({ ...form, addressBn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bn text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Admin Security Password */}
        <div className="bg-white rounded-xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600">
              <Lock className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Admin Master Account Password
              </h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Primary Administrator
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Set your master admin password. When saved, this password immediately takes effect for both your email (<code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">ariyantushar44@gmail.com</code>) and username (<code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">admin</code>).
          </p>

          <div className="max-w-md">
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              New Admin Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.adminPassword || ''}
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                placeholder="Enter new admin password (at least 5 characters)"
                required
                className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Note: Click "Save All Settings" below to persist and apply this password immediately.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
