import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('platform_crypto_wallets table', () => {
  let testWalletId: string;
  const testCurrency = `TST${Date.now()}`;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.from('platform_crypto_wallets').insert({
      currency: testCurrency,
      wallet_address: '1TestWalletAddress123456789012345',
      network: 'testnet',
      is_active: true,
    }).select().single();
    if (error) throw new Error(`Wallet setup failed: ${error.message}`);
    testWalletId = data.id;
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('platform_crypto_wallets').delete().eq('id', testWalletId);
  }, 30000);

  it('fetches wallet by id', async () => {
    const { data, error } = await supabaseTest.from('platform_crypto_wallets').select('*').eq('id', testWalletId).single();
    expect(error).toBeNull();
    expect(data.currency).toBe(testCurrency);
    expect(data.network).toBe('testnet');
    expect(data.is_active).toBe(true);
  });

  it('fetches active wallets', async () => {
    const { data, error } = await supabaseTest.from('platform_crypto_wallets').select('*').eq('is_active', true);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('updates wallet address', async () => {
    const { data, error } = await supabaseTest.from('platform_crypto_wallets').update({ wallet_address: '1UpdatedWalletAddress12345678901' }).eq('id', testWalletId).select().single();
    expect(error).toBeNull();
    expect(data.wallet_address).toBe('1UpdatedWalletAddress12345678901');
  });

  it('deactivates wallet', async () => {
    const { data, error } = await supabaseTest.from('platform_crypto_wallets').update({ is_active: false }).eq('id', testWalletId).select().single();
    expect(error).toBeNull();
    expect(data.is_active).toBe(false);
  });
});
