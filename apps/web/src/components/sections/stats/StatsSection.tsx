import type { FC } from 'react'
import type { SiteIconProps } from '@/components/icons/site-icons'
import {
  IconStatCalendar,
  IconStatStar,
  IconStatTasks,
  IconStatUsers,
} from '@/components/icons/site-icons'
import { SectionIntro } from '@/components/sections/shared'
import { GridBackdrop } from '@/components/ui/grid-backdrop'

const stats: {
  value: string
  label: string
  Icon: FC<SiteIconProps>
}[] = [
  { value: '50K+', label: 'Happy customers', Icon: IconStatUsers },
  { value: '500K+', label: 'Tasks completed', Icon: IconStatTasks },
  { value: '8+', label: 'Years experience', Icon: IconStatCalendar },
  { value: '4.9', label: 'Average rating', Icon: IconStatStar },
]

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50/80 py-12 dark:border-slate-800 dark:bg-slate-950 sm:py-16">
      <GridBackdrop className="opacity-50 dark:opacity-25" />
      <div className="pointer-events-none absolute -right-20 top-1/2 size-64 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="At a glance"
          title="Trusted at scale"
          description="Numbers that reflect real errands run—deliveries, shopping trips, documents, and more—through one WhatsApp line."
        />
        <ul
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-4"
          aria-label="Key statistics"
        >
          {stats.map(({ value, label, Icon }) => (
            <li key={label} className="min-w-0">
              <div className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition hover:border-brand-200/80 hover:shadow-md dark:border-slate-700/80 dark:from-slate-900/80 dark:to-slate-950/90 dark:ring-white/[0.06] dark:hover:border-brand-500/30 sm:p-5">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/[0.12] text-brand-600 transition group-hover:bg-brand-500/[0.18] dark:bg-brand-400/15 dark:text-brand-300 dark:group-hover:bg-brand-400/25 sm:size-12 sm:rounded-2xl"
                  aria-hidden
                >
                  <Icon className="size-5 sm:size-6" />
                </div>
                <p className="mt-4 font-display text-2xl font-bold tabular-nums tracking-tight text-brand-600 dark:text-brand-400 sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium leading-snug text-slate-600 dark:text-slate-400 sm:text-sm">
                  {label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
