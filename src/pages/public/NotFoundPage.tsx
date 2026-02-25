import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Página no encontrada</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        La página que estás buscando no existe o fue movida. Verifica la URL o vuelve al inicio.
      </p>
      <div className="flex gap-3">
        <Link to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
