import { Card, CardContent } from '@/components/ui';
import type { OrderStats } from '@/types';

interface StatusDistributionProps {
  orderStats: OrderStats;
}

export function StatusDistribution({ orderStats }: StatusDistributionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Distribución por estado</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(orderStats.byStatus || {}).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {status === 'pending' && 'Nuevos'}
                {status === 'contacted' && 'Contactados'}
                {status === 'confirmed' && 'Confirmados'}
                {status === 'delivered' && 'Entregados'}
                {status === 'cancelled' && 'Cancelados'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
