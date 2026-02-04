import { Link, Outlet } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export function PublicLayout() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              W
            </div>
            <span className="font-semibold text-lg">Tienda</span>
          </Link>
          <Link to="/checkout" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
