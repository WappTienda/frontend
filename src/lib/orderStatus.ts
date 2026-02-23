import type { OrderStatus } from '@/types';

export const statusLabels: Record<OrderStatus, string> = {
  pending: 'Nuevo',
  contacted: 'Contactado',
  confirmed: 'Confirmado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const statusVariants: Record<OrderStatus, 'pending' | 'contacted' | 'confirmed' | 'delivered' | 'cancelled'> = {
  pending: 'pending',
  contacted: 'contacted',
  confirmed: 'confirmed',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

export const statusOptions = [
  { value: 'pending', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];
