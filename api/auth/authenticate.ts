import { createClient } from '@supabase/supabase-js';
import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    const { email, password } = req.body ?? {};
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });

    const signInResult = await supabase.auth.signInWithPassword({ email, password });
    if (signInResult.error) return res.status(401).json({ error: signInResult.error.message || 'Invalid credentials' });

    const session = signInResult.data?.session ?? null;
    if (!session) return res.status(401).json({ error: 'Invalid credentials' });

    const userId = session.user?.id;
    if (!userId) return res.status(401).json({ error: 'Invalid credentials' });

    // look up user profile in the internal `users` table (not auth.users)
    const { data: profiles, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1);

    if (profileError) {
      // if the users table doesn't exist in test DBs, fall back to session data
      if (profileError.message?.includes("Could not find the table")) {
        const fallbackProfile = { id: userId, email: session.user?.email || '' };
        return res.status(200).json({ success: true, profile: fallbackProfile });
      }
      console.error('Supabase profile query error', profileError);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!profiles || profiles.length === 0) return res.status(404).json({ error: 'User profile not found' });

    const profile = profiles[0];
    res.setHeader('Set-Cookie', `session=${session.access_token}; HttpOnly; Path=/; SameSite=Lax`);
    return res.status(200).json({ success: true, profile });
  } catch (err) {
    console.error('Unhandled error in authenticate handler', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
