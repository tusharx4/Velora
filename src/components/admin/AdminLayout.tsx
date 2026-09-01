import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Image as ImageIcon,
  Settings,
  Sparkles,
  RotateCcw,
  Menu,
  X,
  TrendingUp,
  Store,
  ChevronRight,
  ShieldCheck,
  Flame,
  LogOut,
  Users,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { AnalyticsSummary, StoreSettings, UserAccount } from '../../types';
import { formatBDT } from '../../utils/helpers';
import { BrandLogo } from '../BrandLogo';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onExitAdmin: () => void;
  onLogoutAdmin?: () => void;
  analytics: AnalyticsSummary | null;
  settings: StoreSettings;
  currentUser: UserAccount | null;
  onResetData: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  onLogoutAdmin,
  analytics,
  settings,
  currentUser,
  onResetData,
  children,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isPrimaryAdmin = currentUser?.isPrimaryAdmin || currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: <LayoutDashboard className="w-4 h-4" />, badge: null },
    { id: 'products', label: 'Products & Inventory', icon: <Package className="w-4 h-4" />, badge: analytics?.totalProducts },
    { id: 'flash-sales', label: 'Flash Sales & Deals', icon: <Flame className="w-4 h-4 text-amber-400" />, badge: analytics?.flashSaleProductsCount ? `${analytics.flashSaleProductsCount} live` : null },
    { id: 'orders', label: 'Orders & Shipments', icon: <ShoppingBag className="w-4 h-4" />, badge: analytics?.pendingOrders ? `${analytics.pendingOrders} new` : null },
    { id: 'live-chats', label: 'Live Chats & Inquiries', icon: <MessageSquare className="w-4 h-4 text-emerald-500" />, badge: 'Firebase' },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" />, badge: null },
    { id: 'banners', label: 'Hero Banners', icon: <ImageIcon className="w-4 h-4" />, badge: null },
    { id: 'ai-assistant', label: 'AI Product Generator', icon: <Sparkles className="w-4 h-4 text-indigo-400" />, badge: 'AI' },
    { id: 'users', label: 'Users & Role Permissions', icon: <Users className="w-4 h-4 text-amber-400" />, badge: 'Admin Only' },
    { id: 'settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" />, badge: isModerator ? 'Locked' : null },
  ];

  const currentTabLabel = menuItems.find((m) => m.id === currentTab)?.label || 'Overview';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Header Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Toggle Navigation"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo & Portal Badge */}
            <div className="flex items-center gap-2.5">
              <BrandLogo variant="dark" size="sm" showTagline={false} />
              {isPrimaryAdmin ? (
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-700" />
                  <span>Main Admin</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-blue-100 text-blue-900 rounded-full border border-blue-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-700" />
                  <span>Staff Moderator</span>
                </span>
              )}
            </div>

            {/* Breadcrumb path (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 pl-3 border-l border-slate-200">
              <span>Management</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-800">{currentTabLabel}</span>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile Pill */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                  {currentUser.name}
                </span>
              </div>
            )}

            {analytics && (
              <div className="hidden xl:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Revenue: <b className="text-slate-900">{formatBDT(analytics.totalRevenue)}</b></span>
                </span>
                <span className="text-slate-300">|</span>
                <span>Orders: <b className="text-slate-900">{analytics.totalOrders}</b></span>
              </div>
            )}

            {isPrimaryAdmin && (
              <button
                onClick={onResetData}
                title="Reset to default initial catalog"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Store</span>
              </button>
            )}

            <button
              onClick={onExitAdmin}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Storefront</span>
            </button>

            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                title="Lock Session & Sign Out"
                className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        {/* Dark Sidebar */}
        <aside
          className={`md:w-64 flex-shrink-0 space-y-4 ${
            isMobileNavOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-3 shadow-sm border border-slate-800 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Navigation</span>
              {isModerator && (
                <span className="text-[9px] text-blue-400 font-semibold lowercase">
                  moderator access
                </span>
              )}
            </div>
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              const isLockedForMod = isModerator && (item.id === 'users' || item.id === 'settings');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : isLockedForMod
                      ? 'text-slate-500 hover:text-slate-400 hover:bg-slate-800/50'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-slate-950 text-amber-400'
                          : isLockedForMod
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Role Status Card */}
          <div className="bg-white rounded-2xl p-4 text-xs text-slate-600 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              {isPrimaryAdmin ? (
                <Shield className="w-4 h-4 text-amber-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              )}
              <span>{isPrimaryAdmin ? 'Primary Admin Account' : 'Staff Moderator Account'}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isPrimaryAdmin
                ? 'Sole master administrator with complete authority over user roles, finance rates, and store settings.'
                : 'Restricted management access to catalog products, order fulfillment, flash sales, and banners.'}
            </p>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
