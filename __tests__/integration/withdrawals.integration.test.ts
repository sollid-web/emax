import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('withdrawals table', () => {
  let testUserId: string;
  let testWalletId: string;
  let testWithdrawalId: string;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.auth.admin.createUser({
      email: `wd_${Date.now()}@test.com`,
      password: 'testpass123',
      email_confirm: true,
    });
    if (error) throw new Error(`User setup failed: ${error.message}`);
    testUserId = data.user.id;

    const { data: wallet, error: walletError } = await supabaseTest.from('user_crypto_wallets').insert({
      user_id: testUserId,
      currency: 'BTC',
      wallet_address: '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P',
      is_default: true,
    }).select().single();
    if (walletError) throw new Error(`Wallet setup failed: ${walletError.message}`);
    testWalletId = wallet.id;

    const { data: wd, error: wdError } = await supabaseTest.from('withdrawals').insert({
      user_id: testUserId,
      amount: 200,
      withdrawal_type: 'profit',
      currency: 'BTC',
      user_wallet_id: testWalletId,
      status: 'pending',
    }).select().single();
    if (wdError) throw new Error(`Withdrawal setup failed: ${wdError.message}`);
    testWithdrawalId = wd.id;
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('withdrawals').delete().eq('id', testWithdrawalId);
    await supabaseTest.from('user_crypto_wallets').delete().eq('id', testWalletId);
    await supabaseTest.auth.admin.deleteUser(testUserId);
  }, 30000);

  it('fetches withdrawal by id', async () => {
    const { data, error } = await supabaseTest.from('withdrawals').select('*').eq('id', testWithdrawalId).single();
    expect(error).toBeNull();
    expect(data.amount).toBe(200);
    expect(data.currency).toBe('BTC');
    expect(data.status).toBe('pending');
    expect(data.withdrawal_type).toBe('profit');
  });

  it('fetches withdrawals by user_id', async () => {
    const { data, error } = await supabaseTest.from('withdrawals').select('*').eq('user_id', testUserId);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('approves withdrawal', async () => {
    const { data, error } = await supabaseTest.from('withdrawals').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', testWithdrawalId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('approved');
    expect(data.approved_at).not.toBeNull();
  });

  it('marks withdrawal as processing', async () => {
    const { data, error } = await supabaseTest.from('withdrawals').update({ status: 'processing', processing_started_at: new Date().toISOString() }).eq('id', testWithdrawalId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('processing');
    expect(data.processing_started_at).not.toBeNull();
  });

  it('completes withdrawal with transaction hash', async () => {
    const { data, error } = await supabaseTest.from('withdrawals').update({ status: 'completed', transaction_hash: '0xabc123def456', completed_at: new Date().toISOString() }).eq('id', testWithdrawalId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('completed');
    expect(data.transaction_hash).toBe('0xabc123def456');
  });
});
