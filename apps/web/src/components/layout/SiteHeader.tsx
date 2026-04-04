'use client'

import Link from 'next/link'
import { useId } from 'react'
import { HeaderServiceLocation } from '@/components/layout/HeaderServiceLocation'
import { WhatsAppButton } from '@/components/whatsapp'
import { PRIMARY_NAV } from '@/lib/site-nav'
import { siteName } from '@/lib/site'

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <path d="M12 19v3" />
      <path d="M8 22h8" />
    </svg>
  )
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 3H2l8 9.32V19l4 2v-6.68L22 3Z" />
    </svg>
  )
}

export function SiteHeader() {
  const searchFieldId = useId()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-950">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="truncate font-display text-lg font-bold tracking-tight text-brand-700 dark:text-brand-300"
            >
              {siteName}
            </Link>
          </div>

          <nav
            className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-300"
            aria-label="Primary"
          >
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-brand-600 dark:hover:text-brand-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <WhatsAppButton className="gap-2 px-3 py-2 text-xs sm:px-5 sm:text-sm">
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sr-only sm:hidden">Open WhatsApp</span>
          </WhatsAppButton>
        </div>
        <div>
        <form
          className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 md:justify-between lg:px-8"
          role="search"
          aria-label="Find services"
          onSubmit={(e) => e.preventDefault()}
        >
          <HeaderServiceLocation />
          <div className="flex min-w-0 w-full flex-1 items-stretch gap-2 md:w-auto md:max-w-lg md:flex-none lg:max-w-xl">
            <div className="relative min-w-0 flex-1">
              <label htmlFor={searchFieldId} className="sr-only">
                Search services
              </label>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id={searchFieldId}
                type="search"
                name="q"
                placeholder="Search for services"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Search by voice"
              >
                <MicIcon className="size-4" />
              </button>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              aria-label="Filter services"
            >
              <FilterIcon className="size-4" />
            </button>
          </div>
        </form>
      </div>
      </header>
    </>
  )
}
