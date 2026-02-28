import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNotificationStore } from '@/stores/notificationStore';

describe('notificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({ toasts: [] });
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue('test-uuid'),
    });
  });

  it('should have correct initial state', () => {
    expect(useNotificationStore.getState().toasts).toEqual([]);
  });

  it('should add a toast via addToast', () => {
    useNotificationStore.getState().addToast('success', 'Done!');
    const { toasts } = useNotificationStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Done!');
  });

  it('should remove a toast by id', () => {
    useNotificationStore.getState().addToast('info', 'Hello');
    const id = useNotificationStore.getState().toasts[0].id;
    useNotificationStore.getState().removeToast(id);
    expect(useNotificationStore.getState().toasts).toHaveLength(0);
  });

  it('should add a success toast', () => {
    useNotificationStore.getState().success('Operation successful');
    const { toasts } = useNotificationStore.getState();
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Operation successful');
  });

  it('should add an error toast', () => {
    useNotificationStore.getState().error('Something went wrong');
    const { toasts } = useNotificationStore.getState();
    expect(toasts[0].type).toBe('error');
    expect(toasts[0].message).toBe('Something went wrong');
  });

  it('should add a warning toast', () => {
    useNotificationStore.getState().warning('Be careful');
    const { toasts } = useNotificationStore.getState();
    expect(toasts[0].type).toBe('warning');
    expect(toasts[0].message).toBe('Be careful');
  });

  it('should add an info toast', () => {
    useNotificationStore.getState().info('Just so you know');
    const { toasts } = useNotificationStore.getState();
    expect(toasts[0].type).toBe('info');
    expect(toasts[0].message).toBe('Just so you know');
  });

  it('should accumulate multiple toasts', () => {
    useNotificationStore.getState().success('First');
    useNotificationStore.getState().error('Second');
    expect(useNotificationStore.getState().toasts).toHaveLength(2);
  });
});
