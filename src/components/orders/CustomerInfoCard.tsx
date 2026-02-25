import { Card, CardContent } from '@/components/ui';
import type { Customer } from '@/types';

interface CustomerInfoCardProps {
  customer: Customer | null;
  customerNote: string | null;
}

export function CustomerInfoCard({ customer, customerNote }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-4">Datos del cliente</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Nombre:</span>{' '}
            {customer?.name}
          </p>
          <p>
            <span className="text-muted-foreground">Teléfono:</span>{' '}
            <a
              href={`https://wa.me/${customer?.phone?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {customer?.phone}
            </a>
          </p>
          {customer?.address && (
            <p>
              <span className="text-muted-foreground">Dirección:</span>{' '}
              {customer.address}
            </p>
          )}
          {customerNote && (
            <div className="pt-2 border-t mt-2">
              <span className="text-muted-foreground">Nota del cliente:</span>
              <p className="mt-1">{customerNote}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
