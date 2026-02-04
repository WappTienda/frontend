import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Package, DollarSign, Clock } from 'lucide-react';
import { analyticsApi } from '@/api';
import { Card, CardContent, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: analyticsApi.getDashboard,
  });

  const { data: orderStats, isLoading: orderStatsLoading } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => analyticsApi.getOrderStats(30),
  });

  const { data: topProducts, isLoading: topProductsLoading } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => analyticsApi.getTopProducts(5),
  });

  if (statsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pedidos"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          description={`${stats?.ordersToday || 0} hoy`}
        />
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          description={`${formatCurrency(stats?.revenueToday || 0)} hoy`}
        />
        <StatCard
          title="Pedidos Pendientes"
          value={stats?.pendingOrders || 0}
          icon={Clock}
        />
        <StatCard
          title="Productos"
          value={stats?.totalProducts || 0}
          icon={Package}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Pedidos últimos 30 días</h3>
            {orderStatsLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={orderStats?.byDay || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                        })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString('es-AR')
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                      name="Pedidos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Productos más vendidos</h3>
            {topProductsLoading ? (
              <LoadingSpinner />
            ) : topProducts && topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((product, idx) => (
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
      </div>

      {/* Status Distribution */}
      {orderStats && (
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
      )}
    </div>
  );
}
