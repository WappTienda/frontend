import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('should render an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should pass placeholder prop', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should pass type prop', () => {
    render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('should be disabled when disabled prop is set', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });

  it('should forward ref', () => {
    let ref: HTMLInputElement | null = null;
    render(<Input ref={(el) => { ref = el; }} />);
    expect(ref).not.toBeNull();
  });
});
