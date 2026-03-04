import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import { productsApi } from '@/api';
import { Button, LoadingSpinner } from '@/components/ui';
import { ProductCard } from '@/components/home/ProductCard';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { productRoute } from '@/routes';

export function ProductDetailPage() {
  const { productId } = productRoute.useParams();
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getById(productId),
  });

  const { data: relatedData } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll({ limit: 100 }),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Producto no encontrado</h2>
        <p className="text-gray-400 mb-4">El producto que buscas no existe o no está disponible.</p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </Link>
      </div>
    );
  }

  const effectivePrice = product.salePrice || product.price;
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const relatedProducts = (relatedData?.data || []).filter(
    (p) => p.id !== product.id && p.isVisible && p.isActive,
  ).slice(0, 4);

  return (
    <div>
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product image */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-gray-400 text-8xl">📦</span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>

          <div className="flex flex-col items-start mb-4">
            <span className="text-3xl font-bold text-primary">{formatCurrency(effectivePrice)}</span>
            {product.salePrice && (
              <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price)}</span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          )}

          <div className="mt-auto">
            {quantity === 0 ? (
              <Button className="w-full" size="lg" onClick={() => addItem(product)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar al carrito
              </Button>
            ) : (
              <div className="flex items-center gap-4">
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
                <span className="font-medium text-xl">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Link to="/checkout" className="ml-auto">
                  <Button size="lg">Ver carrito</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Productos relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
