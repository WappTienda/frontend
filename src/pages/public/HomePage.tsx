import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api';
import { LoadingSpinner } from '@/components/ui';
import { ProductCard } from '@/components/home/ProductCard';

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
