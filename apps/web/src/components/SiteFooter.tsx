import Link from 'next/link'
import { siteName } from '@/lib/site'
import { WhatsAppButton } from '@/components/WhatsAppButton'

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
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Explore
              </p>
              <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#services" className="hover:text-brand-600">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-brand-600">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="hover:text-brand-600">
                    Reviews
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Company
              </p>
              <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#partners" className="hover:text-brand-600">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-brand-600">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                Legal
              </p>
              <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-brand-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-brand-600">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-12 border-t border-slate-100 pt-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
          © {y} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
