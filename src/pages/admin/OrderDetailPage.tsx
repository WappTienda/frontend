import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import { ordersAdminApi } from '@/api';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Select,
  Textarea,
  Label,
  LoadingSpinner,
} from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { router } from '@/routes';

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
  { value: 'pending', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export function OrderDetailPage() {
  const params = router.state.matches.find(m => m.pathname.startsWith('/admin/orders/') && m.pathname !== '/admin/orders')?.params as { orderId?: string } | undefined;
  const orderId = params?.orderId || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: () => ordersAdminApi.getById(orderId),
    enabled: !!orderId,
  });

  const { register, handleSubmit } = useForm({
    values: {
      status: order?.status || 'pending',
      adminNote: order?.adminNote || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { status?: OrderStatus; adminNote?: string }) =>
      ordersAdminApi.update(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => ordersAdminApi.delete(orderId),
    onSuccess: () => {
      navigate({ to: '/admin/orders' });
    },
  });

  const onSubmit = (data: { status: string; adminNote: string }) => {
    updateMutation.mutate({
      status: data.status as OrderStatus,
      adminNote: data.adminNote,
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pedido no encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate({ to: '/admin/orders' })}>
          Volver a pedidos
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate({ to: '/admin/orders' })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Pedido #{order.publicId}</h1>
            <Badge variant={statusVariants[order.status]}>{statusLabels[order.status]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <a
          href={`/order/${order.publicId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm flex items-center gap-1"
        >
          Ver página pública
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Datos del cliente</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Nombre:</span>{' '}
                {order.customer?.name}
              </p>
              <p>
                <span className="text-muted-foreground">Teléfono:</span>{' '}
                <a
                  href={`https://wa.me/${order.customer?.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {order.customer?.phone}
                </a>
              </p>
              {order.customer?.address && (
                <p>
                  <span className="text-muted-foreground">Dirección:</span>{' '}
                  {order.customer.address}
                </p>
              )}
              {order.customerNote && (
                <div className="pt-2 border-t mt-2">
                  <span className="text-muted-foreground">Nota del cliente:</span>
                  <p className="mt-1">{order.customerNote}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Productos</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.productName}
                  </span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-3 border-t">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Gestión del pedido</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Estado</Label>
              <Select options={statusOptions} {...register('status')} className="mt-1" />
            </div>
            <div>
              <Label>Nota interna (solo admin)</Label>
              <Textarea
                {...register('adminNote')}
                placeholder="Notas internas sobre este pedido..."
                className="mt-1"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Spinner className="h-4 w-4" /> : 'Guardar cambios'}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
