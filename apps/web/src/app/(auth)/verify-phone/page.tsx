'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MinimalAuthHeader } from '@/components/auth/MinimalAuthHeader'
import { OTPInput } from '@/components/auth/OTPInput'
import { FormError } from '@/components/auth/FormError'
import { apiFetch } from '@/lib/api'

function VerifyPhoneForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const phone = searchParams.get('phone')

  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [resendCountdown, setResendCountdown] = useState(60)

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setResendDisabled(false)
    }
  }, [resendCountdown])

  const handleVerify = async () => {
    if (!userId || otp.length !== 6) return

    setError(null)
    setSubmitting(true)
    try {
      await apiFetch<{ success: boolean; phoneVerified: boolean }>(
        '/auth/verify-phone-otp',
        {
          method: 'POST',
          body: { userId, otp },
        },
      )

      // Success! Redirect based on role (we'll get it from session)
      router.push('/customer') // Frontend will redirect workers to pending page if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!userId) return

    setResendDisabled(true)
    setResendCountdown(60)
    setError(null)

    try {
      await apiFetch<{ success: boolean }>('/auth/send-phone-otp', {
        method: 'POST',
        body: { userId },
      })
    } catch {
      setError('Failed to resend code. Please try again.')
      setResendDisabled(false)
    }
  }

  if (!userId || !phone) {
    return (
      <div className="text-center">
        <p className="text-red-600">Invalid verification link.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Verify your phone number
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          We sent a 6-digit code to
        </p>
        <p className="mt-1 font-medium text-slate-900 dark:text-white">{decodeURIComponent(phone)}</p>
      </div>

      <div className="mt-8 space-y-6">
        {error && <FormError error={error} />}

        <OTPInput value={otp} onChange={setOtp} onComplete={handleVerify} />

        <button
          type="button"
          onClick={() => void handleVerify()}
          disabled={submitting || otp.length !== 6}
          className="min-h-[44px] w-full rounded-xl bg-brand-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60 sm:min-h-[48px]"
        >
          {submitting ? 'Verifying…' : 'Verify'}
        </button>

        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">Didn&apos;t receive it?</p>
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={resendDisabled}
            className="mt-2 text-sm font-semibold text-brand-600 hover:text-brand-700 disabled:text-slate-400 dark:text-brand-400 dark:hover:text-brand-300"
          >
            {resendDisabled
              ? `Resend code (${resendCountdown}s)`
              : 'Resend code'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          SMS charges may apply
        </p>
      </div>
    </div>
  )
}

export default function VerifyPhonePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MinimalAuthHeader />
      <Suspense
        fallback={
          <div className="py-16 text-center text-sm text-slate-500">Loading…</div>
        }
      >
        <VerifyPhoneForm />
      </Suspense>
    </div>
  )
}
