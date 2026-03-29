'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react'
import { scrollToHomeHash } from '@/lib/scroll-home-hash'
import { MOBILE_TAB_ICONS } from '@/components/icons/site-icons'
import { MOBILE_TAB_ITEMS } from '@/lib/site-nav'
import { whatsappHref } from '@/lib/site'

/** WhatsApp brand on the tab (icon uses fill/stroke currentColor). */
const WHATSAPP_TAB_CLASS =
  'text-[#25D366] hover:text-[#20bd5a] active:text-[#1ea952] dark:text-[#25D366] dark:hover:text-[#34d399] dark:active:text-[#2fce7a]'

type MobileTabId = 'home' | 'services' | 'how' | 'blog'

/** After `router.push('/')` from another route: jump to section or top of home. */
type PendingOnHome = { readonly kind: 'hash'; readonly value: string } | { readonly kind: 'top' }

/**
 * `history.replaceState` does not fire `hashchange`; subscribers must still re-read.
 */
function stripHashFromUrl(): void {
  const { pathname, search } = window.location
  window.history.replaceState(window.history.state, '', `${pathname}${search}`)
  window.dispatchEvent(new Event('hashchange'))
}

/** Hash updates live outside React state; keep in module scope for ESLint immutability rules. */
function setBrowserHash(fragment: string): void {
  window.location.hash = fragment
}

/**
 * Subscribes to `hashchange` / `popstate` without `setState` inside effects (ESLint
 * `react-hooks/set-state-in-effect`). `pathname` is folded into the snapshot so
 * client navigations still re-read `location.hash`.
 */
function useLocationHashForTabs(pathname: string): string {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const run = () => queueMicrotask(onStoreChange)
    window.addEventListener('hashchange', run)
    window.addEventListener('popstate', run)
    return () => {
      window.removeEventListener('hashchange', run)
      window.removeEventListener('popstate', run)
    }
  }, [])

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return `${pathname}|`
    return `${pathname}|${window.location.hash.toLowerCase()}`
  }, [pathname])

  const getServerSnapshot = useCallback(() => `${pathname}|`, [pathname])

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const sep = snapshot.indexOf('|')
  return sep >= 0 ? snapshot.slice(sep + 1) : ''
}

function tabFromUrl(pathname: string, hash: string): MobileTabId | null {
  if (pathname.startsWith('/blog')) return 'blog'
  if (pathname !== '/') return null
  const h = hash.toLowerCase()
  if (h === '#services') return 'services'
  if (h === '#how-it-works') return 'how'
  if (h === '' || h === '#') return 'home'
  return null
}

const tabShell =
  'flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-semibold outline-none transition-colors duration-200 ease-out'

/**
 * App-style bottom navigation — visible only below `md`.
 */
export function MobileTabBar() {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const hash = useLocationHashForTabs(pathname)

  const [pressedTabId, setPressedTabId] = useState<MobileTabId | null>(null)
  const pendingOnHomeRef = useRef<PendingOnHome | null>(null)

  useEffect(() => {
    const onPopState = () => setPressedTabId(null)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  /** Leaving `/` (e.g. Blog): drop optimistic tab once the new route is active. */
  useEffect(() => {
    if (pathname === '/') return
    const id = requestAnimationFrame(() => setPressedTabId(null))
    return () => cancelAnimationFrame(id)
  }, [pathname])

  /**
   * Landed on `/` from another path: apply queued hash or scroll-top, then drop
   * optimistic state. `queueMicrotask` avoids Strict Mode cancelling a rAF cleanup
   * before the hash is applied.
   */
  useEffect(() => {
    if (pathname !== '/') return
    const pending = pendingOnHomeRef.current
    if (pending === null) return
    pendingOnHomeRef.current = null
    queueMicrotask(() => {
      if (pending.kind === 'top') {
        if (window.location.hash) stripHashFromUrl()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setBrowserHash(pending.value)
      }
      requestAnimationFrame(() => setPressedTabId(null))
    })
  }, [pathname])

  const urlTab = tabFromUrl(pathname, hash)
  const activeTabId: MobileTabId | null =
    pressedTabId !== null ? pressedTabId : urlTab

  const goHomeSection = (tabId: MobileTabId, fragment: string) => {
    setPressedTabId(tabId)
    if (pathname !== '/') {
      pendingOnHomeRef.current = { kind: 'hash', value: fragment }
      router.push('/')
      return
    }
    const next = fragment.toLowerCase()
    if (window.location.hash.toLowerCase() === next) {
      scrollToHomeHash()
      return
    }
    setBrowserHash(fragment)
  }

  const goHomeTop = () => {
    setPressedTabId('home')
    if (pathname !== '/') {
      pendingOnHomeRef.current = { kind: 'top' }
      router.push('/')
      return
    }
    if (window.location.hash) stripHashFromUrl()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.12)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.4)] md:hidden"
      aria-label="Primary mobile"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {MOBILE_TAB_ITEMS.map((item) => {
          const Icon = MOBILE_TAB_ICONS[item.id]
          const active =
            !item.isWhatsApp && item.id === activeTabId

          if (item.isWhatsApp) {
            return (
              <li key={item.id} className="flex min-w-0 flex-1 justify-center">
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${tabShell} ${WHATSAPP_TAB_CLASS} focus-visible:ring-2 focus-visible:ring-[#25D366]/40`}
                >
                  <Icon className="size-6 shrink-0" />
                  <span>{item.label}</span>
                </a>
              </li>
            )
          }

          const inactive =
            'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          const activeCls =
            'text-brand-600 dark:text-brand-400'

          if (item.id === 'home') {
            return (
              <li key={item.id} className="flex min-w-0 flex-1 justify-center">
                <Link
                  href="/"
                  scroll={false}
                  onClick={(e: MouseEvent) => {
                    e.preventDefault()
                    goHomeTop()
                  }}
                  className={`${tabShell} focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                    active ? activeCls : inactive
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    className={`size-6 shrink-0 ${active ? activeCls : inactive}`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          }

          if (item.hash) {
            const fragment = item.hash
            return (
              <li key={item.id} className="flex min-w-0 flex-1 justify-center">
                <Link
                  href={item.href}
                  scroll={false}
                  onClick={(e: MouseEvent) => {
                    e.preventDefault()
                    goHomeSection(item.id as MobileTabId, fragment)
                  }}
                  className={`${tabShell} focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                    active ? activeCls : inactive
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    className={`size-6 shrink-0 ${active ? activeCls : inactive}`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          }

          return (
            <li key={item.id} className="flex min-w-0 flex-1 justify-center">
              <Link
                href={item.href}
                onClick={() => setPressedTabId(item.id as MobileTabId)}
                className={`${tabShell} focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                  active ? activeCls : inactive
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className={`size-6 shrink-0 ${active ? activeCls : inactive}`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
