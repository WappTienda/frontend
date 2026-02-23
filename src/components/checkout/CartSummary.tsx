import { Link } from '@tanstack/react-router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Button, Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

export function CartSummary() {
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
