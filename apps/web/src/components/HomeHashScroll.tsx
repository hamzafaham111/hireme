'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { scrollToHomeHash } from '@/lib/scroll-home-hash'

/**
 * Section anchors (e.g. /#services) live on `/`. Next.js client transitions do not
 * always scroll to the fragment; this aligns behavior with full page loads.
 */
export function HomeHashScroll() {
  const pathname = usePathname()

  useEffect(() => {
    scrollToHomeHash()
  }, [pathname])

  useEffect(() => {
    window.addEventListener('hashchange', scrollToHomeHash)
    return () => window.removeEventListener('hashchange', scrollToHomeHash)
  }, [])

  return null
}
