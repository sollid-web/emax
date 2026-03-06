import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDashboardData } from '@/hooks/use-dashboard-data';

vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/lib/db-operations', () => ({
  getUserPortfolio:    vi.fn(),
  getUserInvestments:  vi.fn(),
  getUserTransactions: vi.fn(),
  getUserWithdrawals:  vi.fn(),
  getUserProfile:      vi.fn(),
}));

import { useAuth } from '@/contexts/auth-context';
import {
  getUserPortfolio,
  getUserInvestments,
  getUserTransactions,
  getUserWithdrawals,
  getUserProfile,
} from '@/lib/db-operations';

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
    vi.mocked(getUserPortfolio).mockResolvedValue({ balance: 1000 } as any);
    vi.mocked(getUserInvestments).mockResolvedValue([{ id: 'inv-1' }] as any);
    vi.mocked(getUserTransactions).mockResolvedValue([{ id: 'tx-1' }] as any);
    vi.mocked(getUserWithdrawals).mockResolvedValue([{ id: 'wd-1' }] as any);
    vi.mocked(getUserProfile).mockResolvedValue({ name: 'Test User' } as any);

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
    vi.mocked(getUserPortfolio).mockRejectedValue(new Error('DB error'));
    vi.mocked(getUserInvestments).mockRejectedValue(new Error('DB error'));
    vi.mocked(getUserTransactions).mockRejectedValue(new Error('DB error'));
    vi.mocked(getUserWithdrawals).mockRejectedValue(new Error('DB error'));
    vi.mocked(getUserProfile).mockRejectedValue(new Error('DB error'));

    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('DB error');
  });
});
