'use client'

import type { DashboardRole } from '@hire-me/types'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiFetch } from '@/lib/api'

const SESSION_KEY = 'hireme_web_session_v2'

export interface WebAuthUser {
  email: string
  userId: string
  name: string
  role: DashboardRole
  // Profile references
  phone?: string
  phoneVerified?: boolean
  hasCustomerProfile?: boolean
  hasWorkerProfile?: boolean
  workerApprovalStatus?: 'pending' | 'approved' | 'rejected' | 'suspended'
}

interface SessionPayload {
  v: 2
  accessToken: string
  email: string
  userId: string
  name: string
  role: DashboardRole
  createdAt: string
}

interface WebAuthContextValue {
  user: WebAuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (
    phone: string,
    password: string,
  ) => Promise<{ id: string; phone: string; email: string; name: string; role: DashboardRole }>
  register: (input: {
    phone: string
    email: string
    password: string
    name: string
    role: 'customer' | 'worker'
  }) => Promise<{ id: string; phone: string; email: string; name: string; role: DashboardRole; phoneVerified: boolean; workerApproved: boolean }>
  logout: () => void
}

const WebAuthContext = createContext<WebAuthContextValue | null>(null)

function readSession(): SessionPayload | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<SessionPayload>
    if (
      data?.v !== 2 ||
      !data.email ||
      !data.userId ||
      !data.role ||
      typeof data.accessToken !== 'string' ||
      !data.accessToken
    ) {
      return null
    }
    return {
      v: 2,
      accessToken: data.accessToken,
      email: data.email,
      userId: data.userId,
      name: data.name ?? '',
      role: data.role as DashboardRole,
      createdAt: data.createdAt ?? new Date().toISOString(),
    }
  } catch {
    return null
  }
}

function writeSession(payload: SessionPayload | null) {
  try {
    if (payload) localStorage.setItem(SESSION_KEY, JSON.stringify(payload))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function WebAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(() =>
    typeof window !== 'undefined' ? readSession() : null,
  )

  const user = useMemo((): WebAuthUser | null => {
    if (!session) return null
    return {
      email: session.email,
      userId: session.userId,
      name: session.name,
      role: session.role,
    }
  }, [session])

  const accessToken = session?.accessToken ?? null

  const login = useCallback(async (phone: string, password: string) => {
    const trimmedPhone = phone.trim()
    if (!trimmedPhone || !/^\+?[1-9]\d{1,14}$/.test(trimmedPhone)) {
      throw new Error('Enter a valid phone number.')
    }
    if (password.length < 1) {
      throw new Error('Password is required.')
    }

    const res = await apiFetch<{
      access_token: string
      user: {
        id: string
        phone: string
        email: string
        name: string
        role: DashboardRole
        phoneVerified: boolean
        workerApproved?: boolean
      }
    }>('/auth/login', {
      method: 'POST',
      body: { identifier: trimmedPhone, password },
    })

    if (res.user.role === 'admin') {
      throw new Error(
        'Operations staff sign in on the internal dashboard, not this site.',
      )
    }

    // Check worker approval
    if (res.user.role === 'worker' && !res.user.workerApproved) {
      throw new Error('Your worker account is pending approval.')
    }

    const next: SessionPayload = {
      v: 2,
      accessToken: res.access_token,
      email: res.user.email,
      userId: res.user.id,
      name: res.user.name,
      role: res.user.role,
      createdAt: new Date().toISOString(),
    }
    writeSession(next)
    setSession(next)
    return res.user
  }, [])

  const register = useCallback(
    async (input: {
      phone: string
      email: string
      password: string
      name: string
      role: 'customer' | 'worker'
    }) => {
      const trimmedPhone = input.phone.trim()
      if (!trimmedPhone || !/^\+?[1-9]\d{1,14}$/.test(trimmedPhone)) {
        throw new Error('Enter a valid phone number.')
      }
      
      const trimmedEmail = input.email.trim().toLowerCase()
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        throw new Error('Enter a valid email address.')
      }
      if (input.password.length < 8) {
        throw new Error('Password must be at least 8 characters.')
      }
      if (!input.name.trim()) {
        throw new Error('Name is required.')
      }

      const res = await apiFetch<{
        access_token: string
        user: {
          id: string
          phone: string
          email: string
          name: string
          role: DashboardRole
          phoneVerified: boolean
          workerApproved: boolean
        }
      }>('/auth/register', {
        method: 'POST',
        body: {
          phone: trimmedPhone,
          email: trimmedEmail,
          password: input.password,
          name: input.name.trim(),
          role: input.role,
        },
      })

      const next: SessionPayload = {
        v: 2,
        accessToken: res.access_token,
        email: res.user.email,
        userId: res.user.id,
        name: res.user.name,
        role: res.user.role,
        createdAt: new Date().toISOString(),
      }
      writeSession(next)
      setSession(next)
      
      return res.user
    },
    [],
  )

  const logout = useCallback(() => {
    writeSession(null)
    setSession(null)
  }, [])

  const value = useMemo<WebAuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, accessToken, login, register, logout],
  )

  return <WebAuthContext.Provider value={value}>{children}</WebAuthContext.Provider>
}

export function useWebAuth() {
  const ctx = useContext(WebAuthContext)
  if (!ctx) throw new Error('useWebAuth must be used within WebAuthProvider')
  return ctx
}
