import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { ordersPublicApi } from '@/api';
import { useCartStore } from '@/stores/cartStore';
import { Button, Input, Textarea, Label, Card, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { OrderSummary } from '@/types';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'El nombre es requerido'),
  customerPhone: z.string().regex(/^\+?[0-9]{8,15}$/, 'Ingresa un número válido'),
  customerAddress: z.string().optional(),
  customerNote: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function CartSummary() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-600 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-6">Agrega productos para continuar</p>
        <Link to="/">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tu pedido</h2>
      {items.map((item) => {
        const price = item.product.salePrice || item.product.price;
        return (
          <Card key={item.product.id} className="p-4">
            <div className="flex gap-3">
              {item.product.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                <p className="text-primary font-semibold">{formatCurrency(price)}</p>
              </div>
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => removeItem(item.product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="font-semibold">{formatCurrency(price * item.quantity)}</span>
            </div>
          </Card>
        );
      })}
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-xl font-bold text-primary">{formatCurrency(getTotal())}</span>
      </div>
    </div>
  );
}

interface OrderConfirmationProps {
  order: OrderSummary;
  whatsappLink: string | null;
}

function OrderConfirmation({ order, whatsappLink }: OrderConfirmationProps) {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-6">
        <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Pedido creado!</h2>
        <p className="text-gray-600">
          Tu pedido #{order.publicId} ha sido registrado correctamente.
        </p>
      </div>

      <Card className="p-4 text-left mb-6">
        <h3 className="font-semibold mb-3">Resumen del pedido</h3>
        <div className="space-y-2 text-sm">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </Card>

      {whatsappLink && (
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="w-full gap-2 mb-4">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar pedido por WhatsApp
          </Button>
        </a>
      )}

      <a href={`/order/${order.publicId}`}>
        <Button variant="outline" className="w-full">
          Ver detalle del pedido
        </Button>
      </a>
    </div>
  );
}

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
