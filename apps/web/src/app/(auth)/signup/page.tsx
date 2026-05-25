'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWebAuth } from '@/context/WebAuthContext'
import { MinimalAuthHeader } from '@/components/auth/MinimalAuthHeader'
import { PhoneInput } from '@/components/auth/PhoneInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { FormError } from '@/components/auth/FormError'
import { TrustBadge } from '@/components/auth/TrustBadge'
import { platformStats } from '@/lib/stats'

type Role = 'customer' | 'worker'

export default function SignupPage() {
  const { register } = useWebAuth()
  const router = useRouter()

  const [role, setRole] = useState<Role>('customer')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const user = await register({ phone, email, name, password, role })
      // Redirect to phone verification page
      router.push(`/verify-phone?userId=${user.id}&phone=${encodeURIComponent(phone)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-up failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MinimalAuthHeader />

      <div className="mx-auto max-w-md px-4 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Join {platformStats.totalCustomers.toLocaleString()}+ customers &{' '}
            {platformStats.totalWorkers.toLocaleString()}+ workers
          </p>
        </div>

        {/* Role Selector Cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`group min-h-[100px] rounded-xl border-2 p-4 text-left transition sm:min-h-[120px] ${
              role === 'customer'
                ? 'border-brand-600 bg-brand-600 dark:border-brand-500 dark:bg-brand-600'
                : 'border-slate-200 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-full transition ${
                role === 'customer'
                  ? 'bg-white/20'
                  : 'bg-brand-100 dark:bg-brand-900/40'
              }`}>
                <svg className={`size-5 transition ${
                  role === 'customer'
                    ? 'text-white'
                    : 'text-brand-600 dark:text-brand-400'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              {role === 'customer' && (
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white">
                  <svg className="size-3.5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="mt-3">
              <h3 className={`text-sm font-semibold transition ${
                role === 'customer'
                  ? 'text-white'
                  : 'text-slate-900 dark:text-white'
              }`}>Customer</h3>
              <p className={`mt-0.5 text-xs transition ${
                role === 'customer'
                  ? 'text-white/80'
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                Post jobs & errands
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`group min-h-[100px] rounded-xl border-2 p-4 text-left transition sm:min-h-[120px] ${
              role === 'worker'
                ? 'border-brand-600 bg-brand-600 dark:border-brand-500 dark:bg-brand-600'
                : 'border-slate-200 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-full transition ${
                role === 'worker'
                  ? 'bg-white/20'
                  : 'bg-brand-100 dark:bg-brand-900/40'
              }`}>
                <svg className={`size-5 transition ${
                  role === 'worker'
                    ? 'text-white'
                    : 'text-brand-600 dark:text-brand-400'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {role === 'worker' && (
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white">
                  <svg className="size-3.5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="mt-3">
              <h3 className={`text-sm font-semibold transition ${
                role === 'worker'
                  ? 'text-white'
                  : 'text-slate-900 dark:text-white'
              }`}>Worker</h3>
              <p className={`mt-0.5 text-xs transition ${
                role === 'worker'
                  ? 'text-white/80'
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                Earn money on schedule
              </p>
            </div>
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-3 sm:space-y-4">
          {error && <FormError error={error} action={error.includes('already') ? 'login' : undefined} />}

          <PhoneInput
            value={phone}
            onChange={setPhone}
            required
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email address <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 sm:h-14"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 sm:h-14"
            />
          </div>

          <PasswordInput
            value={password}
            onChange={setPassword}
            required
            minLength={8}
            showStrength
          />

          <button
            type="submit"
            disabled={submitting}
            className="min-h-[44px] w-full rounded-xl bg-brand-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60 sm:min-h-[48px]"
          >
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
            Sign in
          </Link>
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <svg className="size-4 shrink-0 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>Updates on WhatsApp • No extra apps needed</span>
        </div>

        <div className="mt-4 pb-4">
          <TrustBadge />
        </div>
      </div>
    </div>
  )
}
