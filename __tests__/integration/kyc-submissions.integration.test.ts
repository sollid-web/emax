import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('kyc_submissions table', () => {
  let testUserId: string;
  let testKycId: string;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.auth.admin.createUser({
      email: `kyc_${Date.now()}@test.com`,
      password: 'testpass123',
      email_confirm: true,
    });
    if (error) throw new Error(`User setup failed: ${error.message}`);
    testUserId = data.user.id;

    const { data: kyc, error: kycError } = await supabaseTest.from('kyc_submissions').insert({
      user_id: testUserId,
      first_name: 'John',
      last_name: 'Doe',
      date_of_birth: '1990-01-01',
      country: 'Nigeria',
      city: 'Lagos',
      postal_code: '100001',
      address_line_1: '123 Test Street',
      id_type: 'passport',
      id_number: 'A12345678',
      status: 'pending',
    }).select().single();
    if (kycError) throw new Error(`KYC setup failed: ${kycError.message}`);
    testKycId = kyc.id;
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('kyc_submissions').delete().eq('id', testKycId);
    await supabaseTest.auth.admin.deleteUser(testUserId);
  }, 30000);

  it('fetches KYC submission by id', async () => {
    const { data, error } = await supabaseTest.from('kyc_submissions').select('*').eq('id', testKycId).single();
    expect(error).toBeNull();
    expect(data.first_name).toBe('John');
    expect(data.last_name).toBe('Doe');
    expect(data.status).toBe('pending');
    expect(data.id_type).toBe('passport');
  });

  it('fetches KYC by user_id', async () => {
    const { data, error } = await supabaseTest.from('kyc_submissions').select('*').eq('user_id', testUserId);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('approves KYC submission', async () => {
    const { data, error } = await supabaseTest.from('kyc_submissions').update({ status: 'approved', verified_at: new Date().toISOString() }).eq('id', testKycId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('approved');
    expect(data.verified_at).not.toBeNull();
  });

  it('rejects KYC with reason', async () => {
    const { data, error } = await supabaseTest.from('kyc_submissions').update({ status: 'rejected', rejection_reason: 'Blurry documents' }).eq('id', testKycId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('rejected');
    expect(data.rejection_reason).toBe('Blurry documents');
  });
});
