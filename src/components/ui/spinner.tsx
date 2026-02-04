import { Loader2 } from 'lucide-react';

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <Spinner className="h-6 w-6 text-primary" />
    </div>
  );
}
