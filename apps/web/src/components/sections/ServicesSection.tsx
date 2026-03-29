import type { FC, SVGProps } from 'react'
import { SectionIntro } from '@/components/sections/SectionIntro'

type IconProps = SVGProps<SVGSVGElement>

/** Stroke icons tuned for ~32px display — simple silhouettes read clearly on dark cards. */
function IconExpress({ className, ...p }: IconProps) {
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
      <path d="M14 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v11a1 1 0 001 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0017.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

function IconShoppingBag({ className, ...p }: IconProps) {
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
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function IconGrocery({ className, ...p }: IconProps) {
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
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 3h2l1.5 12.5a2 2 0 002 1.5h10.5a2 2 0 002-1.5L22 8H6" />
    </svg>
  )
}

function IconBankPaper({ className, ...p }: IconProps) {
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
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h6M8 9h4" />
    </svg>
  )
}

function IconGift({ className, ...p }: IconProps) {
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
      <path d="M20 12v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8" />
      <path d="M4 12h16" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  )
}

function IconBulky({ className, ...p }: IconProps) {
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
      <path d="M4 7a2 2 0 012-2h7a2 2 0 012 2v3H4V7z" />
      <path d="M2 10h20v9a2 2 0 01-2 2H4a2 2 0 01-2-2v-9z" />
      <path d="M12 7v3" />
    </svg>
  )
}

function IconCar({ className, ...p }: IconProps) {
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
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.5-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

function IconQueue({ className, ...p }: IconProps) {
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
      <path d="M6 4h16M6 9h16M6 14h16M6 19h12" />
      <circle cx="3" cy="4" r="1.25" fill="currentColor" />
      <circle cx="3" cy="9" r="1.25" fill="currentColor" />
      <circle cx="3" cy="14" r="1.25" fill="currentColor" />
    </svg>
  )
}

function IconPaw({ className, ...p }: IconProps) {
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
      <ellipse cx="12" cy="14.5" rx="4" ry="3.5" />
      <circle cx="8.5" cy="9" r="1.75" />
      <circle cx="15.5" cy="9" r="1.75" />
      <circle cx="6.5" cy="12" r="1.5" />
      <circle cx="17.5" cy="12" r="1.5" />
    </svg>
  )
}

function IconHomeKey({ className, ...p }: IconProps) {
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
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  )
}

function IconBriefcase({ className, ...p }: IconProps) {
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
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <path d="M12 12v4" />
    </svg>
  )
}

function IconPharmacy({ className, ...p }: IconProps) {
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
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function IconMessageSpark({ className, ...p }: IconProps) {
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

const services: { title: string; tagline: string; Icon: FC<IconProps> }[] = [
  {
    title: 'Express delivery',
    tagline: 'Parcels and documents—picked up and dropped off the same day.',
    Icon: IconExpress,
  },
  {
    title: 'Personal shopping',
    tagline: 'We buy from stores you choose and deliver to your door.',
    Icon: IconShoppingBag,
  },
  {
    title: 'Groceries & takeout',
    tagline: 'Supermarkets, cafés, and ready-to-eat pickup runs.',
    Icon: IconGrocery,
  },
  {
    title: 'Pharmacy runs',
    tagline: 'Prescriptions and health essentials, handled discreetly.',
    Icon: IconPharmacy,
  },
  {
    title: 'Banking & paperwork',
    tagline: 'Cheques, deposits, signatures, and document handovers.',
    Icon: IconBankPaper,
  },
  {
    title: 'Gifts & luxe shopping',
    tagline: 'Flowers, surprises, and boutique purchases with care.',
    Icon: IconGift,
  },
  {
    title: 'Furniture & bulky pickup',
    tagline: 'Large-store, IKEA-style, and heavy items to your home.',
    Icon: IconBulky,
  },
  {
    title: 'Car & motor errands',
    tagline: 'Testing centres, renewals, and agency visits.',
    Icon: IconCar,
  },
  {
    title: 'Queue & wait service',
    tagline: 'We wait in line at banks, counters, and busy venues.',
    Icon: IconQueue,
  },
  {
    title: 'Pet taxi & vet trips',
    tagline: 'Safe rides to the vet and trusted on-the-ground help.',
    Icon: IconPaw,
  },
  {
    title: 'Home & key handovers',
    tagline: 'Check-ins, access handovers, and errands at your place.',
    Icon: IconHomeKey,
  },
  {
    title: 'Office & business',
    tagline: 'Last-mile jobs, supplies, and admin for teams—one thread.',
    Icon: IconBriefcase,
  },
  {
    title: 'Anything legal',
    tagline: 'Describe it on WhatsApp; we quote clearly and get it done.',
    Icon: IconMessageSpark,
  },
]

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative scroll-mt-20 overflow-hidden border-b border-slate-200 bg-slate-50 py-12 sm:py-16 dark:border-slate-800 dark:bg-slate-950"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[length:40px_40px] bg-grid-slate opacity-50 dark:opacity-30"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="What we do"
          title="Services"
          description="Pick what fits your errand, then message us on WhatsApp—updates stay in one chat."
        />

        <ul
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          {services.map(({ title, tagline, Icon }) => (
            <li key={title} className="min-w-0">
              <div
                className="group flex h-full min-h-[9.5rem] flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition active:scale-[0.98] sm:min-h-[10.5rem] sm:rounded-3xl sm:p-5 dark:border-slate-700/80 dark:bg-slate-900/70 dark:ring-white/[0.06] dark:active:bg-slate-800/80"
                role="presentation"
              >
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/[0.12] text-brand-600 transition group-hover:bg-brand-500/[0.18] dark:bg-brand-400/15 dark:text-brand-300 dark:group-hover:bg-brand-400/25 sm:size-14 sm:rounded-2xl"
                  aria-hidden
                >
                  <Icon className="size-6 sm:size-7" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-display text-sm font-semibold leading-snug text-slate-900 sm:text-base dark:text-white">
                    {title}
                  </p>
                  <p className="mt-1.5 text-left text-[11px] leading-relaxed text-slate-600 sm:text-xs dark:text-slate-400">
                    {tagline}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
