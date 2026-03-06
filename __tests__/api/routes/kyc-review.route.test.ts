import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/admin/kyc-review/route';

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/admin/kyc-review', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

describe('POST /api/admin/kyc-review', () => {
  it('returns 400 when fields are missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing required fields');
  });

  it('returns 400 when rejecting without reason', async () => {
    const res = await POST(makeRequest({ adminId: 'admin-1', kycId: 'kyc-1', action: 'reject' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Rejection reason required');
  });

  it('approves KYC successfully', async () => {
    const res = await POST(makeRequest({ adminId: 'admin-1', kycId: 'kyc-1', action: 'approve' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('approved');
  });

  it('rejects KYC with reason', async () => {
    const res = await POST(makeRequest({ adminId: 'admin-1', kycId: 'kyc-1', action: 'reject', rejectionReason: 'Blurry documents' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe('rejected');
  });
});
