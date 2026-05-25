'use client'

import { useRouter } from 'next/navigation'

export function MinimalAuthHeader() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-sm dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-2xl items-center px-4 sm:h-16">
        <button
          type="button"
          onClick={() => router.back()}
          className="-ml-2 flex items-center gap-1.5 text-slate-700 transition-colors active:text-brand-600 dark:text-slate-300 dark:active:text-brand-400 sm:hover:text-brand-600 dark:sm:hover:text-brand-400"
          aria-label="Go back"
        >
          <svg className="size-5 sm:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium sm:text-base">Back</span>
        </button>
      </div>
    </header>
  )
}
