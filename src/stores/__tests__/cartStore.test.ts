import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'prod-1',
  sku: 'SKU-001',
  name: 'Product 1',
  description: null,
  price: 100,
  salePrice: null,
  imageUrl: null,
  categoryId: null,
  stockQuantity: 10,
  trackInventory: true,
  isVisible: true,
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  deletedAt: null,
  ...overrides,
});

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('should have correct initial state', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
  });

  it('should add a new item to the cart', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].product).toEqual(product);
    expect(items[0].quantity).toBe(1);
  });

  it('should increment quantity when adding an existing item', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem(product);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should remove an item from the cart', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product);
    useCartStore.getState().removeItem('prod-1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('should update quantity of an existing item', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product);
    useCartStore.getState().updateQuantity('prod-1', 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('should remove item when quantity is updated to 0', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product);
    useCartStore.getState().updateQuantity('prod-1', 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('should clear all items', () => {
    useCartStore.getState().addItem(makeProduct({ id: 'prod-1' }));
    useCartStore.getState().addItem(makeProduct({ id: 'prod-2', sku: 'SKU-002', name: 'Product 2' }));
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('should calculate total using price when salePrice is null', () => {
    const product = makeProduct({ price: 200, salePrice: null });
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem(product);
    expect(useCartStore.getState().getTotal()).toBe(400);
  });

  it('should calculate total using salePrice when available', () => {
    const product = makeProduct({ price: 200, salePrice: 150 });
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem(product);
    expect(useCartStore.getState().getTotal()).toBe(300);
  });

  it('should return 0 total for an empty cart', () => {
    expect(useCartStore.getState().getTotal()).toBe(0);
  });

  it('should return correct item count', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem(product);
    expect(useCartStore.getState().getItemCount()).toBe(2);
  });

  it('should return 0 item count for an empty cart', () => {
    expect(useCartStore.getState().getItemCount()).toBe(0);
  });

  it('should handle multiple different products correctly', () => {
    useCartStore.getState().addItem(makeProduct({ id: 'prod-1', price: 100 }));
    useCartStore.getState().addItem(makeProduct({ id: 'prod-2', sku: 'SKU-002', name: 'Product 2', price: 50 }));
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.getTotal()).toBe(150);
    expect(state.getItemCount()).toBe(2);
  });
});
