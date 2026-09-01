import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Shield,
  ShieldCheck,
  Truck,
  Sparkles,
  PackageCheck,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { CartItem, Product, StoreSettings, UserAccount } from '../types';
import { formatBDT } from '../utils/helpers';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenTracking: () => void;
  products: Product[];
  settings: StoreSettings;
  currentUser: UserAccount | null;
  onOpenAuth: (defaultTab?: 'signin' | 'signup') => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  cart,
  onOpenCart,
  onOpenTracking,
  products,
  settings,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const isStaffOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close user menu & search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const safeProducts = Array.isArray(products) ? products : [];
    const hits = safeProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.bn.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.cat.toLowerCase().includes(q)
      )
      .slice(0, 5);
    setSearchResults(hits);
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      onNavigate(`shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: '', label: 'Home', bn: 'হোম' },
    { href: 'shop', label: 'Shop', bn: 'শপ' },
    { href: 'flash-sales', label: '⚡ Flash Deals', bn: 'ফ্ল্যাশ ডিল' },
    { href: 'about', label: 'About', bn: 'আমাদের কথা' },
    { href: 'contact', label: 'Contact', bn: 'যোগাযোগ' },
  ];

  return (
    <>
      {/* Top Announcement & Delivery Rate Notice Bar */}
      {settings.showTicker && (
        <div className="bg-gradient-to-r from-[#12151f] via-[#242838] to-[#12151f] text-[#f4efe6] text-[11px] tracking-wider py-2 px-4 text-center font-medium border-b border-white/10 flex items-center justify-center gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
            <Truck className="w-3.5 h-3.5" /> Inside Dhaka ৳{settings.shippingFeeInsideDhaka} · Outside Dhaka ৳{settings.shippingFeeOutsideDhaka}
          </span>
          <span className="opacity-90 hidden sm:inline">{settings.tickerNoticeEn}</span>
          {settings.freeShippingThreshold > 0 && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> Free Shipping over ৳{settings.freeShippingThreshold}
            </span>
          )}
        </div>
      )}

      {/* Main Glass Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'py-2.5 shadow-lg' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass-panel-strong rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-md">
            {/* Brand Logo */}
            <BrandLogo
              variant="dark"
              size="md"
              showTagline={true}
              onClick={() => onNavigate('')}
            />

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = currentRoute === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => onNavigate(link.href)}
                    className={`px-4 py-2 rounded-full text-[13.5px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#12151f] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block relative flex-1 max-w-xs mx-2" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center gap-2 bg-white/70 border border-white/90 rounded-full px-3.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/30 focus-within:bg-white transition-all">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search panjabi, saree, oud..."
                    className="w-full text-xs bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Instant Search Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/90 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 px-3 py-1">
                    Matching Products
                  </div>
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        onNavigate(`product/${item.slug}`);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100/80 text-left transition-colors cursor-pointer"
                    >
                      <img
                        src={item.img[0]}
                        alt={item.name}
                        className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] font-bn text-gray-500 truncate">
                          {item.bn}
                        </p>
                        <p className="text-xs font-bold text-amber-700 mt-0.5">
                          {formatBDT(item.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full mt-1 text-center py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-xl cursor-pointer"
                  >
                    View all results for "{searchQuery}" →
                  </button>
                </div>
              )}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Order Tracking */}
              <button
                onClick={onOpenTracking}
                title="Track Order"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 hover:bg-black/5 transition-colors border border-transparent hover:border-black/10 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>Track Order</span>
              </button>

              {/* Unified User Authentication / Profile Menu */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white/90 hover:bg-white border border-gray-200/80 shadow-xs transition-all cursor-pointer"
                    aria-label="User Account Menu"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentUser.role === 'admin'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : currentUser.role === 'moderator'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-neutral-900 text-amber-300'
                    }`}>
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-gray-800 max-w-[100px] truncate hidden md:inline">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 z-50 animate-fade-in space-y-2">
                      <div className="px-3 py-2 bg-slate-50 rounded-xl">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {currentUser.email}
                        </div>
                        <div className="mt-1.5">
                          {currentUser.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <Shield className="w-3 h-3 text-amber-700" />
                              <span>Primary Administrator</span>
                            </span>
                          ) : currentUser.role === 'moderator' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                              <ShieldCheck className="w-3 h-3 text-blue-700" />
                              <span>Staff Moderator</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <User className="w-3 h-3 text-emerald-700" />
                              <span>Customer Account</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Management Suite Button for Admin & Moderator */}
                      {isStaffOrAdmin && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-neutral-900 to-slate-800 text-amber-300 text-xs font-bold flex items-center justify-between hover:from-neutral-800 hover:to-slate-700 transition-all cursor-pointer shadow-xs"
                        >
                          <span className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-amber-400" />
                            <span>{currentUser.role === 'admin' ? 'Master Admin Suite' : 'Staff Moderator Suite'}</span>
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                            Open
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenTracking();
                        }}
                        className="w-full py-2 px-3 rounded-xl text-left text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4 text-emerald-600" />
                        <span>Track My Orders</span>
                      </button>

                      <div className="pt-1 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full py-2 px-3 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 border border-gray-200 shadow-xs hover:border-amber-400 hover:text-amber-900 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Cart Button with Animated Badge */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-sm border border-white/90 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 text-gray-900" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-black/5 text-gray-800 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 px-4 sm:px-6">
            <div className="glass-panel-strong rounded-3xl p-4 shadow-xl border border-white/80 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search panjabi, saree, oud..."
                    className="w-full text-xs outline-none"
                  />
                </div>
              </form>

              {/* Mobile User Profile or Sign in Header */}
              <div className="p-3 bg-white/70 rounded-2xl border border-white flex items-center justify-between">
                {currentUser ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{currentUser.name}</div>
                      <div className="text-[10px] text-gray-500 capitalize">{currentUser.role}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-600">
                    Welcome to VELORA
                  </div>
                )}

                {currentUser ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth('signin');
                    }}
                    className="px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>

              {/* Mobile Nav Links */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {navLinks.map((link) => {
                  const isActive = currentRoute === link.href;
                  return (
                    <button
                      key={link.href}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate(link.href);
                      }}
                      className={`p-3 rounded-2xl text-left text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#12151f] text-white'
                          : 'bg-white/60 hover:bg-white text-gray-800'
                      }`}
                    >
                      <div>{link.label}</div>
                      <div className="text-[11px] opacity-75 font-bn">{link.bn}</div>
                    </button>
                  );
                })}
              </div>

              {/* Staff Management shortcut if authorized */}
              {isStaffOrAdmin && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>{currentUser?.role === 'admin' ? 'Open Master Admin Suite' : 'Open Staff Moderator Suite'}</span>
                </button>
              )}

              {/* Mobile Order Tracking and Delivery Charge Info */}
              <div className="pt-2 border-t border-black/5 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenTracking();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Track Your Order by Phone / ID</span>
                </button>
                <div className="text-[11px] text-gray-600 font-medium text-center flex items-center justify-center gap-2 flex-wrap">
                  <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/60">
                    Inside Dhaka: ৳{settings.shippingFeeInsideDhaka}
                  </span>
                  <span>•</span>
                  <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/60">
                    Outside Dhaka: ৳{settings.shippingFeeOutsideDhaka}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
