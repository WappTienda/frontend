import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { ordersPublicApi } from '@/api';
import { useCartStore } from '@/stores/cartStore';
import { Button, Input, Textarea, Label, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { CartSummary } from '@/components/checkout/CartSummary';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import type { OrderSummary } from '@/types';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'El nombre es requerido'),
  customerPhone: z.string().regex(/^\+?[0-9]{8,15}$/, 'Ingresa un número válido'),
  customerAddress: z.string().optional(),
  customerNote: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [orderResult, setOrderResult] = useState<{
    order: OrderSummary;
    whatsappLink: string | null;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const createOrderMutation = useMutation({
    mutationFn: ordersPublicApi.create,
    onSuccess: (result) => {
      setOrderResult(result);
      clearCart();
    },
  });

  if (orderResult) {
    return <OrderConfirmation order={orderResult.order} whatsappLink={orderResult.whatsappLink} />;
  }

  const onSubmit = (data: CheckoutFormData) => {
    createOrderMutation.mutate({
      ...data,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });
  };

  if (items.length === 0) {
    return <CartSummary />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-2 text-gray-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Seguir comprando
      </button>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <CartSummary />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Tus datos</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="customerName">Nombre *</Label>
              <Input
                id="customerName"
                placeholder="Tu nombre completo"
                {...register('customerName')}
              />
              {errors.customerName && (
                <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="customerPhone">Teléfono *</Label>
              <Input
                id="customerPhone"
                placeholder="+549111234567"
                {...register('customerPhone')}
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-500 mt-1">{errors.customerPhone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="customerAddress">Dirección (opcional)</Label>
              <Input
                id="customerAddress"
                placeholder="Tu dirección de entrega"
                {...register('customerAddress')}
              />
            </div>

            <div>
              <Label htmlFor="customerNote">Nota (opcional)</Label>
              <Textarea
                id="customerNote"
                placeholder="Algún comentario sobre tu pedido..."
                {...register('customerNote')}
              />
            </div>

            {createOrderMutation.isError && (
              <div className="text-sm text-red-500 p-3 bg-red-50 rounded-lg">
                Error al crear el pedido. Por favor intenta nuevamente.
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? (
                <LoadingSpinner />
              ) : (
                `Confirmar pedido - ${formatCurrency(getTotal())}`
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
