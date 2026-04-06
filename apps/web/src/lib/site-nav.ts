/**
 * Primary header navigation and footer link groups — single source of truth for URLs/labels.
 * Hash links use `/` prefix so they resolve from routes like `/blog` (plain `#foo` would not).
 */

export type PrimaryNavItem = { readonly href: string; readonly label: string }

/** Hash links use `/` so they resolve from routes like `/blog`. */
export const PRIMARY_NAV: readonly PrimaryNavItem[] = [
  { href: '/#services', label: 'Services' },
  { href: '/#near-you', label: 'Popular near you' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#partners', label: 'Partners' },
  { href: '/#reviews', label: 'Reviews' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
] as const

/**
 * Fixed bottom tab bar (mobile only). `hash` is used with pathname `/` for active styling.
 * Chat opens WhatsApp — handled in `MobileTabBar`.
 */
export const MOBILE_TAB_ITEMS: readonly {
  readonly href: string
  readonly label: string
  readonly id: 'home' | 'services' | 'how' | 'blog' | 'chat'
  readonly hash?: string
  readonly isWhatsApp?: true
}[] = [
  { href: '/', label: 'Home', id: 'home' },
  { href: '/#services', label: 'Services', id: 'services', hash: '#services' },
  { href: '/#how-it-works', label: 'How', id: 'how', hash: '#how-it-works' },
  { href: '/blog', label: 'Blog', id: 'blog' },
  { href: '#', label: 'Chat', id: 'chat', isWhatsApp: true },
] as const

export type FooterLink = { readonly href: string; readonly label: string }

export const FOOTER_LINK_GROUPS: {
  readonly title: string
  readonly links: readonly FooterLink[]
}[] = [
  {
    title: 'Explore',
    links: [
      { href: '/#services', label: 'Services' },
      { href: '/#near-you', label: 'Popular near you' },
      { href: '/#how-it-works', label: 'How it works' },
      { href: '/blog', label: 'Blog' },
      { href: '/#reviews', label: 'Reviews' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/#partners', label: 'Partners' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
] as const
