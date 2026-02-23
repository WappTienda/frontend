import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { ordersAdminApi } from '@/api';
import { Button, Card, Badge, LoadingSpinner, Select } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Nuevo',
  contacted: 'Contactado',
  confirmed: 'Confirmado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusVariants: Record<OrderStatus, 'pending' | 'contacted' | 'confirmed' | 'delivered' | 'cancelled'> = {
  pending: 'pending',
  contacted: 'contacted',
  confirmed: 'confirmed',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'pending', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: () =>
      ordersAdminApi.getAll({
        limit: 100,
        status: statusFilter || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersAdminApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const orders = data?.data || [];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <div className="w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No hay pedidos</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-muted-foreground">
                      #{order.publicId}
                    </span>
                    <Badge variant={statusVariants[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  <h3 className="font-medium">{order.customer?.name || 'Cliente'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.customer?.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items?.length || 0} productos
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    options={statusOptions.slice(1)}
                    value={order.status}
                    onChange={(e) =>
                      updateMutation.mutate({
                        id: order.id,
                        status: e.target.value as OrderStatus,
                      })
                    }
                    className="w-36"
                  />
                  <Link to="/admin/orders/$orderId" params={{ orderId: order.id }}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
