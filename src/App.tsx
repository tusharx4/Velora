import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Lock,
} from 'lucide-react';
import {
  Product,
  Category,
  BannerSlide,
  StoreSettings,
  CartItem,
  Order,
  DeliveryZone,
  AnalyticsSummary,
  UserAccount,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_ORDERS,
} from './data/initialData';
import { api } from './services/api';
import { formatBDT, getWhatsAppUrl } from './utils/helpers';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { TrustBadges } from './components/TrustBadges';
import { CategoryScroller } from './components/CategoryScroller';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ShopPage } from './components/ShopPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { FlashSaleSection } from './components/FlashSaleSection';
import { FlashSalePage } from './components/FlashSalePage';
import { CategoryProductSections } from './components/CategoryProductSections';
import { BrandLogo } from './components/BrandLogo';
import { AuthModal } from './components/AuthModal';
import { LiveChatWidget } from './components/LiveChatWidget';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminBanners } from './components/admin/AdminBanners';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminAIAssistant } from './components/admin/AdminAIAssistant';
import { AdminFlashSales } from './components/admin/AdminFlashSales';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminFirebaseChats } from './components/admin/AdminFirebaseChats';
import { CreateProductModal } from './components/admin/CreateProductModal';


export function App() {
  // Core Store Data
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<BannerSlide[]>(INITIAL_BANNERS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Router State
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive UI State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('velora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [checkoutZone, setCheckoutZone] = useState<DeliveryZone>('dhaka');

  // Unified User & Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => api.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  // Admin Workspace State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('velora_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Load All Backend Data
  const loadData = useCallback(async () => {
    try {
      const [prodsRes, cats, bans, setts, ordsRes, anas] = await Promise.all([
        api.getProducts().catch(() => ({ total: INITIAL_PRODUCTS.length, products: INITIAL_PRODUCTS })),
        api.getCategories().catch(() => INITIAL_CATEGORIES),
        api.getBanners().catch(() => INITIAL_BANNERS),
        api.getSettings().catch(() => INITIAL_SETTINGS),
        api.getOrders().catch(() => ({ total: INITIAL_ORDERS.length, orders: INITIAL_ORDERS })),
        api.getAnalytics().catch(() => null),
      ]);
      if (prodsRes && Array.isArray((prodsRes as any).products)) {
        setProducts((prodsRes as any).products);
      } else if (Array.isArray(prodsRes)) {
        setProducts(prodsRes);
      }
      if (Array.isArray(cats)) setCategories(cats);
      if (Array.isArray(bans)) setBanners(bans);
      if (setts) setSettings(setts);
      if (ordsRes && Array.isArray((ordsRes as any).orders)) {
        setOrders((ordsRes as any).orders);
      } else if (Array.isArray(ordsRes)) {
        setOrders(ordsRes);
      }
      if (anas) setAnalytics(anas);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Verify Current User Session on Mount
  useEffect(() => {
    api.fetchCurrentUser().then((user) => {
      setCurrentUser(user);
    }).catch(() => {
      // Offline fallback: use local user
    });
  }, []);

  const handleOpenAuth = (tab: 'signin' | 'signup' = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setIsAdminMode(false);
  };

  const handleOpenAdminAccess = useCallback(() => {
    const user = api.getCurrentUser();
    if (user && (user.role === 'admin' || user.role === 'moderator')) {
      setIsAdminMode(true);
    } else {
      // User is either not logged in or is a standard customer
      setAuthModalTab('signin');
      setIsAuthModalOpen(true);
    }
  }, []);

  // Hash Navigation Listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('product/')) {
        const slug = hash.replace('product/', '');
        const found = products.find((p) => p.slug === slug);
        if (found) {
          setSelectedProduct(found);
        }
      } else if (hash.startsWith('admin')) {
        const user = api.getCurrentUser();
        if (user && (user.role === 'admin' || user.role === 'moderator')) {
          setIsAdminMode(true);
        } else {
          setAuthModalTab('signin');
          setIsAuthModalOpen(true);
        }
      } else {
        setCurrentRoute(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  const handleNavigate = (route: string) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Functions
  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    size?: string,
    color?: string
  ) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor = color || product.colors[0]?.n || 'Standard';

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.pid === product.id && i.size === chosenSize && i.color === chosenColor
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].qty += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          pid: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          img: product.img[0],
          size: chosenSize,
          color: chosenColor,
          qty: quantity,
        },
      ];
    });

    setIsCartOpen(true);
    if (selectedProduct) {
      setSelectedProduct(null);
    }
  };

  const handleUpdateQuantity = (
    pid: string,
    size?: string,
    color?: string,
    delta: number = 1
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.pid === pid && item.size === size && item.color === color) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (pid: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.pid === pid && item.size === size && item.color === color)
      )
    );
  };

  const handleOpenCheckout = (zone: DeliveryZone) => {
    setCheckoutZone(zone);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setCart([]);
    loadData();
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all catalog and orders to default boutique dataset?')) return;
    try {
      await api.resetData();
      await loadData();
      alert('Data reset successfully!');
    } catch (e) {
      alert('Failed to reset data');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fd] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 animate-spin flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 rounded-full bg-[#f8f9fd]" />
        </div>
        <p className="text-xs uppercase tracking-[0.25em] font-bold text-gray-800">
          Loading VELORA Boutique...
        </p>
      </div>
    );
  }

  const isStaffOrAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator');

  // Admin View (Protected for Admin and Moderator)
  if (isAdminMode && isStaffOrAdmin) {
    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onExitAdmin={() => setIsAdminMode(false)}
        onLogoutAdmin={handleLogout}
        analytics={analytics}
        settings={settings}
        currentUser={currentUser}
        onResetData={handleResetData}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            analytics={analytics}
            orders={orders}
            onSelectTab={setAdminTab}
            onOpenNewProduct={() => setIsCreateProductOpen(true)}
          />
        )}
        {adminTab === 'products' && (
          <AdminProducts
            products={products}
            categories={categories}
            onRefresh={loadData}
            onOpenAI={() => setAdminTab('ai-assistant')}
            onOpenNewProduct={() => setIsCreateProductOpen(true)}
          />
        )}
        {adminTab === 'flash-sales' && (
          <AdminFlashSales
            products={products}
            settings={settings}
            onRefresh={loadData}
          />
        )}
        {adminTab === 'orders' && (
          <AdminOrders orders={orders} onRefresh={loadData} />
        )}
        {adminTab === 'live-chats' && (
          <AdminFirebaseChats />
        )}
        {adminTab === 'categories' && (
          <AdminCategories categories={categories} onRefresh={loadData} />
        )}
        {adminTab === 'banners' && (
          <AdminBanners banners={banners} onRefresh={loadData} />
        )}
        {adminTab === 'ai-assistant' && (
          <AdminAIAssistant
            categories={categories}
            onProductCreated={() => {
              loadData();
              setAdminTab('products');
            }}
          />
        )}
        {adminTab === 'users' && (
          <AdminUsers currentUser={currentUser} />
        )}
        {adminTab === 'settings' && (
          <AdminSettings settings={settings} onRefresh={loadData} />
        )}

        <CreateProductModal
          isOpen={isCreateProductOpen}
          onClose={() => setIsCreateProductOpen(false)}
          categories={categories}
          onProductCreated={() => {
            loadData();
            setIsCreateProductOpen(false);
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen ambient-bg flex flex-col antialiased text-[#12151f] selection:bg-amber-500 selection:text-white">
      {/* Top Floating Glass Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        products={products}
        settings={settings}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenAdmin={handleOpenAdminAccess}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 flex-1 w-full pb-16">
        {/* Route: Flash Sale Page */}
        {currentRoute === 'flash-sales' || currentRoute === 'flash' || (currentRoute.startsWith('shop?') && currentRoute.includes('flash=true')) ? (
          <FlashSalePage
            products={products}
            categories={categories}
            onOpenProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p, e) => {
              e.stopPropagation();
              handleAddToCart(p, 1);
            }}
            onNavigate={handleNavigate}
            settings={settings}
          />
        ) : currentRoute === 'shop' || currentRoute.startsWith('shop?') ? (
          <ShopPage
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p, e) => {
              e.stopPropagation();
              handleAddToCart(p, 1);
            }}
            settings={settings}
            initialSearch={new URLSearchParams(currentRoute.split('?')[1] || '').get('search') || ''}
          />
        ) : currentRoute === 'about' ? (
          <AboutPage settings={settings} onNavigate={handleNavigate} />
        ) : currentRoute === 'contact' ? (
          <ContactPage settings={settings} />
        ) : (
          /* Route: Home */
          <div className="space-y-12 py-2 animate-in fade-in duration-300">
            {/* Hero Slider */}
            <HeroSlider banners={banners} onNavigate={handleNavigate} />

            {/* Live Flash Sale Showcase Section */}
            {settings.flashSaleActive && (
              <FlashSaleSection
                products={products}
                onOpenProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p, e) => {
                  e.stopPropagation();
                  handleAddToCart(p, 1);
                }}
                onViewAllFlashDeals={() => handleNavigate('flash-sales')}
                whatsappPhone={settings.whatsappNumber}
              />
            )}

            {/* Fast Value Proposition Badges */}
            <TrustBadges settings={settings} />

            {/* Category Scroller Navigation */}
            <CategoryScroller
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(slug) => {
                setSelectedCategory(slug);
                handleNavigate(`shop?category=${slug}`);
              }}
            />

            {/* Curated Products From Every Category */}
            <CategoryProductSections
              categories={categories}
              products={products}
              onOpenProduct={(p) => setSelectedProduct(p)}
              onAddToCart={(p, e) => {
                e.stopPropagation();
                handleAddToCart(p, 1);
              }}
              onSelectCategory={(slug) => setSelectedCategory(slug)}
              onNavigate={handleNavigate}
              settings={settings}
            />

            {/* Direct WhatsApp Concierge Banner */}
            <section className="glass-panel-strong rounded-3xl p-6 sm:p-10 border border-white/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Personal Shopping Concierge</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-medium text-gray-950">
                  Looking for bespoke sizing or bridal consultations?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-bn max-w-lg">
                  আমাদের ফ্যাশন কনসালট্যান্টের সাথে সরাসরি হোয়াটসঅ্যাপে কথা বলুন এবং কাস্টম অর্ডার কনফার্ম করুন।
                </p>
              </div>

              <a
                href={getWhatsAppUrl(
                  settings.whatsappNumber,
                  'Assalamu Alaikum, I would like to inquire about customized boutique orders at VELORA.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-gradient-btn px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:scale-105 transition-all whitespace-nowrap animate-wa-pulse"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-bn">হোয়াটসঅ্যাপে চ্যাট করুন</span>
              </a>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#12151f] text-[#f4efe6] pt-14 pb-8 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3 md:col-span-2">
            <BrandLogo
              variant="light"
              size="md"
              showTagline={true}
              onClick={() => handleNavigate('')}
            />
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed pt-1">
              {settings.storeTaglineEn} — Handloom jamdani sarees, tailored royal panjabis, artisan footwear, and pure oud perfumery.
            </p>
            <p className="text-xs font-bn text-amber-300/80">
              {settings.addressBn} · ধানমন্ডি, ঢাকা
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-amber-400 mb-3 text-[11px]">
              Customer Service
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>
                <button onClick={() => setIsTrackingOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Boutique
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact & Store Location
                </button>
              </li>
              <li>
                <button
                  onClick={handleOpenAdminAccess}
                  className="hover:text-amber-300 transition-colors text-gray-500 hover:underline flex items-center gap-1.5 cursor-pointer text-[11px]"
                >
                  <Lock className="w-3 h-3 opacity-60" />
                  <span>Staff / Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-amber-400 mb-3 text-[11px]">
              Delivery & Payment
            </h4>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Inside Dhaka: ৳{settings.shippingFeeInsideDhaka} (24-48 hrs)</span>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Outside Dhaka: ৳{settings.shippingFeeOutsideDhaka} (48-72 hrs)</span>
              </p>
              <p className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cash on Delivery & bKash Verified</span>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} VELORA Luxury Boutique. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Dhanmondi, Dhaka</span>
            <span>•</span>
            <span>WhatsApp: +{settings.whatsappNumber}</span>
          </div>
        </div>
      </footer>

      {/* Floating Firebase Live Chat Widget */}
      <LiveChatWidget
        currentUser={currentUser}
        settings={settings}
        onOpenAuth={() => {
          setAuthModalTab('login');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={getWhatsAppUrl(
          settings.whatsappNumber,
          'Assalamu Alaikum VELORA Boutique! I would like to inquire about products.'
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full wa-gradient-btn text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center animate-wa-pulse"
        title="Chat on WhatsApp"
        aria-label="Chat with VELORA on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProduct}
        allProducts={products}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenProduct={(p) => setSelectedProduct(p)}
        settings={settings}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={handleOpenCheckout}
        settings={settings}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        deliveryZone={checkoutZone}
        settings={settings}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Unified Login & Sign-up Modal for All Users and Roles */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin' || user.role === 'moderator') {
            setIsAdminMode(true);
          }
        }}
      />
    </div>
  );
}
export default App;
