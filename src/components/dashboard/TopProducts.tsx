import { Card, CardContent, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { TopProduct } from '@/types';

interface TopProductsProps {
  products: TopProduct[] | undefined;
  isLoading: boolean;
}

export function TopProducts({ products, isLoading }: TopProductsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Productos más vendidos</h3>
        {isLoading ? (
          <LoadingSpinner />
        ) : products && products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product, idx) => (
              <div key={product.productId} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.totalQuantity} unidades vendidas
                  </p>
                </div>
                <span className="font-semibold text-primary">
                  {formatCurrency(product.totalRevenue)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No hay datos disponibles
          </p>
        )}
      </CardContent>
    </Card>
  );
}
