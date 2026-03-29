'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { MOBILE_TAB_ICONS } from '@/components/icons/site-icons'
import { MOBILE_TAB_ITEMS } from '@/lib/site-nav'
import { whatsappHref } from '@/lib/site'

/** WhatsApp brand on the tab (icon uses fill/stroke currentColor). */
const WHATSAPP_TAB_CLASS =
  'text-[#25D366] hover:text-[#20bd5a] active:text-[#1ea952] dark:text-[#25D366] dark:hover:text-[#34d399] dark:active:text-[#2fce7a]'

type MobileTabId = 'home' | 'services' | 'how' | 'blog'

/**
 * Subscribes to `hashchange` / `popstate` without `setState` inside effects (ESLint
 * `react-hooks/set-state-in-effect`). `pathname` is folded into the snapshot so
 * client navigations that omit those events still re-read `location.hash`.
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
  const hash = useLocationHashForTabs(pathname)

  /**
   * URL is often one frame behind the tap (Next.js + hash). Optimistic highlight;
   * drop it when the route path changes or the user uses history so we do not lie
   * after back/forward (no synchronous setState in an effect — ESLint).
   */
  const [pressedTabId, setPressedTabId] = useState<MobileTabId | null>(null)
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    const onPopState = () => setPressedTabId(null)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (pathnameRef.current === pathname) return
    pathnameRef.current = pathname
    const id = requestAnimationFrame(() => setPressedTabId(null))
    return () => cancelAnimationFrame(id)
  }, [pathname])

  const urlTab = tabFromUrl(pathname, hash)
  const activeTabId: MobileTabId | null =
    pressedTabId !== null ? pressedTabId : urlTab

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

          return (
            <li key={item.id} className="flex min-w-0 flex-1 justify-center">
              <Link
                href={item.href}
                scroll={item.hash ? false : undefined}
                onClick={() =>
                  setPressedTabId(item.id as MobileTabId)
                }
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
