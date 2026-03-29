import type { FC, SVGProps } from 'react'
import { SectionIntro } from '@/components/sections/SectionIntro'
import { WhatsAppButton } from '@/components/WhatsAppButton'

type IconProps = SVGProps<SVGSVGElement>

function IconChat({ className, ...p }: IconProps) {
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
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7H8l-5 3v-3.3a8.5 8.5 0 01-1.7-9.2 8.38 8.38 0 013.8-.9" />
      <path d="M15.5 3.5l.6 2.2 2.2.6-2.2.6-.6 2.2-.6-2.2-2.2-.6 2.2-.6z" />
    </svg>
  )
}

function IconMapPin({ className, ...p }: IconProps) {
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
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconPhoto({ className, ...p }: IconProps) {
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}

const quickTips: {
  title: string
  hint: string
  Icon: FC<IconProps>
}[] = [
  {
    title: 'Say what you need',
    hint: 'One line is fine—pick up, shop, deliver, wait in line…',
    Icon: IconChat,
  },
  {
    title: 'Where & when',
    hint: 'Places, addresses, or a map pin—plus a time if you have one.',
    Icon: IconMapPin,
  },
  {
    title: 'Photo? Even better',
    hint: 'Snap the shelf, receipt, or door—only if it helps.',
    Icon: IconPhoto,
  },
]

export function WhatsAppInfoSection() {
  return (
    <section className="border-b border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-950 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="WhatsApp only"
          title="Book in one chat"
          description="No app to install. Text us like anyone else—we reply in WhatsApp and keep the whole job in that same thread."
        />

        <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
          {quickTips.map(({ title, hint, Icon }) => (
            <li key={title} className="min-w-0">
              <div className="flex h-full gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 dark:border-slate-700/80 dark:bg-slate-900/50 sm:flex-col sm:p-5">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/[0.12] text-brand-600 dark:bg-brand-400/15 dark:text-brand-300 sm:size-11"
                  aria-hidden
                >
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
                    {hint}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 sm:mt-10">
          <WhatsAppButton className="w-full justify-center sm:w-auto">
            Message us on WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  )
}
