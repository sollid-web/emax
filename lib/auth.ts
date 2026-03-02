import { supabase } from './supabase-client'

export interface AuthResponse {
  user: any
  session: any
  error: string | null
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, fullname: string, username: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullname, username }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { user: null, session: null, error: error.error || 'Sign up failed' }
    }

    const data = await response.json()
    return { user: data.user, session: data.session, error: null }
  } catch (error: any) {
    console.error('[v0] Sign up error:', error)
    return { user: null, session: null, error: error.message || 'Network error' }
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { user: null, session: null, error: error.error || 'Login failed' }
    }

    const data = await response.json()
    
    // Store session tokens
    if (data.session) {
      sessionStorage.setItem('sb-access-token', data.session.access_token)
      sessionStorage.setItem('sb-refresh-token', data.session.refresh_token)
    }

    return { user: data.user, session: data.session, error: null }
  } catch (error: any) {
    console.error('[v0] Sign in error:', error)
    return { user: null, session: null, error: error.message || 'Network error' }
  }
}

// Sign out
export async function signOut(): Promise<{ error: string | null }> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    // Clear session storage
    sessionStorage.removeItem('sb-access-token')
    sessionStorage.removeItem('sb-refresh-token')

    return { error: null }
  } catch (error: any) {
    console.error('[v0] Sign out error:', error)
    return { error: error.message || 'Logout failed' }
  }
}

// Get current user from Supabase auth
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('[v0] Get current user error:', error)
    return null
  }
}

// Get current session
export async function getCurrentSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('[v0] Get current session error:', error)
    return null
  }
}

// Get user profile from database
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Get user profile error:', error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('[v0] Update user profile error:', error)
    return { data: null, error: error.message }
  }
}

// Verify KYC status
export async function getKYCStatus(userId: string) {
  try {
    const response = await fetch(`/api/kyc/status?userId=${userId}`)
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('[v0] Get KYC status error:', error)
    return null
  }
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}

// Password reset
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    console.error('[v0] Reset password error:', error)
    return { error: error.message }
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    console.error('[v0] Update password error:', error)
    return { error: error.message }
  }
}
