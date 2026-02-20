export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
  categoryId: string | null;
  category?: Category;
  stockQuantity: number;
  trackInventory: boolean;
  isVisible: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'contacted' | 'confirmed' | 'delivered' | 'cancelled';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  publicId: string;
  customerId: string | null;
  customer: Customer | null;
  status: OrderStatus;
  totalAmount: number;
  customerNote: string | null;
  adminNote: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: string;
  publicId: string;
  status: OrderStatus;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string | null;
  customerNote: string | null;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOrderDto {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerNote?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface CreateProductDto {
  sku: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  categoryId?: string;
  stockQuantity?: number;
  trackInventory?: boolean;
  isVisible?: boolean;
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  salePrice?: number;
  imageUrl?: string;
  categoryId?: string;
  stockQuantity?: number;
  trackInventory?: boolean;
  isVisible?: boolean;
  isActive?: boolean;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  adminNote?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
  ordersToday: number;
  revenueToday: number;
}

export interface OrderStats {
  byStatus: Record<OrderStatus, number>;
  byDay: {
    date: string;
    count: number;
    revenue: number;
  }[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  isPublic: boolean;
  updatedAt: string;
}

export interface UpdateSettingDto {
  key: string;
  value?: string;
}

export interface UpdateSettingsDto {
  settings: UpdateSettingDto[];
}
