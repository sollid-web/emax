import { supabase } from '@/lib/supabase-client'

export async function apiFetch(path: string, options: RequestInit = {}) {
  // Get the current session token
  const { data: { session } } = await supabase.auth.getSession()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Attach token if session exists
  if (session?.access_token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${session.access_token}`
  }

  const res = await fetch(path, { ...options, headers })
  return res
}

// For multipart/form-data (file uploads like KYC)
export async function apiFormFetch(path: string, formData: FormData) {
  const { data: { session } } = await supabase.auth.getSession()

  const headers: HeadersInit = {}

  if (session?.access_token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${session.access_token}`
  }

  // Do NOT set Content-Type for FormData — browser sets it automatically
  const res = await fetch(path, {
    method: 'POST',
    headers,
    body: formData,
  })
  return res
}