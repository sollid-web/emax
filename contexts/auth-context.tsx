'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import type { User, AuthContextType } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if Supabase is initialized
    if (!supabase) {
      setLoading(false)
      console.warn('[v0] Supabase not initialized. Auth features disabled.')
      return
    }

    // Check if user is logged in
    const checkUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Fetch user profile from users table
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()

          if (profile) {
            setUser(profile)
          }
        }
      } catch (error) {
        console.error('[v0] Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: { user: { id: any } }) => {
      try {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser(profile)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('[v0] Auth state change error:', error)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullname: string, username: string) => {
    try {
      // Call production registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullname, username }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMsg = 'Sign up failed'
        try {
          const errorData = JSON.parse(errorText)
          errorMsg = errorData.error || errorMsg
        } catch {
          errorMsg = `Server error: ${response.status}`
        }
        throw new Error(errorMsg)
      }

      const data = await response.json()
      if (data.user) {
        setUser(data.user)
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('[v0] Sign up error:', error)
      throw error
    }
  }

  const signUpOld = async (email: string, password: string, fullname: string, username: string) => {
    try {
      // Sign up user with Supabase Auth
      const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError
      if (!authUser) throw new Error('No user returned from sign up')

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email,
            fullname,
            username,
          },
        ])

      if (profileError) throw profileError

      // Create portfolio for user
      await supabase
        .from('portfolios')
        .insert([
          {
            user_id: authUser.id,
            total_invested: 0,
            current_balance: 0,
            total_profit: 0,
            profit_percentage: 0,
          },
        ])

      setUser({ id: authUser.id, email, fullname, username, created_at: new Date().toISOString() })
      router.push('/dashboard')
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Call production authentication API
      const response = await fetch('/api/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMsg = 'Login failed'
        try {
          const errorData = JSON.parse(errorText)
          errorMsg = errorData.error || errorMsg
        } catch {
          errorMsg = `Server error: ${response.status}`
        }
        throw new Error(errorMsg)
      }

      const data = await response.json()
      if (data.user) {
        setUser(data.user)
        // Store session tokens
        if (data.session) {
          sessionStorage.setItem('sb-access-token', data.session.access_token)
          sessionStorage.setItem('sb-refresh-token', data.session.refresh_token)
        }
        router.push(data.user.is_admin ? '/admin' : '/dashboard')
      }
    } catch (error: any) {
      console.error('[v0] Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Call logout API route
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
