import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'ADMIN',
  isActive: true,
};

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false });
    localStorage.clear();
  });

  it('should have correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set user and token on login', () => {
    useAuthStore.getState().login(mockUser, 'token-abc');
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe('token-abc');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should store accessToken in localStorage on login', () => {
    useAuthStore.getState().login(mockUser, 'token-abc');
    expect(localStorage.getItem('accessToken')).toBe('token-abc');
  });

  it('should clear state on logout', () => {
    useAuthStore.getState().login(mockUser, 'token-abc');
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should remove accessToken from localStorage on logout', () => {
    useAuthStore.getState().login(mockUser, 'token-abc');
    useAuthStore.getState().logout();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
