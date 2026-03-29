'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Section anchors (e.g. /#services) live on `/`. Next.js client transitions do not
 * always scroll to the fragment; this aligns behavior with full page loads.
 */
function scrollToHomeHash() {
  if (typeof window === 'undefined') return
  const { pathname, hash } = window.location
  if (pathname !== '/' || !hash || hash.length < 2) return
  const id = decodeURIComponent(hash.slice(1))
  const el = document.getElementById(id)
  if (!el) return
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

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
