'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { MOBILE_TAB_ICONS } from '@/components/icons/site-icons'
import { MOBILE_TAB_ITEMS } from '@/lib/site-nav'
import { whatsappHref } from '@/lib/site'

/** WhatsApp brand on the tab (icon uses fill/stroke currentColor). */
const WHATSAPP_TAB_CLASS =
  'text-[#25D366] hover:text-[#20bd5a] active:text-[#1ea952] dark:text-[#25D366] dark:hover:text-[#34d399] dark:active:text-[#2fce7a]'

/**
 * Syncs `location.hash` for tab highlighting. Next.js `<Link href="/#id">` often updates the URL
 * without firing `hashchange`; we re-read on pathname change, popstate, hashchange, and after any
 * click that targets a hash link (capture phase + short timeout so the router applies first).
 */
function useLocationHashForTabs(): string {
  const pathname = usePathname()
  const [hash, setHash] = useState('')

  const readHash = useCallback(() => {
    if (typeof window === 'undefined') return
    setHash(window.location.hash.toLowerCase())
  }, [])

  useEffect(() => {
    readHash()
    const t0 = window.setTimeout(readHash, 0)
    const t1 = window.setTimeout(readHash, 50)
    return () => {
      window.clearTimeout(t0)
      window.clearTimeout(t1)
    }
  }, [pathname, readHash])

  useEffect(() => {
    readHash()
    window.addEventListener('hashchange', readHash)
    window.addEventListener('popstate', readHash)
    return () => {
      window.removeEventListener('hashchange', readHash)
      window.removeEventListener('popstate', readHash)
    }
  }, [readHash])

  useEffect(() => {
    const onPointerUpCapture = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null
      const a = el?.closest?.('a[href*="#"]')
      if (!a) return
      window.setTimeout(readHash, 0)
      window.setTimeout(readHash, 32)
    }
    document.addEventListener('pointerup', onPointerUpCapture, true)
    return () => document.removeEventListener('pointerup', onPointerUpCapture, true)
  }, [readHash])

  return hash
}

function tabIsActive(
  pathname: string,
  hash: string,
  item: (typeof MOBILE_TAB_ITEMS)[number],
): boolean {
  if (item.isWhatsApp) return false
  if (item.id === 'blog') return pathname.startsWith('/blog')
  if (item.hash) {
    return pathname === '/' && hash === item.hash.toLowerCase()
  }
  if (item.id === 'home') {
    return pathname === '/' && (hash === '' || hash === '#')
  }
  return false
}

const tabShell =
  'flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-semibold outline-none transition-colors duration-100'

/**
 * App-style bottom navigation — visible only below `md`.
 */
export function MobileTabBar() {
  const pathname = usePathname() ?? ''
  const hash = useLocationHashForTabs()
  /**
   * Next.js client `<Link href="/#section">` often does not update `location.hash` in sync (or at all),
   * so URL-driven `tabIsActive` would keep Home highlighted. We set the pressed tab immediately on
   * click; clearing when `pathname` / `hash` change keeps back/forward and real URL updates correct.
   */
  const [pressedTabId, setPressedTabId] = useState<
    'home' | 'services' | 'how' | 'blog' | null
  >(null)

  useEffect(() => {
    setPressedTabId(null)
  }, [pathname, hash])

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.12)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.4)] md:hidden"
      aria-label="Primary mobile"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {MOBILE_TAB_ITEMS.map((item) => {
          const Icon = MOBILE_TAB_ICONS[item.id]
          const active =
            pressedTabId !== null
              ? item.id === pressedTabId
              : tabIsActive(pathname, hash, item)

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
                  setPressedTabId(
                    item.id as 'home' | 'services' | 'how' | 'blog',
                  )
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
