import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Spinner, LoadingScreen, LoadingSpinner } from '@/components/ui/spinner';

describe('Spinner', () => {
  it('should render without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should apply animate-spin class', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('animate-spin');
  });

  it('should apply custom className', () => {
    const { container } = render(<Spinner className="h-8 w-8" />);
    expect(container.firstChild).toHaveClass('h-8', 'w-8');
  });
});

describe('LoadingScreen', () => {
  it('should render without crashing', () => {
    const { container } = render(<LoadingScreen />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('LoadingSpinner', () => {
  it('should render without crashing', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
