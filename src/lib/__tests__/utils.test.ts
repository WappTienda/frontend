import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate, generateWhatsAppLink } from '@/lib/utils';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', undefined, 'baz')).toBe('foo baz');
  });

  it('should resolve tailwind conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});

describe('formatCurrency', () => {
  it('should format a positive number as ARS currency', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1.000');
    expect(result).toMatch(/\$|ARS/);
  });

  it('should format zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('should format a decimal amount', () => {
    const result = formatCurrency(1500.5);
    expect(result).toContain('1.500');
  });
});

describe('formatDate', () => {
  it('should format a Date object', () => {
    const date = new Date(2024, 0, 15, 10, 30);
    const result = formatDate(date);
    expect(result).toContain('15');
    expect(result).toContain('01');
    expect(result).toContain('2024');
  });

  it('should format an ISO date string', () => {
    const result = formatDate('2024-06-01T00:00:00.000Z');
    expect(result).toContain('2024');
  });
});

describe('generateWhatsAppLink', () => {
  it('should generate a valid WhatsApp link', () => {
    const link = generateWhatsAppLink('+54 11 1234-5678', 'Hello!');
    expect(link).toMatch(/^https:\/\/wa\.me\/541112345678/);
    expect(link).toContain('Hello');
  });

  it('should strip non-numeric characters from phone', () => {
    const link = generateWhatsAppLink('(11) 9999-8888', 'test');
    expect(link).toContain('1199998888');
  });

  it('should URL-encode the message', () => {
    const link = generateWhatsAppLink('1234567890', 'Hello World');
    expect(link).toContain('Hello%20World');
  });
});
