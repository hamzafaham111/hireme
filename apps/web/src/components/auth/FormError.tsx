'use client'

import Link from 'next/link'

interface FormErrorProps {
  error: string | null
  action?: 'login' | 'signup' | 'forgot_password'
}

export function FormError({ error, action }: FormErrorProps) {
  if (!error) return null

  const actionLinks = {
    login: { text: 'Try signing in instead', href: '/login' },
    signup: { text: 'Create an account', href: '/signup' },
    forgot_password: { text: 'Reset your password', href: '/forgot-password' },
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/40">
      <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
      {action && actionLinks[action] && (
        <Link
          href={actionLinks[action].href}
          className="mt-2 inline-block text-sm font-semibold text-red-700 underline hover:text-red-900 dark:text-red-300"
        >
          {actionLinks[action].text} →
        </Link>
      )}
    </div>
  )
}
