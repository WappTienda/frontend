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

export const ORDER_STATUSES = ['pending', 'contacted', 'confirmed', 'delivered', 'cancelled'] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === 'string' && (ORDER_STATUSES as readonly string[]).includes(value);
}

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

export interface OrderSummaryItem {
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderSummary {
  orderId: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    address: string | null;
  } | null;
  items: OrderSummaryItem[];
  totalAmount: number;
  customerNote: string | null;
  createdAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  onlyInStock?: boolean;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
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

export type UserRole = "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    delivered: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  products: {
    total: number;
    visible: number;
    outOfStock: number;
  };
  customers: {
    total: number;
  };
}

export interface OrderStats {
  byStatus: Record<OrderStatus, number>;
  byDate: {
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
