import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Package, DollarSign, Clock } from 'lucide-react';
import { analyticsApi } from '@/api';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/dashboard/StatCard';
import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { TopProducts } from '@/components/dashboard/TopProducts';
import { StatusDistribution } from '@/components/dashboard/StatusDistribution';

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
          value={stats?.orders.total || 0}
          icon={ShoppingBag}
        />
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(stats?.revenue.total || 0)}
          icon={DollarSign}
        />
        <StatCard
          title="Pedidos Pendientes"
          value={stats?.orders.pending || 0}
          icon={Clock}
        />
        <StatCard
          title="Productos"
          value={stats?.products.total || 0}
          icon={Package}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OrdersChart data={orderStats?.byDate || []} isLoading={orderStatsLoading} />
        <TopProducts products={topProducts} isLoading={topProductsLoading} />
      </div>

      {orderStats && <StatusDistribution orderStats={orderStats} />}
    </div>
  );
}
