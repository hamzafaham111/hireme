import type { Metadata } from 'next'
import Link from 'next/link'
import { siteName } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms',
  description: `Terms of use for ${siteName}.`,
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
        <Link href="/" className="hover:underline">
          ← Home
        </Link>
      </p>
      <h1 className="mt-6 font-display text-3xl font-bold text-slate-900 dark:text-white">
        Terms of use
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Placeholder terms page. Add your jurisdiction-specific terms, liability
        limits, prohibited items, cancellation policy, and payment rules before
        production. This site is intended to deploy separately from your
        internal dashboard.
      </p>
    </div>
  )
}
