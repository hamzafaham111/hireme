import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { DashboardRole } from '@hire-me/types'
import { apiFetch } from '../lib/api'

const SESSION_KEY = 'hireme_dashboard_session_v2'
const LEGACY_SESSION_KEY = 'hireme_dashboard_session'

export interface AuthUser {
  email: string
  userId: string
  name: string
  role: DashboardRole
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

interface AuthContextValue {
  user: AuthUser | null
  /** JWT for `Authorization` header; null when logged out. */
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): SessionPayload | null {
  try {
    if (typeof window === 'undefined') return null
    try {
      if (localStorage.getItem(LEGACY_SESSION_KEY)) {
        localStorage.removeItem(LEGACY_SESSION_KEY)
      }
    } catch {
      /* ignore */
    }
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(() =>
    typeof window !== 'undefined' ? readSession() : null,
  )

  const user = useMemo((): AuthUser | null => {
    if (!session) return null
    return {
      email: session.email,
      userId: session.userId,
      name: session.name,
      role: session.role,
    }
  }, [session])

  const accessToken = session?.accessToken ?? null

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Enter a valid email address.')
    }
    if (password.length < 1) {
      throw new Error('Password is required.')
    }

    const res = await apiFetch<{
      access_token: string
      user: {
        id: string
        email: string
        name: string
        role: DashboardRole
      }
    }>('/auth/login', {
      method: 'POST',
      body: { email: trimmedEmail, password },
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
  }, [])

  const logout = useCallback(() => {
    writeSession(null)
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, accessToken, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
