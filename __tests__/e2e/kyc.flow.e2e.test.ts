import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/admin/kyc-review/route';
import { GET } from '@/app/api/admin/kyc-list/route';

describe('E2E: KYC Review Flow', () => {
  it('STEP 1 — admin lists pending KYC submissions', async () => {
    const req = new NextRequest('http://localhost/api/admin/kyc-list?status=pending');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.submissions.length).toBeGreaterThan(0);
    expect(body.submissions[0]).toHaveProperty('firstName');
    expect(body.submissions[0]).toHaveProperty('userEmail');
  });

  it('STEP 2 — admin cannot approve without required fields', async () => {
    const req = new NextRequest('http://localhost/api/admin/kyc-review', {
      method: 'POST',
      body: JSON.stringify({ adminId: 'admin-1' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('STEP 3 — admin approves KYC', async () => {
    const req = new NextRequest('http://localhost/api/admin/kyc-review', {
      method: 'POST',
      body: JSON.stringify({ adminId: 'admin-1', kycId: 'kyc-1', action: 'approve' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe('approved');
    expect(body.data.approvedBy).toBe('admin-1');
  });

  it('STEP 4 — admin rejects KYC without reason fails', async () => {
    const req = new NextRequest('http://localhost/api/admin/kyc-review', {
      method: 'POST',
      body: JSON.stringify({ adminId: 'admin-1', kycId: 'kyc-1', action: 'reject' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Rejection reason required');
  });

  it('STEP 5 — admin rejects KYC with reason', async () => {
    const req = new NextRequest('http://localhost/api/admin/kyc-review', {
      method: 'POST',
      body: JSON.stringify({ adminId: 'admin-1', kycId: 'kyc-1', action: 'reject', rejectionReason: 'ID expired' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe('rejected');
  });
});
