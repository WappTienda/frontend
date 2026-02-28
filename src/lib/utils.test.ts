import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate, generateWhatsAppLink } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('deduplicates tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});

describe('formatCurrency', () => {
  it('formats a number as ARS currency', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1.000');
  });

  it('formats zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });
});

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-01-15T10:30:00');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('formats a Date object', () => {
    const result = formatDate(new Date('2024-06-01T00:00:00'));
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe('generateWhatsAppLink', () => {
  it('generates a valid WhatsApp link', () => {
    const link = generateWhatsAppLink('+54 9 11 1234-5678', 'Hola');
    expect(link).toBe('https://wa.me/5491112345678?text=Hola');
  });

  it('strips non-numeric characters from phone', () => {
    const link = generateWhatsAppLink('(011) 1234-5678', 'Test');
    expect(link).toBe('https://wa.me/01112345678?text=Test');
  });
});
