'use client'

import type { FormEvent } from 'react'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWebAuth } from '@/context/WebAuthContext'
import { MinimalAuthHeader } from '@/components/auth/MinimalAuthHeader'

function LoginForm() {
  const { login } = useWebAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || ''

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const loggedIn = await login(phone, password)
      const safeReturn =
        returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : ''
      if (safeReturn) {
        router.replace(safeReturn)
        return
      }
      router.replace(loggedIn.role === 'worker' ? '/worker' : '/customer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 sm:h-14'

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Customers and workers use this page. Operations staff use the internal dashboard.
      </p>
      <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-4">
        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </p>
        ) : null}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Phone number
          </label>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+92 300 1234567"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="min-h-[44px] w-full rounded-xl bg-brand-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60 sm:min-h-[48px]"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        No account?{' '}
        <Link href="/signup" className="font-semibold text-brand-600 dark:text-brand-400">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MinimalAuthHeader />
      <Suspense
        fallback={
          <div className="py-16 text-center text-sm text-slate-500">Loading…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
