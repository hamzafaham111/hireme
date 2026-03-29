import type { ReactNode } from 'react'
import { IconBell, IconMenu } from '../icons/LayoutIcons'

export interface HeaderProps {
  title: string
  subtitle?: string
  onOpenSidebar: () => void
  actions?: ReactNode
}

/**
 * Sticky top bar: opens the mobile drawer and hosts optional right-side actions.
 */
export function Header({
  title,
  subtitle,
  onOpenSidebar,
  actions,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          className="inline-flex rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          onClick={onOpenSidebar}
          aria-label="Open menu"
        >
          <IconMenu className="size-6" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {actions}
          <button
            type="button"
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Notifications"
          >
            <IconBell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-950" />
          </button>
        </div>
      </div>
    </header>
  )
}
