import { Card, CardContent } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { OrderItem } from '@/types';

interface OrderItemsCardProps {
  items: OrderItem[];
  totalAmount: number;
}

export function OrderItemsCard({ items, totalAmount }: OrderItemsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-4">Productos</h2>
        <div className="space-y-3">
          {items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.productName}
              </span>
              <span>{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-3 border-t">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
