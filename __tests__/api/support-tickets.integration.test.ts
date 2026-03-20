import { describe, it, expect, vi } from 'vitest';

// Mock the supabase client
vi.mock('@/lib/supabase.test', () => {
  const mockChainMethods = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: {
        id: 'test-ticket-id',
        user_id: 'test-user-id',
        subject: 'Test subject',
        message: 'Test message',
        status: 'open',
        priority: 'low'
      },
      error: null
    })
  };

  return {
    supabaseTest: {
      auth: {
        admin: {
          createUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'test-user-id' } },
            error: null
          }),
          deleteUser: vi.fn().mockResolvedValue({ data: {}, error: null })
        }
      },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue(mockChainMethods),
        select: vi.fn().mockReturnValue(mockChainMethods),
        eq: vi.fn().mockReturnValue(mockChainMethods),
        update: vi.fn().mockReturnValue(mockChainMethods),
        delete: vi.fn().mockReturnValue(mockChainMethods)
      })
    }
  };
});

describe('support_tickets table', () => {
  it('should create and fetch a support ticket', async () => {
    const { supabaseTest } = await import('@/lib/supabase.test');

    // Create a test user
    const { data: userData } = await supabaseTest.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirm: true
    });

    // Create a test ticket
    const { data: ticketData } = await supabaseTest
      .from('support_tickets')
      .insert({
        user_id: userData.user.id,
        subject: 'Test subject',
        message: 'Test message',
        status: 'open',
        priority: 'low'
      })
      .select()
      .single();

    expect(ticketData.id).toBe('test-ticket-id');
    expect(ticketData.subject).toBe('Test subject');
    expect(ticketData.status).toBe('open');
  });
});
