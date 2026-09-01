import { Product, Category, BannerSlide, StoreSettings, Order, AnalyticsSummary, OrderStatus, UserAccount } from '../types';

export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    tag?: string;
    sort?: string;
    stockOnly?: boolean;
    maxPrice?: number;
    flash?: boolean;
  }): Promise<{ total: number; products: Product[] }> {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    if (params?.tag) q.set('tag', params.tag);
    if (params?.sort) q.set('sort', params.sort);
    if (params?.stockOnly) q.set('stockOnly', 'true');
    if (params?.maxPrice) q.set('maxPrice', String(params.maxPrice));
    if (params?.flash) q.set('flash', 'true');

    const res = await fetch(`/api/products?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },

  async getProduct(slugOrId: string): Promise<Product> {
    const res = await fetch(`/api/products/${slugOrId}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    }
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async deleteCategory(slug: string): Promise<void> {
    const res = await fetch(`/api/categories/${slug}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete category');
  },

  // Banners
  async getBanners(): Promise<BannerSlide[]> {
    const res = await fetch('/api/banners');
    if (!res.ok) throw new Error('Failed to load banners');
    return res.json();
  },

  async createBanner(banner: Partial<BannerSlide>): Promise<BannerSlide> {
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(banner),
    });
    if (!res.ok) throw new Error('Failed to create banner');
    return res.json();
  },

  async deleteBanner(id: string): Promise<void> {
    const res = await fetch(`/api/banners/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete banner');
  },

  // Orders
  async getOrders(params?: { status?: string; search?: string }): Promise<{ total: number; orders: Order[] }> {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.search) q.set('search', params.search);

    const res = await fetch(`/api/orders?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to load orders');
    return res.json();
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },

  async updateOrderStatus(id: string, status: OrderStatus, trackingNumber?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber }),
    });
    if (!res.ok) throw new Error('Failed to update order');
    return res.json();
  },

  async deleteOrder(id: string): Promise<void> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete order');
  },

  async trackOrder(query: string): Promise<Order[]> {
    const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'No matching orders found');
    }
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to save settings');
    return res.json();
  },

  // AI Product Generation
  async generateProductWithAI(prompt: string, category?: string): Promise<Partial<Product>> {
    const res = await fetch('/api/ai/generate-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, category }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'AI generation failed');
    }
    return res.json();
  },

  // Unified Authentication & Session Management
  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: UserAccount; message: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Authentication failed');
    }
    const data = await res.json();
    if (data.token && data.user) {
      localStorage.setItem('velora_user_session', JSON.stringify(data.user));
      localStorage.setItem('velora_auth_token', data.token);
    }
    return data;
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; token: string; user: UserAccount; message: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    if (data.token && data.user) {
      localStorage.setItem('velora_user_session', JSON.stringify(data.user));
      localStorage.setItem('velora_auth_token', data.token);
    }
    return data;
  },

  getCurrentUser(): UserAccount | null {
    try {
      const raw = localStorage.getItem('velora_user_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async fetchCurrentUser(): Promise<UserAccount | null> {
    const token = localStorage.getItem('velora_auth_token');
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // If token is invalid/expired
        return this.getCurrentUser();
      }
      const data = await res.json();
      if (data.user) {
        localStorage.setItem('velora_user_session', JSON.stringify(data.user));
        return data.user;
      }
      return null;
    } catch {
      return this.getCurrentUser();
    }
  },

  logout(): void {
    localStorage.removeItem('velora_user_session');
    localStorage.removeItem('velora_auth_token');
    sessionStorage.removeItem('velora_admin_token');
  },

  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, currentPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to change password');
    }
    return res.json();
  },

  // Role Management (Admin only)
  async getUsers(): Promise<{
    users: UserAccount[];
    primaryAdminEmail: string;
    totalUsers: number;
    adminsCount: number;
    moderatorsCount: number;
    customersCount: number;
  }> {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to load user roster');
    return res.json();
  },

  async assignUserRole(identifier: string, role: 'admin' | 'moderator' | 'customer'): Promise<{ success: boolean; message: string; user: UserAccount }> {
    const res = await fetch('/api/admin/users/assign-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, role }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update user role');
    }
    return res.json();
  },

  async createStaffUser(data: { name: string; email: string; password: string; phone?: string; role: 'moderator' | 'customer' }): Promise<{ success: boolean; message: string; user: UserAccount }> {
    const res = await fetch('/api/admin/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create staff user');
    }
    return res.json();
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete user');
    }
    return res.json();
  },

  // Factory Reset
  async resetData(): Promise<void> {
    const res = await fetch('/api/reset-data', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset store data');
  },
};
