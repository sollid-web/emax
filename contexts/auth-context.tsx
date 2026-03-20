'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import type { User, AuthContextType } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await apiFetch('/api/user/profile')
        if (!res.ok) {
          setUser(null)
          return
        }
        const data = await res.json()
        setUser(data.profile || data.user || null)
      } catch (error) {
        console.error('[v0] Auth load error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const signUp = async (email: string, password: string, full_name: string, username: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, username }),
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

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
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
      const profile = data.profile || data.user
      if (profile) {
        setUser(profile)
        const role = (profile.role || '').toLowerCase()
        if (['super_admin', 'finance_admin', 'support'].includes(role)) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      console.error('[v0] Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
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
