'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useWebAuth } from '@/context/WebAuthContext'

/** Restricts children to logged-in customers (and redirects others). */
export function CustomerGate({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useWebAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isAuthenticated) {
      const q = searchParams.toString()
      const returnUrl = `${pathname}${q ? `?${q}` : ''}`
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
      return
    }
    if (user?.role !== 'customer') {
      router.replace('/')
    }
  }, [isAuthenticated, user?.role, pathname, router, searchParams])

  if (!user || user.role !== 'customer') {
    return (
      <div className="py-16 text-center text-sm text-slate-600 dark:text-slate-400">
        Loading…
      </div>
    )
  }

  return <>{children}</>
}
