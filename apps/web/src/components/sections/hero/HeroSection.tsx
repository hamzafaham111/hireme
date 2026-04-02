import Link from 'next/link'
import { GridBackdrop } from '@/components/ui/grid-backdrop'
import { WhatsAppButton } from '@/components/whatsapp'
import { siteName } from '@/lib/site'

export function HeroSection() {
  return (
    <section className="relative hidden md:block overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
      <GridBackdrop className="dark:opacity-40" />
      <div className="pointer-events-none absolute -right-32 -top-32 size-[480px] rounded-full bg-brand-500/15 blur-3xl dark:bg-brand-500/20" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 size-[420px] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pt-24">
        <p className="inline-flex rounded-full border border-brand-300/90 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:border-brand-400/60 dark:bg-brand-900 dark:text-white">
          No app required · WhatsApp only
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
          Whatever you need,{' '}
          <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-violet-400">
            just text us on WhatsApp.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Deliveries, shopping, documents, and everyday errands—tell us in one
          message and {siteName} will take care of it. No apps, no forms.
        </p>
        <div className="mt-10 flex flex-row justify-start items-center gap-4 sm:flex-row sm:items-center">
          <WhatsAppButton className="px-3 py-3.5 text-base">
            Book on WhatsApp
          </WhatsAppButton>
          <Link
            href="/#how-it-works"
            scroll={false}
            className="text-center text-sm font-semibold text-brand-700 hover:text-brand-600 dark:text-brand-300 dark:hover:text-brand-200 sm:text-left"
          >
            See how it works →
          </Link>
        </div>
      </div>
    </section>
  )
}
