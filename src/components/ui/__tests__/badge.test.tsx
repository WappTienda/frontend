import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('should render with text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should apply default variant by default', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('bg-primary');
  });

  it('should apply destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  it('should apply outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    expect(container.firstChild).toHaveClass('text-foreground');
  });

  it('should apply order status variants', () => {
    const { container: pending } = render(<Badge variant="pending">Pending</Badge>);
    expect(pending.firstChild).toHaveClass('bg-yellow-100');

    const { container: confirmed } = render(<Badge variant="confirmed">Confirmed</Badge>);
    expect(confirmed.firstChild).toHaveClass('bg-green-100');

    const { container: cancelled } = render(<Badge variant="cancelled">Cancelled</Badge>);
    expect(cancelled.firstChild).toHaveClass('bg-red-100');
  });

  it('should apply custom className', () => {
    const { container } = render(<Badge className="my-class">Custom</Badge>);
    expect(container.firstChild).toHaveClass('my-class');
  });
});
