/**
 * Scroll to the in-page target for `window.location.hash` on `/`.
 * Shared by `HomeHashScroll` and `MobileTabBar` (kept out of component modules
 * to avoid webpack client chunk ordering issues).
 */
export function scrollToHomeHash(): void {
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
