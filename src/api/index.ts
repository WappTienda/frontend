import api from './client';
import type {
  Product,
  Category,
  Order,
  OrderSummary,
  PaginatedResponse,
  CreateOrderDto,
  CreateProductDto,
  UpdateProductDto,
  UpdateOrderDto,
  LoginDto,
  AuthResponse,
  DashboardStats,
  OrderStats,
  TopProduct,
  Setting,
  UpdateSettingsDto,
  ProductQueryParams,
  OrderQueryParams,
} from '@/types';

// Auth
export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};

// Products (Public)
export const productsApi = {
  getAll: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
};

// Products (Admin)
export const productsAdminApi = {
  getAll: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products/admin', { params });
    return response.data;
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/admin/${id}`);
    return response.data;
  },
  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },
  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
  restore: async (id: string): Promise<Product> => {
    const response = await api.post<Product>(`/products/${id}/restore`);
    return response.data;
  },
};

// Categories
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },
};

// Orders (Public)
export const ordersPublicApi = {
  create: async (data: CreateOrderDto): Promise<{ order: OrderSummary; whatsappLink: string | null }> => {
    const response = await api.post<{ order: OrderSummary; whatsappLink: string | null }>('/orders/public', data);
    return response.data;
  },
  getByPublicId: async (publicId: string): Promise<{ order: OrderSummary; whatsappLink: string | null }> => {
    const response = await api.get<{ order: OrderSummary; whatsappLink: string | null }>(`/orders/public/${publicId}`);
    return response.data;
  },
};

// Orders (Admin)
export const ordersAdminApi = {
  getAll: async (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  },
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },
  update: async (id: string, data: UpdateOrderDto): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};

// Analytics
export const analyticsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/analytics/dashboard');
    return response.data;
  },
  getOrderStats: async (days?: number): Promise<OrderStats> => {
    const response = await api.get<OrderStats>('/analytics/orders', { params: { days } });
    return response.data;
  },
  getTopProducts: async (limit?: number): Promise<TopProduct[]> => {
    const response = await api.get<TopProduct[]>('/analytics/products', { params: { limit } });
    return response.data;
  },
};

// Settings
export const settingsApi = {
  getPublic: async (): Promise<Record<string, string>> => {
    const response = await api.get<Record<string, string>>('/settings/public');
    return response.data;
  },
};

export const settingsAdminApi = {
  getAll: async (): Promise<Setting[]> => {
    const response = await api.get<Setting[]>('/settings');
    return response.data;
  },
  update: async (data: UpdateSettingsDto): Promise<Setting[]> => {
    const response = await api.patch<Setting[]>('/settings', data);
    return response.data;
  },
};

// Uploads
export const uploadsApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ url: string }>('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
