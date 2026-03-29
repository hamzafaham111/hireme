'use client'

import Link from 'next/link'
import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { siteName } from '@/lib/site'
import { WhatsAppButton } from '@/components/WhatsAppButton'

/** Root + hash so sections resolve on `/`; plain `#foo` would stick to `/blog#foo` etc. */
const nav = [
  { href: '/blog', label: 'Blog', isRoute: true as const },
  { href: '/#services', label: 'Services' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#partners', label: 'Partners' },
  { href: '/#reviews', label: 'Reviews' },
  { href: '/#faq', label: 'FAQ' },
] as const

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="size-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  )
}

/** Drawer close control — explicit X so users can dismiss without the header hamburger. */
function CloseCrossIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  /** Overlay must mount after hydration so we can portal to document.body. */
  const [portalReady, setPortalReady] = useState(false)
  const drawerId = useId()

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    setPortalReady(true)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeMenu])

  const mobileOverlay =
    portalReady &&
    createPortal(
      <div
        className={`fixed inset-0 z-[200] md:hidden ${
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Portaled to body so backdrop-blur on <header> does not trap fixed layers under <main> */}
        <aside
          id={drawerId}
          className={`relative z-10 flex h-full w-[min(100%,18rem)] max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-slate-700 dark:bg-slate-900 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          inert={!menuOpen}
          aria-hidden={!menuOpen}
          aria-label="Mobile navigation"
        >
          <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
            <span className="font-display text-sm font-semibold text-slate-600 dark:text-slate-300">
              Menu
            </span>
            <button
              type="button"
              className="inline-flex rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <CloseCrossIcon className="size-5" />
            </button>
          </div>
          <nav
            className="flex flex-1 flex-col gap-1 overflow-y-auto bg-white p-3 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Primary mobile"
          >
            {nav.map((item) =>
              'isRoute' in item && item.isRoute ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-900"
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-900"
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </aside>
        <button
          type="button"
          className={`absolute inset-0 z-0 bg-slate-900/50 transition-opacity duration-300 dark:bg-black/60 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close menu"
          tabIndex={-1}
          onClick={closeMenu}
        />
      </div>,
      document.body,
    )

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="-ml-1 inline-flex rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 md:hidden dark:text-slate-200 dark:hover:bg-slate-800"
              aria-expanded={menuOpen}
              aria-controls={drawerId}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <MenuIcon open={menuOpen} />
            </button>
            <Link
              href="/"
              className="truncate font-display text-lg font-bold tracking-tight text-brand-700 dark:text-brand-300"
              onClick={closeMenu}
            >
              {siteName}
            </Link>
          </div>

          <nav
            className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-300"
            aria-label="Primary"
          >
            {nav.map((item) =>
              'isRoute' in item && item.isRoute ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <WhatsAppButton className="gap-2 px-3 py-2 text-xs sm:px-5 sm:text-sm">
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sr-only sm:hidden">Open WhatsApp</span>
          </WhatsAppButton>
        </div>
      </header>
      {mobileOverlay}
    </>
  )
}
