import Link from 'next/link'
import { siteName } from '@/lib/site'
import { WhatsAppButton } from '@/components/WhatsAppButton'

const nav = [
  { href: '/blog', label: 'Blog', isRoute: true as const },
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#partners', label: 'Partners' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-brand-700 dark:text-brand-300"
        >
          {siteName}
        </Link>
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
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-brand-600 dark:hover:text-brand-400"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
        <WhatsAppButton className="gap-2 px-3 py-2 text-xs sm:px-5 sm:text-sm">
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="sr-only sm:hidden">Open WhatsApp</span>
        </WhatsAppButton>
      </div>
    </header>
  )
}
