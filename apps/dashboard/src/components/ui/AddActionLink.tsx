import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Primary “add / create” CTA for list pages: pill, icon chip, gradient, soft shadow.
 */
const addActionClassName =
  'group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-1.5 py-1 pr-5 text-sm font-semibold tracking-tight text-white shadow-[0_6px_24px_-4px_rgba(99,102,241,0.4)] ring-1 ring-white/25 transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_-6px_rgba(124,58,237,0.45)] hover:brightness-[1.03] active:translate-y-0 active:scale-[0.98] active:brightness-100 dark:ring-white/15 dark:hover:shadow-[0_10px_36px_-6px_rgba(99,102,241,0.32)]'

export function AddActionLink({
  to,
  children,
  disabled,
}: {
  to: string
  children: ReactNode
  /** When true, renders a non-interactive control (e.g. missing API token). */
  disabled?: boolean
}) {
  if (disabled) {
    return (
      <span
        aria-disabled
        className={`${addActionClassName} pointer-events-none cursor-not-allowed opacity-45`}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-inner shadow-black/10 backdrop-blur-sm">
          <PlusIcon className="size-4" />
        </span>
        <span className="pr-0.5">{children}</span>
      </span>
    )
  }
  return (
    <Link
      to={to}
      className={addActionClassName}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-inner shadow-black/10 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105 group-hover:bg-white/30">
        <PlusIcon className="size-4" />
      </span>
      <span className="pr-0.5">{children}</span>
    </Link>
  )
}
