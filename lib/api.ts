import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` }
    }
  } catch (e) {}
  return {}
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const authHeaders = await getAuthHeaders()
  const res = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      ...authHeaders,
    },
  })
  return res
}

export async function apiFormFetch(path: string, formData: FormData) {
  const authHeaders = await getAuthHeaders()
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'include',
    headers: { ...authHeaders },
    body: formData,
  })
  return res
}
