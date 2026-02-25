import { Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Button, Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const effectivePrice = product.salePrice || product.price;

  return (
    <Card className="overflow-hidden">
      {product.imageUrl ? (
        <div className="aspect-square bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-4xl">📦</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
        <div className="flex flex-col items-start mb-3">
          <span className="font-bold text-primary">{formatCurrency(effectivePrice)}</span>
          {product.salePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
        {quantity === 0 ? (
          <Button className="w-full" size="lg" onClick={() => addItem(product)}>
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (quantity === 1) {
                  removeItem(product.id);
                } else {
                  updateQuantity(product.id, quantity - 1);
                }
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-medium text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
