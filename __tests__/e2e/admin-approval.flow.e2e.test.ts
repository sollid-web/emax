import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as approveWithdrawal } from '@/app/api/admin/withdrawals-approve/route';
import { POST as adminInvestment } from '@/app/api/admin/investments/route';

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

const { POST: depositPOST } = await import('@/app/api/deposits/request/route');

const makeWithdrawalRequest = (body: object) =>
  new NextRequest('http://localhost/api/admin/withdrawals-approve', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

const makeInvestmentRequest = (body: object) =>
  new NextRequest('http://localhost/api/admin/investments', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

describe('E2E: Admin Withdrawal Approval Flow', () => {
  it('STEP 1 — rejects missing withdrawalId or action', async () => {
    const res = await approveWithdrawal(makeWithdrawalRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing required fields');
  });

  it('STEP 2 — approves withdrawal', async () => {
    const res = await approveWithdrawal(makeWithdrawalRequest({ withdrawalId: 'wd-123', action: 'approve' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.withdrawal.status).toBe('approved');
  });

  it('STEP 3 — marks withdrawal as processing', async () => {
    const res = await approveWithdrawal(makeWithdrawalRequest({ withdrawalId: 'wd-123', action: 'process' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.withdrawal.status).toBe('processing');
  });

  it('STEP 4 — completes withdrawal requires transaction hash', async () => {
    const res = await approveWithdrawal(makeWithdrawalRequest({ withdrawalId: 'wd-123', action: 'complete' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Transaction hash required for completion');
  });

  it('STEP 5 — completes withdrawal with transaction hash', async () => {
    const res = await approveWithdrawal(makeWithdrawalRequest({
      withdrawalId: 'wd-123',
      action: 'complete',
      transactionHash: '0xabc123def456',
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.withdrawal.status).toBe('completed');
    expect(body.withdrawal.transactionHash).toBe('0xabc123def456');
  });

  it('STEP 6 — rejects withdrawal requires reason', async () => {
    const res = await approveWithdrawal(makeWithdrawalRequest({ withdrawalId: 'wd-123', action: 'reject' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Rejection reason required');
  });

  it('STEP 7 — rejects withdrawal with reason', async () => {
    const res = await approveWithdrawal(makeWithdrawalRequest({
      withdrawalId: 'wd-123',
      action: 'reject',
      rejectionReason: 'Suspicious activity',
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.withdrawal.status).toBe('rejected');
    expect(body.withdrawal.rejectionReason).toBe('Suspicious activity');
  });

  it('STEP 8 — rejects invalid action', async () => {
    const res = await approveWithdrawal(makeWithdrawalRequest({ withdrawalId: 'wd-123', action: 'invalidaction' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid action');
  });
});

describe('E2E: Admin Direct Investment Flow (no user request)', () => {
  it('STEP 1 — rejects missing fields', async () => {
    const res = await adminInvestment(makeInvestmentRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing required fields');
  });

  it('STEP 2 — rejects invalid amount', async () => {
    const res = await adminInvestment(makeInvestmentRequest({
      adminId: 'admin-123', userId: 'user-123', planId: 'plan-123', amount: -500,
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid investment amount');
  });

  it('STEP 3 — rejects zero amount', async () => {
    const res = await adminInvestment(makeInvestmentRequest({
      adminId: 'admin-123', userId: 'user-123', planId: 'plan-123', amount: 0,
    }));
    expect(res.status).toBe(400);
  });

  it('STEP 4 — successfully creates investment for user', async () => {
    const res = await adminInvestment(makeInvestmentRequest({
      adminId: 'admin-123', userId: 'user-123', planId: 'plan-123', amount: 1000,
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.investment.status).toBe('active');
    expect(body.investment.amount).toBe(1000);
    expect(body.investment.started_by_admin).toBe('admin-123');
  });
});

describe('E2E: Admin Deposit Flow', () => {
  it('STEP 1 — rejects unauthenticated deposit request', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid' } });
    const req = new NextRequest('http://localhost/api/deposits/request', {
      method: 'POST',
      body: JSON.stringify({ amount: 100, currency: 'BTC', wallet_address_used: 'addr123456789012345678' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer bad-token' },
    });
    const res = await depositPOST(req);
    expect(res.status).toBe(401);
  });

  it('STEP 2 — rejects deposit with no auth header', async () => {
    const req = new NextRequest('http://localhost/api/deposits/request', {
      method: 'POST',
      body: JSON.stringify({ amount: 100, currency: 'BTC', wallet_address_used: 'addr123' }),
    });
    const res = await depositPOST(req);
    expect(res.status).toBe(401);
  });

  it('STEP 3 — rejects missing required fields', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const req = new NextRequest('http://localhost/api/deposits/request', {
      method: 'POST',
      body: JSON.stringify({ amount: 100 }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer valid-token' },
    });
    const res = await depositPOST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing required fields');
  });

  it('STEP 4 — rejects invalid amount', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const req = new NextRequest('http://localhost/api/deposits/request', {
      method: 'POST',
      body: JSON.stringify({ amount: -50, currency: 'BTC', wallet_address_used: 'addr123' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer valid-token' },
    });
    const res = await depositPOST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid amount');
  });

  it('STEP 5 — successfully creates deposit request pending admin approval', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const mockDeposit = { id: 'dep-123', amount: 500, status: 'pending', currency: 'BTC' };
    mockFrom.mockImplementation((table: string) => {
      if (table === 'deposits') {
        return {
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockDeposit, error: null }),
        };
      }
      if (table === 'transactions') {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
    });

    const req = new NextRequest('http://localhost/api/deposits/request', {
      method: 'POST',
      body: JSON.stringify({ amount: 500, currency: 'BTC', wallet_address_used: 'addr123456789012345678' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer valid-token' },
    });
    const res = await depositPOST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.deposit.status).toBe('pending');
    expect(body.message).toContain('pending admin approval');
  });
});
