import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  StoredUser,
  resolvePexelsUrl,
} from './src/data/initialData.ts';
import { Product, Category, BannerSlide, StoreSettings, Order, OrderStatus, UserAccount, UserRole } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-Memory Database with optional JSON persistence
interface StoreDB {
  products: Product[];
  categories: Category[];
  banners: BannerSlide[];
  settings: StoreSettings;
  orders: Order[];
  users: StoredUser[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

let db: StoreDB = {
  products: [...INITIAL_PRODUCTS],
  categories: [...INITIAL_CATEGORIES],
  banners: [...INITIAL_BANNERS],
  settings: { ...INITIAL_SETTINGS },
  orders: [...INITIAL_ORDERS],
  users: [...INITIAL_USERS],
};

function loadData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.products && Array.isArray(parsed.products) && parsed.products.length > 0) {
        // Build map of initial products
        const initMap = new Map(INITIAL_PRODUCTS.map((p: Product) => [p.id, p]));
        const mergedProducts: Product[] = [];
        const seenIds = new Set<string>();

        // Keep saved products (preserving user-edited image links, prices, titles)
        for (const p of parsed.products) {
          seenIds.add(p.id);
          const initP = initMap.get(p.id);
          
          // Ensure image arrays are properly formatted and valid
          const rawImgs = Array.isArray(p.imgs) && p.imgs.length > 0
            ? p.imgs
            : Array.isArray(p.img) && p.img.length > 0
            ? p.img
            : (initP ? initP.imgs : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80']);
          const resolvedImgs = rawImgs.map(resolvePexelsUrl);

          mergedProducts.push({
            ...p,
            imgs: rawImgs.map(String),
            img: resolvedImgs,
            stock: p.stock !== undefined ? Number(p.stock) : (initP ? initP.stock : 20),
            price: p.price !== undefined ? Number(p.price) : (initP ? initP.price : 1000),
          });
        }

        // Add any missing initial products
        for (const initP of INITIAL_PRODUCTS) {
          if (!seenIds.has(initP.id)) {
            mergedProducts.push(initP);
          }
        }

        // Merge users
        let savedUsers: StoredUser[] = Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : [...INITIAL_USERS];
        // Ensure primary admin always exists and has admin role
        const primaryAdminIdx = savedUsers.findIndex((u) => u.isPrimaryAdmin || u.email.toLowerCase() === 'ariyantushar44@gmail.com' || u.email.toLowerCase() === 'admin@velora.com');
        if (primaryAdminIdx === -1) {
          savedUsers.unshift(INITIAL_USERS[0]);
        } else {
          savedUsers[primaryAdminIdx].role = 'admin';
          savedUsers[primaryAdminIdx].isPrimaryAdmin = true;
        }

        db = {
          products: mergedProducts,
          categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : INITIAL_CATEGORIES,
          banners: parsed.banners && parsed.banners.length > 0 ? parsed.banners : INITIAL_BANNERS,
          settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
          orders: parsed.orders || INITIAL_ORDERS,
          users: savedUsers,
        };
        saveData();
        console.log(`[Store] Loaded ${db.products.length} products, ${db.orders.length} orders, and ${db.users.length} users.`);
        return;
      }
    }
  } catch (err) {
    console.error('[Store] Error loading data from file, using initial data:', err);
  }
  // Initialize with initial data if no file
  db = {
    products: [...INITIAL_PRODUCTS],
    categories: [...INITIAL_CATEGORIES],
    banners: [...INITIAL_BANNERS],
    settings: { ...INITIAL_SETTINGS },
    orders: [...INITIAL_ORDERS],
    users: [...INITIAL_USERS],
  };
  saveData();
}

function saveData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Failed to persist data to disk:', err);
  }
}

loadData();

// Helper: Lazy Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/* ==========================================================================
   REST API ENDPOINTS
   ========================================================================== */

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), productsCount: db.products.length });
});

// Products: List & Filter
app.get('/api/products', (req, res) => {
  const { category, search, tag, sort, stockOnly, maxPrice, flash } = req.query;
  let list = [...db.products];

  if (flash === 'true') {
    list = list.filter((p) => p.flashSale);
  }
  if (category && category !== 'all') {
    list = list.filter((p) => p.cat === category);
  }
  if (tag && tag !== 'all') {
    list = list.filter((p) => p.tags.includes(String(tag)));
  }
  if (stockOnly === 'true') {
    list = list.filter((p) => p.stock > 0);
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
    list = list.filter((p) => p.price <= Number(maxPrice));
  }
  if (search) {
    const q = String(search).toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.bn.toLowerCase().includes(q) ||
        p.d.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sort === 'asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'new') {
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime() || b.rating - a.rating);
  } else {
    // Default featured: Flash sale & in-stock first, high rating/review count
    list.sort((a, b) => (b.flashSale ? 1 : 0) - (a.flashSale ? 1 : 0) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0) || b.rc - a.rc);
  }

  res.json({ total: list.length, products: list });
});

// Products: Single
app.get('/api/products/:slugOrId', (req, res) => {
  const target = req.params.slugOrId;
  const p = db.products.find((item) => item.slug === target || item.id === target);
  if (!p) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(p);
});

// Products: Create (Admin)
app.post('/api/products', (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.price || !body.cat) {
      return res.status(400).json({ error: 'Name, price, and category are required.' });
    }

    const id = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const baseSlug = (body.slug || body.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    let slug = baseSlug || `item-${Date.now()}`;
    let counter = 1;
    while (db.products.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const rawImgs = Array.isArray(body.imgs) && body.imgs.length > 0
      ? body.imgs
      : Array.isArray(body.img) && body.img.length > 0
      ? body.img
      : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80'];

    const resolvedImgs = rawImgs.map(resolvePexelsUrl);

    const newProduct: Product = {
      id,
      slug,
      name: body.name.trim(),
      bn: body.bn ? body.bn.trim() : body.name.trim(),
      price: Number(body.price),
      was: body.was ? Number(body.was) : undefined,
      cat: body.cat,
      stock: body.stock !== undefined ? Number(body.stock) : 20,
      imgs: rawImgs.map(String),
      img: resolvedImgs,
      sizes: Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : ['Free size'],
      colors: Array.isArray(body.colors) && body.colors.length > 0 ? body.colors : [{ n: 'Default', h: '#b07a1b' }],
      rating: body.rating ? Number(body.rating) : 4.9,
      rc: body.rc ? Number(body.rc) : 1,
      tags: Array.isArray(body.tags) ? body.tags : ['new', body.cat],
      d: body.d || 'Handcrafted luxury piece designed for effortless elegance and all-day comfort.',
      db: body.db || 'অভিজাত ডিজাইন ও সেরা মানের কাপড়। সারা দেশে ক্যাশ অন ডেলিভারি।',
      featured: Boolean(body.featured),
      flashSale: Boolean(body.flashSale),
      flashSaleDiscountPercent: body.flashSaleDiscountPercent ? Number(body.flashSaleDiscountPercent) : undefined,
      flashSaleSold: body.flashSaleSold ? Number(body.flashSaleSold) : 0,
      flashSaleStockQuota: body.flashSaleStockQuota ? Number(body.flashSaleStockQuota) : 20,
      flashSaleEndsAt: body.flashSale ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    saveData();
    res.status(201).json(newProduct);
  } catch (err: any) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

// Products: Update (Admin)
app.put('/api/products/:id', (req, res) => {
  try {
    const id = req.params.id;
    const index = db.products.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existing = db.products[index];
    const body = req.body;

    const rawImgs = Array.isArray(body.imgs) && body.imgs.length > 0
      ? body.imgs
      : Array.isArray(body.img) && body.img.length > 0
      ? body.img
      : existing.imgs;
    const resolvedImgs = rawImgs.map(resolvePexelsUrl);

    const updatedProduct: Product = {
      ...existing,
      name: body.name !== undefined ? body.name.trim() : existing.name,
      bn: body.bn !== undefined ? body.bn.trim() : existing.bn,
      slug: body.slug ? body.slug.trim() : existing.slug,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      was: body.was !== undefined ? (body.was ? Number(body.was) : undefined) : existing.was,
      cat: body.cat !== undefined ? body.cat : existing.cat,
      stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
      imgs: rawImgs.map(String),
      img: resolvedImgs,
      sizes: Array.isArray(body.sizes) ? body.sizes : existing.sizes,
      colors: Array.isArray(body.colors) ? body.colors : existing.colors,
      tags: Array.isArray(body.tags) ? body.tags : existing.tags,
      d: body.d !== undefined ? body.d : existing.d,
      db: body.db !== undefined ? body.db : existing.db,
      featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
      flashSale: body.flashSale !== undefined ? Boolean(body.flashSale) : existing.flashSale,
      flashSaleDiscountPercent: body.flashSaleDiscountPercent !== undefined ? Number(body.flashSaleDiscountPercent) : existing.flashSaleDiscountPercent,
      flashSaleSold: body.flashSaleSold !== undefined ? Number(body.flashSaleSold) : existing.flashSaleSold,
      flashSaleStockQuota: body.flashSaleStockQuota !== undefined ? Number(body.flashSaleStockQuota) : existing.flashSaleStockQuota,
      flashSaleEndsAt: body.flashSaleEndsAt !== undefined ? body.flashSaleEndsAt : existing.flashSaleEndsAt,
    };

    db.products[index] = updatedProduct;
    saveData();
    res.json(updatedProduct);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

// Products: Delete (Admin)
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const index = db.products.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const deleted = db.products.splice(index, 1)[0];
  saveData();
  res.json({ message: 'Product deleted', product: deleted });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json(db.categories);
});

app.post('/api/categories', (req, res) => {
  const { name, bn, d, img, slug } = req.body;
  if (!name || !bn) {
    return res.status(400).json({ error: 'Category name and Bengali name required.' });
  }
  const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (db.categories.some((c) => c.slug === catSlug)) {
    return res.status(400).json({ error: 'Category slug already exists.' });
  }
  const newCat: Category = {
    slug: catSlug,
    name: name.trim(),
    bn: bn.trim(),
    d: d || '',
    img: img || 10423569,
  };
  db.categories.push(newCat);
  saveData();
  res.status(201).json(newCat);
});

app.delete('/api/categories/:slug', (req, res) => {
  const slug = req.params.slug;
  const idx = db.categories.findIndex((c) => c.slug === slug);
  if (idx === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  const deleted = db.categories.splice(idx, 1)[0];
  saveData();
  res.json({ message: 'Category removed', category: deleted });
});

// Banners
app.get('/api/banners', (req, res) => {
  res.json(db.banners);
});

app.post('/api/banners', (req, res) => {
  const { t, bn, s, img, cta, href } = req.body;
  if (!t || !s) {
    return res.status(400).json({ error: 'Title and subtitle required' });
  }
  const newBanner: BannerSlide = {
    id: `b_${Date.now()}`,
    t: t.trim(),
    bn: bn ? bn.trim() : t.trim(),
    s: s.trim(),
    img: img || 15889856,
    cta: cta || 'Shop Now',
    href: href || '#/shop',
  };
  db.banners.push(newBanner);
  saveData();
  res.status(201).json(newBanner);
});

app.delete('/api/banners/:id', (req, res) => {
  const id = req.params.id;
  const idx = db.banners.findIndex((b) => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Banner not found' });
  const deleted = db.banners.splice(idx, 1)[0];
  saveData();
  res.json({ message: 'Banner removed', banner: deleted });
});

// Orders: List
app.get('/api/orders', (req, res) => {
  const { status, search } = req.query;
  let list = [...db.orders];
  if (status && status !== 'all') {
    list = list.filter((o) => o.status === status);
  }
  if (search) {
    const q = String(search).toLowerCase().trim();
    list = list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  }
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ total: list.length, orders: list });
});

// Orders: Track customer order by Phone or ID
app.get('/api/orders/track/:query', (req, res) => {
  const q = req.params.query.trim().toLowerCase();
  const hits = db.orders.filter(
    (o) =>
      o.id.toLowerCase() === q ||
      o.customerPhone.replace(/[^0-9]/g, '').endsWith(q.replace(/[^0-9]/g, '')) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === q)
  );
  if (!hits.length) {
    return res.status(404).json({ error: 'No orders found matching this phone number or Order ID.' });
  }
  res.json(hits);
});

// Orders: Create (From Storefront COD / WhatsApp Checkout)
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, deliveryZone, address, city, note, items, paymentMethod } = req.body;

    if (!customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer phone and items are required.' });
    }

    const orderId = `VEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const zone = deliveryZone === 'outside' ? 'outside' : 'dhaka';
    const shippingFee = zone === 'dhaka' ? db.settings.shippingFeeInsideDhaka : db.settings.shippingFeeOutsideDhaka;

    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const linePrice = Number(item.price || 0);
      const lineQty = Number(item.quantity || item.qty || 1);
      subtotal += linePrice * lineQty;

      // Auto-decrement inventory stock if available
      const p = db.products.find((prod) => prod.slug === item.slug || prod.name === item.name);
      if (p && p.stock > 0) {
        p.stock = Math.max(0, p.stock - lineQty);
      }

      return {
        slug: item.slug || 'product',
        name: item.name || 'Boutique Item',
        variant: item.variant || item.size || 'Standard',
        price: linePrice,
        quantity: lineQty,
        img: item.img || (p ? p.img[0] : ''),
      };
    });

    const isFreeShip = db.settings.freeShippingThreshold > 0 && subtotal >= db.settings.freeShippingThreshold;
    const finalShipping = isFreeShip ? 0 : shippingFee;
    const total = subtotal + finalShipping;

    const newOrder: Order = {
      id: orderId,
      customerName: customerName ? customerName.trim() : 'Valued Customer',
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : undefined,
      deliveryZone: zone,
      address: address ? address.trim() : 'Address pending confirmation via WhatsApp',
      city: city ? city.trim() : zone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
      note: note ? note.trim() : undefined,
      items: orderItems,
      subtotal,
      shippingFee: finalShipping,
      total,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      createdAt: new Date().toISOString(),
      trackingNumber: `TRK-${zone === 'dhaka' ? 'DH' : 'BD'}-${orderId.replace('VEL-', '')}`,
    };

    db.orders.unshift(newOrder);
    saveData();
    res.status(201).json(newOrder);
  } catch (err: any) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

// Orders: Update status (Admin)
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;

  const order = db.orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (status) {
    order.status = status as OrderStatus;
  }
  if (trackingNumber !== undefined) {
    order.trackingNumber = trackingNumber;
  }
  order.updatedAt = new Date().toISOString();

  saveData();
  res.json(order);
});

// Orders: Delete (Admin)
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  const deleted = db.orders.splice(idx, 1)[0];
  saveData();
  res.json({ message: 'Order removed', order: deleted });
});

// Analytics Dashboard Endpoint
app.get('/api/analytics', (req, res) => {
  const totalRevenue = db.orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrders = db.orders.filter((o) => o.status === 'delivered').length;
  const totalProducts = db.products.length;
  const lowStockProducts = db.products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockProducts = db.products.filter((p) => p.stock === 0).length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  const catMap: Record<string, { count: number; revenue: number }> = {};
  db.products.forEach((p) => {
    categoryBreakdown[p.cat] = (categoryBreakdown[p.cat] || 0) + 1;
    if (!catMap[p.cat]) catMap[p.cat] = { count: 0, revenue: 0 };
    catMap[p.cat].count += 1;
  });
  db.orders.forEach((o) => {
    if (o.status !== 'cancelled') {
      o.items.forEach((item) => {
        const p = db.products.find((prod) => prod.slug === item.slug);
        const cat = p ? p.cat : 'other';
        if (!catMap[cat]) catMap[cat] = { count: 0, revenue: 0 };
        catMap[cat].revenue += item.price * item.quantity;
      });
    }
  });

  const categorySales = Object.keys(catMap).map((k) => ({
    category: k,
    count: catMap[k].count,
    revenue: catMap[k].revenue,
  }));

  const statusMap: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  db.orders.forEach((o) => {
    if (statusMap[o.status] !== undefined) {
      statusMap[o.status] += 1;
    }
  });
  const statusBreakdown = (Object.keys(statusMap) as OrderStatus[]).map((st) => ({
    status: st,
    count: statusMap[st],
  }));

  res.json({
    totalRevenue,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    averageOrderValue,
    flashSaleProductsCount: db.products.filter((p) => p.flashSale).length,
    categoryBreakdown,
    categorySales,
    statusBreakdown,
    recentOrders: db.orders.slice(0, 8),
  });
});

// ==========================================
// UNIFIED AUTHENTICATION & ROLE MANAGEMENT
// ==========================================

// Helper to strip password from user object
function sanitizeUser(user: StoredUser): UserAccount {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isPrimaryAdmin: user.isPrimaryAdmin || user.role === 'admin',
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    avatar: user.avatar,
  };
}

// Universal Registration (Customer by default)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
  }

  const newUser: StoredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: String(name).trim(),
    email: normalizedEmail,
    phone: phone ? String(phone).trim() : undefined,
    password: String(password).trim(),
    role: 'customer',
    isPrimaryAdmin: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveData();

  const token = `velora_sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    token,
    user: sanitizeUser(newUser),
  });
});

// Universal Login (for Admin, Moderator, Customer)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const rawPass = String(password).trim();

  // Find user by email, ID, or phone
  let user = db.users.find(
    (u) =>
      u.email.toLowerCase() === normalizedEmail ||
      u.id.toLowerCase() === normalizedEmail ||
      (u.phone && u.phone.trim() === normalizedEmail)
  );

  // If user entered 'admin' username
  if (!user && normalizedEmail === 'admin') {
    user = db.users.find((u) => u.isPrimaryAdmin || u.role === 'admin' || u.email.toLowerCase() === 'ariyantushar44@gmail.com');
  }

  if (!user || user.password !== rawPass) {
    return res.status(401).json({ error: 'Invalid email or password. Please check your credentials and try again.' });
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  saveData();

  const token = `velora_sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user: sanitizeUser(user),
  });
});

// Change Password Endpoint (for Admin & Users)
app.post('/api/auth/change-password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Email, current password, and new password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const rawCur = String(currentPassword).trim();
  const rawNew = String(newPassword).trim();

  if (rawNew.length < 5) {
    return res.status(400).json({ error: 'New password must be at least 5 characters long.' });
  }

  let user = db.users.find(
    (u) =>
      u.email.toLowerCase() === normalizedEmail ||
      (u.isPrimaryAdmin && normalizedEmail === 'admin')
  );

  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  if (user.password !== rawCur) {
    return res.status(401).json({ error: 'Current password is incorrect. Please verify and try again.' });
  }

  user.password = rawNew;

  // If this is the primary admin, also sync settings.adminPassword
  if (user.isPrimaryAdmin || user.role === 'admin') {
    db.settings.adminPassword = rawNew;
    // Update any backup admin accounts
    db.users.forEach((u) => {
      if (u.isPrimaryAdmin || u.role === 'admin' || u.email.toLowerCase() === 'admin@velora.com') {
        u.password = rawNew;
      }
    });
  }

  saveData();

  res.json({
    success: true,
    message: 'Password updated successfully! Your new password is now active.',
  });
});

// Get Current User Profile
app.get('/api/auth/me', (req, res) => {
  const emailQuery = req.query.email as string;
  if (emailQuery) {
    const user = db.users.find((u) => u.email.toLowerCase() === emailQuery.toLowerCase());
    if (user) {
      return res.json({ user: sanitizeUser(user) });
    }
  }
  // Return default primary admin if no match or session check
  const admin = db.users.find((u) => u.isPrimaryAdmin || u.role === 'admin') || db.users[0];
  res.json({ user: sanitizeUser(admin) });
});

// Admin: List all registered users and roles
app.get('/api/admin/users', (req, res) => {
  res.json({
    users: db.users.map(sanitizeUser),
    primaryAdminEmail: db.users.find((u) => u.isPrimaryAdmin)?.email || 'admin@velora.com',
    totalUsers: db.users.length,
    adminsCount: db.users.filter((u) => u.role === 'admin').length,
    moderatorsCount: db.users.filter((u) => u.role === 'moderator').length,
    customersCount: db.users.filter((u) => u.role === 'customer').length,
  });
});

// Admin: Assign or change user role (Primary Admin Only)
app.post('/api/admin/users/assign-role', (req, res) => {
  const { identifier, role } = req.body;
  if (!identifier || !role) {
    return res.status(400).json({ error: 'User identifier (Email or ID) and role are required.' });
  }

  if (!['admin', 'moderator', 'customer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified. Must be moderator or customer.' });
  }

  const cleanIdent = String(identifier).trim().toLowerCase();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === cleanIdent || u.id.toLowerCase() === cleanIdent
  );

  if (!user) {
    return res.status(404).json({ error: `User not found with identifier "${identifier}".` });
  }

  // System rule: The primary admin role cannot be changed or reassigned
  if (user.isPrimaryAdmin && role !== 'admin') {
    return res.status(403).json({ error: 'Security restriction: Primary administrator role cannot be altered or demoted.' });
  }

  // Only one primary admin allowed in the system
  if (role === 'admin' && !user.isPrimaryAdmin) {
    return res.status(403).json({ error: 'Security restriction: Only one primary administrator account is permitted in the system. You can assign the "Moderator" role instead.' });
  }

  user.role = role as UserRole;
  saveData();

  res.json({
    success: true,
    message: `Role for ${user.name} (${user.email}) successfully updated to "${role}".`,
    user: sanitizeUser(user),
  });
});

// Admin: Create staff user directly (e.g. New Moderator)
app.post('/api/admin/users/create', (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(400).json({ error: `An account with email "${email}" already exists. You can assign them the Moderator role directly from the list.` });
  }

  const assignedRole: UserRole = role === 'moderator' ? 'moderator' : 'customer';

  const newStaff: StoredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: String(name).trim(),
    email: normalizedEmail,
    phone: phone ? String(phone).trim() : undefined,
    password: String(password).trim(),
    role: assignedRole,
    isPrimaryAdmin: false,
    createdAt: new Date().toISOString(),
    lastLogin: undefined,
  };

  db.users.push(newStaff);
  saveData();

  res.status(201).json({
    success: true,
    message: `Staff member "${name}" created with role "${assignedRole}".`,
    user: sanitizeUser(newStaff),
  });
});

// Admin: Delete a user
app.delete('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (user.isPrimaryAdmin || user.role === 'admin') {
    return res.status(403).json({ error: 'Security restriction: Primary administrator cannot be removed.' });
  }

  db.users = db.users.filter((u) => u.id !== id);
  saveData();

  res.json({
    success: true,
    message: `User account "${user.name}" (${user.email}) has been removed.`,
  });
});

// Legacy Admin Login proxy (for backward compatibility if needed)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const admin = db.users.find((u) => u.isPrimaryAdmin || u.role === 'admin') || db.users[0];
  if (!password || String(password).trim() !== (admin.password || 'admin123')) {
    return res.status(401).json({ error: 'Incorrect administrator password. Please try again.' });
  }
  const token = `velora_adm_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  res.json({
    success: true,
    message: 'Authenticated successfully',
    token,
    user: sanitizeUser(admin),
    storeName: db.settings.storeName,
  });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  db.settings = {
    ...db.settings,
    ...req.body,
  };

  // If admin password was modified in store settings, synchronize with admin user in db.users
  if (req.body.adminPassword) {
    const newPass = String(req.body.adminPassword).trim();
    if (newPass) {
      db.settings.adminPassword = newPass;
      db.users.forEach((u) => {
        if (u.isPrimaryAdmin || u.role === 'admin' || u.email.toLowerCase() === 'ariyantushar44@gmail.com' || u.email.toLowerCase() === 'admin@velora.com') {
          u.password = newPass;
        }
      });
    }
  }

  saveData();
  res.json(db.settings);
});

// Reseed / Reset Data to Initial
app.post('/api/reset-data', (req, res) => {
  db = {
    products: [...INITIAL_PRODUCTS],
    categories: [...INITIAL_CATEGORIES],
    banners: [...INITIAL_BANNERS],
    settings: { ...INITIAL_SETTINGS },
    orders: [...INITIAL_ORDERS],
    users: [...INITIAL_USERS],
  };
  saveData();
  res.json({ message: 'Catalog and settings restored to factory defaults.', productsCount: db.products.length });
});

// AI Product Description & Content Generator Endpoint (using @google/genai)
app.post('/api/ai/generate-product', async (req, res) => {
  try {
    const { prompt, category } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiAI();
    if (!ai) {
      // Intelligent fallback when API key is not configured
      const mockResult = {
        name: prompt.trim(),
        bn: `${prompt.trim()} (প্রিমিয়াম কালেকশন)`,
        price: 2890,
        was: 3490,
        cat: category || 'ethnic',
        stock: 25,
        sizes: category === 'ethnic' ? ['S (38)', 'M (40)', 'L (42)', 'XL (44)'] : ['S', 'M', 'L', 'XL'],
        colors: [
          { n: 'Midnight Royal', h: '#1e293b' },
          { n: 'Antique Gold', h: '#d4af37' },
        ],
        tags: ['new', 'festive', 'luxury', category || 'boutique'],
        d: `Handcrafted from select materials, the ${prompt} exudes refined boutique aesthetics with meticulous tailoring and all-day comfort for Bangladeshi occasions.`,
        db: `${prompt} — অতুলনীয় কারুকার্য ও আধুনিক আভিজাত্যের নিখুঁত মেলবন্ধন। ঢাকার আবহাওয়ার উপযোগী নরম ও দীর্ঘস্থায়ী আরামদায়ক পোশাক।`,
      };
      return res.json(mockResult);
    }

    const systemPrompt = `You are a high-end luxury fashion and lifestyle copywriter for "VELORA", an exclusive boutique brand in Dhaka, Bangladesh.
Generate a complete JSON product object for an e-commerce catalog in Bangladesh based on the user's input.
The response must be valid raw JSON matching this structure without markdown formatting or code fences:
{
  "name": "English Product Title",
  "bn": "বাংলা পণ্যের শিরোনাম",
  "price": 2890,
  "was": 3490,
  "cat": "ethnic" | "modern" | "accessories" | "tech" | "beauty" | "footwear",
  "stock": 30,
  "sizes": ["S", "M", "L", "XL"],
  "colors": [{"n": "Ivory", "h": "#f4efe6"}, {"n": "Noir", "h": "#111111"}],
  "tags": ["festive", "eid", "silk", "premium"],
  "d": "Refined, sensory English product description (2-3 sentences).",
  "db": "মার্জিত ও আকর্ষনীয় বাংলা বিবরণী (২-৩ বাক্য)।"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Generate product details for: "${prompt}". Preferred category: "${category || 'auto'}".`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err: any) {
    console.error('AI generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate product with AI' });
  }
});

/* ==========================================================================
   VITE & STATIC ASSET SERVER
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ VELORA Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
