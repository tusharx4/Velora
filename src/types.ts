export interface ProductColor {
  n: string;
  h: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  bn: string;
  price: number;
  was?: number;
  cat: string;
  stock: number;
  imgs: string[];
  img: string[]; // resolved URLs
  tags: string[];
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  rc: number; // review count
  d: string; // description English
  db: string; // description Bengali
  featured?: boolean;
  flashSale?: boolean;
  flashSaleDiscountPercent?: number;
  flashSaleEndsAt?: string;
  flashSaleSold?: number;
  flashSaleStockQuota?: number;
  createdAt?: string;
}

export interface Category {
  slug: string;
  name: string;
  bn: string;
  d: string;
  img: number | string;
}

export interface BannerSlide {
  id: string;
  t: string;
  bn: string;
  s: string;
  img: number | string;
  cta: string;
  href: string;
}

export interface CartItem {
  pid: string;
  slug: string;
  name: string;
  bn?: string;
  price: number;
  img: string;
  qty: number;
  size?: string;
  color?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad';
export type DeliveryZone = 'dhaka' | 'outside';

export interface OrderItem {
  slug: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  img?: string;
}

export interface Order {
  id: string; // e.g. VEL-9821
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryZone: DeliveryZone;
  address: string;
  city?: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string;
}

export type UserRole = 'admin' | 'moderator' | 'customer';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  isPrimaryAdmin?: boolean;
}

export interface StoredUser extends UserAccount {
  password?: string;
}

export interface AuthSession {
  user: UserAccount;
  token: string;
}

export interface StoreSettings {
  storeName: string;
  storeTaglineEn: string;
  storeTaglineBn: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  addressEn: string;
  addressBn: string;
  shippingFeeInsideDhaka: number;
  shippingFeeOutsideDhaka: number;
  freeShippingThreshold: number;
  currencySymbol: string;
  tickerNoticeEn: string;
  tickerNoticeBn: string;
  showTicker: boolean;
  adminPassword?: string;
  primaryAdminEmail?: string;
  flashSaleActive?: boolean;
  flashSaleTitleEn?: string;
  flashSaleTitleBn?: string;
  flashSaleEndsAt?: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  averageOrderValue: number;
  flashSaleProductsCount?: number;
  categoryBreakdown?: Record<string, number>;
  categorySales: { category: string; count: number; revenue: number }[];
  statusBreakdown: { status: OrderStatus; count: number }[];
  recentOrders: Order[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: 'user' | 'assistant' | 'admin';
  text: string;
  senderName: string;
  timestamp: string;
  read?: boolean;
}

export interface ChatSession {
  id: string;
  userId?: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  lastMessage: string;
  lastSender: 'user' | 'assistant' | 'admin';
  updatedAt: string;
  unreadCount?: number;
  status: 'active' | 'closed';
}

export interface CustomerInquiry {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'resolved';
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

