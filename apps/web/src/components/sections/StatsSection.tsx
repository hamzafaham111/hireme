import type { FC, SVGProps } from 'react'
import { SectionIntro } from '@/components/sections/SectionIntro'

type IconProps = SVGProps<SVGSVGElement>

function IconUsers({ className, ...p }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

function IconTasks({ className, ...p }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}

function IconCalendar({ className, ...p }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function IconStar({ className, ...p }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}

const stats: {
  value: string
  label: string
  Icon: FC<IconProps>
}[] = [
  { value: '50K+', label: 'Happy customers', Icon: IconUsers },
  { value: '500K+', label: 'Tasks completed', Icon: IconTasks },
  { value: '8+', label: 'Years experience', Icon: IconCalendar },
  { value: '4.9', label: 'Average rating', Icon: IconStar },
]

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50/80 py-12 dark:border-slate-800 dark:bg-slate-950 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[length:40px_40px] bg-grid-slate opacity-50 dark:opacity-25"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-20 top-1/2 size-64 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
