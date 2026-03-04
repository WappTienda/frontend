import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card', () => {
  it('should render children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should forward ref', () => {
    let ref: HTMLDivElement | null = null;
    render(<Card ref={(el) => { ref = el; }}>Ref</Card>);
    expect(ref).not.toBeNull();
  });
});

describe('CardHeader', () => {
  it('should render children', () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('should render as h3 with text', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
  });
});

describe('CardDescription', () => {
  it('should render description text', () => {
    render(<CardDescription>A description</CardDescription>);
    expect(screen.getByText('A description')).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('should render children', () => {
    render(<CardContent>Body</CardContent>);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('should render children', () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
