import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDashboardData } from '@/hooks/use-dashboard-data';

vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(),
}));

import { useAuth } from '@/contexts/auth-context';
import { apiFetch } from '@/lib/api';

describe('useDashboardData hook', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sets loading false and returns empty data when no user', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null } as any);
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.portfolio).toBeNull();
    expect(result.current.investments).toEqual([]);
  });

  it('fetches all dashboard data when user exists', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-123' } } as any);
    const fetchMock = vi.mocked(apiFetch);

    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ portfolio: { balance: 1000 } }) } as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ investments: [{ id: 'inv-1' }] }) } as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ transactions: [{ id: 'tx-1' }] }) } as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ withdrawals: [{ id: 'wd-1' }] }) } as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ profile: { name: 'Test User' } }) } as any);

    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.portfolio).toEqual({ balance: 1000 });
    expect(result.current.investments).toEqual([{ id: 'inv-1' }]);
    expect(result.current.transactions).toEqual([{ id: 'tx-1' }]);
    expect(result.current.withdrawals).toEqual([{ id: 'wd-1' }]);
    expect(result.current.profile).toEqual({ name: 'Test User' });
    expect(result.current.error).toBeNull();
  });

  it('sets error when fetch fails', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-123' } } as any);
    const fetchMock = vi.mocked(apiFetch);
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: 'Fetch error' }) } as any);

    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Fetch error');
  });
});
