import Link from 'next/link'
import { FOOTER_LINK_GROUPS } from '@/lib/site-nav'
import { siteName } from '@/lib/site'
import { WhatsAppButton } from '@/components/whatsapp'

const footerLinkClass = 'hover:text-brand-600 dark:hover:text-brand-400'

export function SiteFooter() {
  const y = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="font-display text-lg font-bold text-brand-700 dark:text-brand-300">
              {siteName}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              On-demand help for busy people and businesses. Book in one
              WhatsApp message—no apps, no contracts.
            </p>
            <div className="mt-6">
              <WhatsAppButton>Start on WhatsApp</WhatsAppButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            {FOOTER_LINK_GROUPS.map((group, index) => (
              <div
                key={group.title}
                className={
                  index === FOOTER_LINK_GROUPS.length - 1
                    ? 'col-span-2 sm:col-span-1'
                    : undefined
                }
              >
                <p className="font-semibold text-slate-900 dark:text-white">
                  {group.title}
                </p>
                <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-400">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={footerLinkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-12 border-t border-slate-100 pt-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
          © {y} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
