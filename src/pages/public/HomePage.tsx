import { useQuery } from '@tanstack/react-query';
import { Plus, Minus } from 'lucide-react';
import { productsApi } from '@/api';
import { useCartStore } from '@/stores/cartStore';
import { Button, Card, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

function ProductCard({ product }: { product: Product }) {
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

export function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll({ limit: 100 }),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">Error al cargar productos</div>;

  const products = data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuestros Productos</h1>
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay productos disponibles
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
